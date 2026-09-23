import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const app = read("src/App.tsx");
const appCss = read("src/App.css");
const indexCss = read("src/index.css");
const indexHtml = read("index.html");
const freshness = JSON.parse(read("src/data/freshness.json"));
const shares = JSON.parse(read("src/data/verified-shares.json"));
const refreshScript = read("scripts/refresh-data.mjs");
const workflowUrl = new URL("../.github/workflows/pages.yml", import.meta.url);
const workflow = existsSync(workflowUrl) ? readFileSync(workflowUrl, "utf8") : "";

test("approved product and masterbrand lockup is explicit", () => {
  const productLogo = readFileSync(new URL("../public/logo.png", import.meta.url));
  assert.equal(createHash("sha256").update(productLogo).digest("hex"), "5822e425d9b32e58c132737f52d83d6b1f583d51c46dba4f8c103db9b05b9d85");
  assert.match(app, /src="\/NuclearEnergyIntelligence\/logo\.png"/);
  assert.match(app, /alt="Nuclear Energy Intelligence"/);
  assert.match(app, /src="\/NuclearEnergyIntelligence\/mct-logo\.png"/);
  assert.match(app, /alt="Monarch Castle Technologies"/);
  assert.match(app, />Part of Monarch Castle Technologies\.</);
  assert.equal((app.match(/<h1\b/g) ?? []).length, 1);
});

test("the public view shows only source-traced shares", () => {
  assert.match(app, /verified-shares\.json/);
  assert.match(app, /observationYear/);
  assert.match(app, /publication boundary/i);
  assert.match(app, /dated primary source/i);
  assert.match(app, /freshness\.sourceUrl/);
  assert.doesNotMatch(app, /reactors\.json|chokepoints\.json|uranium_cycle\.json|exposure\.json/);
  assert.equal(shares.length, 23);
  assert.ok(shares.every((row) => Number.isFinite(row.nuclearSharePct) && Number.isInteger(row.observationYear)));
});

test("method and limits are visible beside the data", () => {
  assert.match(app, /latest available annual observation/);
  assert.match(app, /at least 20 country matches/);
  assert.match(app, /last known good values were retained/);
  assert.match(app, /not a complete global reactor inventory or a forecast/);
  assert.match(app, /Read the refresh method/);
  assert.match(app, /rel="noreferrer"/);
  assert.match(app, /<time dateTime=\{freshness\.checkedAt\}>/);
});

test("search and table retain accessible native semantics", () => {
  assert.match(app, /<a className="skip-link" href="#main-content">/);
  assert.match(app, /<main id="main-content"/);
  assert.match(app, /type="search"/);
  assert.match(app, /<table className="verification-table">/);
  assert.match(app, /scope="row"/);
  assert.match(app, /scope="col"/);
  assert.match(appCss + indexCss, /:focus-visible/);
});

test("shared design tokens and responsive layout remain in place", () => {
  for (const contract of [/--bg:\s*#15130f/, /--accent:\s*#c9a24b/, /--font-heading:\s*'Spectral'/, /--font-body:\s*'IBM Plex Sans'/]) assert.match(indexCss, contract);
  assert.match(appCss, /\.verification-page/);
  assert.match(appCss, /@media \(max-width: 700px\)/);
  assert.match(indexHtml, /width=device-width, initial-scale=1\.0/);
});

test("Pages workflow deploys the source-traced snapshot", () => {
  assert.match(workflow, /npm ci/);
  assert.match(workflow, /npm run refresh:data/);
  assert.match(workflow, /git add src\/data\/verified-shares\.json src\/data\/freshness\.json/);
  assert.match(workflow, /npm test/);
  assert.match(workflow, /npm run lint/);
  assert.match(workflow, /npm run build/);
  assert.match(workflow, /path:\s*\.\/dist/);
});

test("metadata and public copy avoid unsupported operational claims", () => {
  assert.match(indexHtml, /name="description"/);
  assert.doesNotMatch(app, /\bguaranteed\b|\brisk-free\b|\bwill outperform\b|\blive data\b|\breal-time\b/i);
  assert.doesNotMatch(app, /CapitalScatterplot|FuelCycleMatrix|RetirementCliffChart|MapComponent/);
});

test("keyless refresh records honest last-known-good freshness", () => {
  assert.equal(freshness.sourceUrl, "https://ourworldindata.org/grapher/share-electricity-nuclear.csv");
  assert.ok(["current", "retained"].includes(freshness.status));
  assert.ok(Number.isInteger(freshness.dataThroughYear));
  assert.match(refreshScript, /AbortSignal\.timeout/);
  assert.match(refreshScript, /observationYear: latest\.year/);
  assert.match(refreshScript, /Retained last known good data/);
  assert.doesNotMatch(refreshScript, /process\.env\.[A-Z_]*(KEY|TOKEN)/);
});
