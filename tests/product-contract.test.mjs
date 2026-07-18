import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const app = read("src/App.tsx");
const appCss = read("src/App.css");
const indexCss = read("src/index.css");
const indexHtml = read("index.html");
const policyModal = read("src/PolicyModal.tsx");
const workflowUrl = new URL("../.github/workflows/pages.yml", import.meta.url);
const workflow = existsSync(workflowUrl) ? readFileSync(workflowUrl, "utf8") : "";

test("approved product and masterbrand lockup is explicit", () => {
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
  assert.match(app, /<time dateTime="2026-03-01T10:58:22\+03:00">/);
  assert.match(app, /Research snapshot: 1 March 2026/);
  assert.match(app, /Method version/);
  assert.match(app, /NEI-M1\.0/);
  assert.match(app, /Release provenance/);
  assert.match(app, /Point-in-time analyst-curated snapshot/);
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
  assert.match(workflow, /node --test tests\/\*\.test\.mjs/);
  assert.match(workflow, /npm run build/);
  assert.match(workflow, /path:\s*\.\/dist/);
  assert.match(workflow, /actions\/deploy-pages@v4/);
  assert.match(workflow, /pages:\s*write/);
  assert.match(workflow, /id-token:\s*write/);
});

test("head metadata and analytical copy avoid prohibited certainty claims", () => {
  assert.match(indexHtml, /name="description"/);
  assert.doesNotMatch(app, /\bguaranteed\b|\brisk-free\b|\bwill outperform\b/i);
  assert.doesNotMatch(app, /\blive data\b|\breal-time\b/i);
});
