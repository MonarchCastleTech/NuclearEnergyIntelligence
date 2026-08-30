import { readFile, writeFile } from "node:fs/promises";

const SOURCE_URL = "https://ourworldindata.org/grapher/share-electricity-nuclear.csv";
const exposureUrl = new URL("../src/data/exposure.json", import.meta.url);
const freshnessUrl = new URL("../src/data/freshness.json", import.meta.url);

const aliases = new Map([
  ["Korea, Republic of", "South Korea"],
  ["United States of America", "United States"],
  ["Russian Federation", "Russia"],
]);

function parseCsvLine(line) {
  const cells = [];
  let value = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"' && line[index + 1] === '"') {
      value += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      cells.push(value);
      value = "";
    } else {
      value += char;
    }
  }
  cells.push(value);
  return cells;
}

async function writeFreshness(previous, status, detail, dataThroughYear = previous.dataThroughYear) {
  const next = {
    source: "Our World in Data — Nuclear share of electricity",
    sourceUrl: SOURCE_URL,
    checkedAt: new Date().toISOString(),
    dataThroughYear,
    status,
    detail,
  };
  await writeFile(freshnessUrl, `${JSON.stringify(next, null, 2)}\n`);
}

const exposure = JSON.parse(await readFile(exposureUrl, "utf8"));
let previous = { dataThroughYear: null };
try {
  previous = JSON.parse(await readFile(freshnessUrl, "utf8"));
} catch {
  // First refresh creates the metadata file.
}

try {
  const response = await fetch(SOURCE_URL, {
    headers: { "user-agent": "NuclearEnergyIntelligence/1.0 (public research refresh)" },
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) throw new Error(`source returned HTTP ${response.status}`);

  const lines = (await response.text()).trim().split(/\r?\n/);
  const latestByEntity = new Map();
  for (const line of lines.slice(1)) {
    const [entity, , yearText, valueText] = parseCsvLine(line);
    const year = Number(yearText);
    const value = Number(valueText);
    if (!entity || !Number.isFinite(year) || !Number.isFinite(value)) continue;
    const current = latestByEntity.get(entity);
    if (!current || year > current.year) latestByEntity.set(entity, { year, value });
  }

  let matches = 0;
  let dataThroughYear = 0;
  const refreshed = exposure.map((row) => {
    const sourceName = aliases.get(row.countryName) ?? row.countryName;
    const latest = latestByEntity.get(sourceName);
    if (!latest) return row;
    matches += 1;
    dataThroughYear = Math.max(dataThroughYear, latest.year);
    return { ...row, nuclearSharePct: Number(latest.value.toFixed(1)) };
  }).sort((a, b) => b.nuclearSharePct - a.nuclearSharePct);

  if (matches < 20 || dataThroughYear < 2023) {
    throw new Error(`source validation failed (${matches} matches; latest year ${dataThroughYear})`);
  }

  await writeFile(exposureUrl, `${JSON.stringify(refreshed, null, 4)}\n`);
  await writeFreshness(previous, "current", `Updated ${matches} country shares from the latest available annual series.`, dataThroughYear);
  console.log(`Updated ${matches} country shares; data through ${dataThroughYear}.`);
} catch (error) {
  await writeFreshness(previous, "retained", `Source check failed; retained the last known good dataset. ${error.message}`);
  console.warn(`Retained last known good data: ${error.message}`);
}
