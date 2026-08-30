import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const app = read("src/App.tsx");
const appCss = read("src/App.css");
const indexCss = read("src/index.css");
const indexHtml = read("index.html");
const policyModal = read("src/PolicyModal.tsx");
const capitalChart = read("src/components/CapitalScatterplot.tsx");
const retirementChart = read("src/components/RetirementCliffChart.tsx");
const freshness = JSON.parse(read("src/data/freshness.json"));
const refreshScript = read("scripts/refresh-data.mjs");
const workflowUrl = new URL("../.github/workflows/pages.yml", import.meta.url);
const workflow = existsSync(workflowUrl) ? readFileSync(workflowUrl, "utf8") : "";

test("approved product and masterbrand lockup is explicit", () => {
  const productLogo = readFileSync(new URL("../public/logo.png", import.meta.url));
  assert.equal(
    createHash("sha256").update(productLogo).digest("hex"),
    "5822e425d9b32e58c132737f52d83d6b1f583d51c46dba4f8c103db9b05b9d85",
  );
  assert.match(app, /src="\/NuclearEnergyIntelligence\/logo\.png"/);
  assert.match(app, /alt="Nuclear Energy Intelligence"/);
  assert.match(app, /src="\/NuclearEnergyIntelligence\/mct-logo\.png"/);
  assert.match(app, /alt="Monarch Castle Technologies"/);
  assert.match(app, />Part of Monarch Castle Technologies\.</);
  assert.equal((app.match(/<h1\b/g) ?? []).length, 1, "the page must expose one h1");
});

test("evidence register separates analytical classes and shows source links", () => {
  assert.match(app, /id="evidence-register"/);
  for (const label of ["Observed data", "Assessment", "Scenario", "Forecast"]) {
    assert.match(app, new RegExp(`data-evidence-class="${label.toLowerCase().replace(" ", "-")}"`));
    assert.match(app, new RegExp(`>${label}<`));
  }
  assert.match(app, /https:\/\/pris\.iaea\.org\/PRIS\/home\.aspx/);
  assert.match(app, /International Atomic Energy Agency \(IAEA\) PRIS/);
  assert.match(app, /OECD Nuclear Energy Agency/);
  assert.match(app, /rel="noreferrer"/);
});

test("release freshness, method version, provenance, confidence, and limitations are visible", () => {
  assert.match(app, /Source check:/);
  assert.match(app, /Annual data through/);
  assert.match(app, /Method version/);
  assert.match(app, /NEI-M1\.1/);
  assert.match(app, /Release provenance/);
  assert.match(app, /Last source check/);
  assert.match(app, /last known good values retained/);
  assert.match(app, /Confidence/);
  assert.match(app, /Moderate/);
  assert.match(app, /Uncertainty/);
  assert.match(app, /Forecast limitations/);
  assert.ok(
    app.indexOf("Forecast limitations") < app.indexOf("Performance context"),
    "forecast limitations must precede performance wording",
  );
});

test("interactive controls expose native semantics and current state", () => {
  assert.match(app, /<a className="skip-link" href="#main-content">/);
  assert.match(app, /<main id="main-content">/);
  assert.match(app, /<button[^>]+onClick=\{\(\) => setActiveModal\('methodology'\)\}/s);
  assert.match(app, /aria-pressed=\{!showChokepoints && filters\.operational\}/);
  assert.match(app, /aria-pressed=\{showChokepoints\}/);
  assert.match(app, /aria-label="Industrial decay timeline year"/);
  assert.match(app, /tabIndex=\{0\}/);
  assert.match(app, /onKeyDown=\{\(event\) => handleFacilityKeyDown/s);
  assert.match(appCss + indexCss, /:focus-visible/);
  assert.match(policyModal, /role="dialog"/);
  assert.match(policyModal, /aria-modal="true"/);
  assert.match(policyModal, /aria-labelledby="policy-modal-title"/);
  assert.match(policyModal, /event\.key === 'Escape'/);
  assert.match(policyModal, /aria-label="Close dialog"/);
});

test("shared design tokens and responsive evidence-heavy layouts are enforced", () => {
  for (const contract of [
    /--bg:\s*#15130f/,
    /--bg-card:\s*#17140f/,
    /--border:\s*#2c2820/,
    /--accent:\s*#c9a24b/,
    /--text:\s*#ece6d8/,
    /--text-muted:\s*#9a9284/,
    /--font-heading:\s*'Spectral'/,
    /--font-body:\s*'IBM Plex Sans'/,
    /--font-mono:\s*'IBM Plex Mono'/,
  ]) {
    assert.match(indexCss, contract);
  }
  assert.match(appCss, /@media \(max-width:\s*900px\)/);
  assert.match(appCss, /@media \(max-width:\s*640px\)/);
  assert.match(appCss, /overflow-wrap:\s*anywhere/);
  assert.match(appCss, /min-width:\s*0/);
  assert.match(indexHtml, /width=device-width, initial-scale=1\.0/);
});

test("standard Pages workflow validates and deploys the same Vite artifact", () => {
  assert.match(workflow, /node-version:\s*20/);
  assert.match(workflow, /npm ci/);
  assert.match(workflow, /npm test/);
  assert.match(workflow, /npm run lint/);
  assert.match(workflow, /npm run build/);
  assert.match(workflow, /path:\s*\.\/dist/);
  assert.match(workflow, /actions\/deploy-pages@v4/);
  assert.match(workflow, /pages:\s*write/);
  assert.match(workflow, /id-token:\s*write/);
  assert.match(workflow, /schedule:/);
  assert.match(workflow, /npm run refresh:data/);
  assert.match(workflow, /git push/);
});

test("head metadata and analytical copy avoid prohibited certainty claims", () => {
  assert.match(indexHtml, /name="description"/);
  const userCopy = app + capitalChart + retirementChart;
  assert.doesNotMatch(userCopy, /\bguaranteed\b|\brisk-free\b|\bwill outperform\b|\bimpossible\b|infinite risk premium/i);
  assert.doesNotMatch(app, /\blive data\b|\breal-time\b/i);
});

test("keyless refresh records honest last-known-good freshness", () => {
  assert.equal(freshness.sourceUrl, "https://ourworldindata.org/grapher/share-electricity-nuclear.csv");
  assert.ok(["current", "retained"].includes(freshness.status));
  assert.ok(Number.isInteger(freshness.dataThroughYear));
  assert.match(refreshScript, /AbortSignal\.timeout/);
  assert.match(refreshScript, /Retained last known good data/);
  assert.doesNotMatch(refreshScript, /process\.env\.[A-Z_]*(KEY|TOKEN)/);
});
