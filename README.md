<div align="center">
  <picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/monarchcastletech/NuclearEnergyIntelligence/main/docs/logo-dark.png"><img src="docs/logo.png" alt="Nuclear Energy Intelligence logo" width="140"></picture>
  <!-- CODEX: generate a clean product logo — a stylized reactor containment dome / atomic core rendered as a minimalist crest in deep navy (#0b1f3a) and a single warning-red accent, matching the Monarch Castle dark, monospace intelligence aesthetic. Transparent background, square. -->

  # Nuclear Energy Intelligence
  ### Mapping global nuclear exposure, supply-chain chokepoints, and the coming retirement cliff

  ![status](https://img.shields.io/badge/status-active-brightgreen)
  ![division](https://img.shields.io/badge/Energy%20Intelligence-0b1f3a)
  ![Monarch Castle](https://img.shields.io/badge/Monarch%20Castle-Holdings-1f6feb)
  ![license](https://img.shields.io/badge/license-see%20LICENSE-lightgrey)

  ![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?logo=typescript&logoColor=white)
  ![Vite](https://img.shields.io/badge/Vite-7-646cff?logo=vite&logoColor=white)
  ![GitHub Pages](https://img.shields.io/badge/hosted%20on-GitHub%20Pages-222?logo=github)
</div>

> **Executive summary** — The Nuclear Energy Intelligence Portal is an interactive geopolitical brief that maps the structural constraints governing the future of global zero-carbon baseload power. It serves energy strategists, policy analysts, and capital allocators by translating reactor fleets, fuel-cycle concentration, and heavy-manufacturing chokepoints into decision-grade visual intelligence — exposing where dependence, deficit, and demographic decay collide.

## ✨ Highlights
- **Exposure ranking array** — ranks nations by absolute dependence on nuclear generation versus structural capacity, separating large grid-buffering fleets from single-site national single-points-of-failure.
- **Supply-chain chokepoint map** — a dark, interactive geospatial view that toggles between operating reactors and the ultra-heavy forging nodes (Japan, China, Russia, France) that physically gate Gen-III+ construction.
- **Capital destruction tracker** — a delay-versus-cost matrix visualizing the schedule and budget overruns endemic to Western greenfield reactor builds.
- **The retirement cliff** — fleet age profiling that surfaces the medium-term baseload risk as the 1970s/1980s build cohorts approach their 60-year terminal limits.
- **Fuel-cycle concentration matrix** — stage-by-stage breakdown of mining, conversion, and enrichment leadership, highlighting Russian dominance of the SWU bottleneck.
- **Regional target dossiers** — focused deep dives, including the Akkuyu VVER build-out anchoring Türkiye's industrial energy future.
- **Methodology in the open** — every assessment is framed by the Monarch Castle Tri-Color Severity Scale, exposed in an in-app methodology memo.

## 🖼️ Preview
<!-- CODEX: capture real screenshots of the running portal (npm run dev) and drop them into docs/ -->
<!-- ![Nuclear Energy Intelligence — global reactor & chokepoint map](docs/screenshot-1.png) (screenshot pending) -->
<!-- CODEX: dark-theme Leaflet world map showing reactor markers and the supply-chain chokepoint toggle active -->

<!-- ![Nuclear Energy Intelligence — exposure ranking table](docs/screenshot-2.png) (screenshot pending) -->
<!-- CODEX: the Exposure Ranking Array table, France at top, showing nuclear share %, reactor count, net capacity -->

<!-- ![Nuclear Energy Intelligence — capital & retirement analytics](docs/screenshot-3.png) (screenshot pending) -->
<!-- CODEX: side-by-side of the Capital Scatterplot (delay vs cost) and the Retirement Cliff bar chart -->

## 🧭 What it does
The portal is a single-page analytical brief composed of linked intelligence modules. Each module reads a curated dataset and renders it through a purpose-built visualization rather than a generic chart.

- **Exposure Table** — country-level nuclear share, active reactor count, and net capacity, ranked to distinguish *dependence* from *scale*.
- **Interactive Map** — a label-stripped dark Leaflet map plotting reactor sites and, on toggle, the ultra-heavy forging and fuel-cycle chokepoints that constrain new build.
- **Capital Scatterplot** — plots project cost against schedule delay to make Western greenfield cost-overrun patterns legible at a glance.
- **Fuel Cycle Matrix** — decomposes the front end of the fuel cycle (mining → conversion → enrichment) into per-stage market leadership.
- **Retirement Cliff Chart** — age-profiles the operating fleet to expose the coming wave of terminal-limit retirements.
- **Türkiye Dossier** — a regional strategic deep dive on the Akkuyu VVER program.
- **Featured Reports & Policy Memo** — short narrative briefs and a methodology modal explaining the assessment framework.

## 🗂️ Data & provenance
Per Monarch Castle doctrine — **evidence before assertion**. The portal is driven by versioned, analyst-curated reference datasets committed in-repo under `src/data/`, so every figure on screen is traceable to a specific record in source control:

| Dataset | Records | Key fields |
|---|---|---|
| `exposure.json` | National nuclear dependence | `countryName`, `nuclearSharePct`, `activeReactorCount`, `activeNetCapacityMw` |
| `reactors.json` | Reactor sites & units | `location`, `lat/lng`, `capacityMw`, `gridShare`, `buildYear`, `capitalCostBillion`, `delayYears`, `supplyChainRisk`, `capacityHistory` |
| `chokepoints.json` | Heavy-forging / fuel-cycle nodes | `name`, `country`, `lat/lng`, `status`, `type`, `description` |
| `uranium_cycle.json` | Fuel-cycle stages | `process`, `unit`, per-stage `leaders[]` with `sharePct` |

**Assessment methodology.** Industrial processes are scored against a three-level constraint scale — `SEVERE CONSTRAINT` / `HIGH CONSTRAINT` / `SITE-DEPENDENT` — informed by permitting, financing and delivery evidence. These are comparative assessments, not deterministic outcomes. The framework is documented in the in-app *Intelligence Methodology* memo.

> **Provenance.** Nuclear generation shares refresh weekly from the keyless Our World in Data series. Detailed reactor, capacity, project and chokepoint records remain analyst-curated reference sets; source age is disclosed in the interface.

## 🛠️ Tech stack
- **UI:** React 19 + TypeScript 5.9 (strict)
- **Build / dev server:** Vite 7 (fast HMR, optimized production bundling)
- **Geospatial:** Leaflet + react-leaflet (dark, label-stripped interactive map)
- **Charts:** Recharts (scatter plots, demographic bar charts)
- **Quality:** ESLint 9 + typescript-eslint
- **Deploy:** `gh-pages` → **GitHub Pages** (static hosting)

## 🚀 Getting started
**Live brief:** https://monarchcastletech.github.io/NuclearEnergyIntelligence/

Requires Node.js 18+ and npm.

```bash
# 1. Install dependencies
npm install

# 2. Run the dev server (http://localhost:5173)
npm run dev

# 3. Type-check + build a production bundle into /dist
npm run build

# 4. Preview the production build locally
npm run preview

# 5. Deploy the /dist bundle to GitHub Pages
npm run deploy
```

The compiled `/dist` folder is fully static and can be hosted on any CDN or object store to specification.

## 🧱 Part of Monarch Castle
> A product of **Energy Intelligence** · **Monarch Castle Technologies** — an operating company of **[Monarch Castle Holdings](https://github.com/MonarchCastleHoldings)**.
> Sister companies: [Monarch Castle Technologies](https://github.com/monarchcastletech) · [Strategic Data Company of Ankara](https://github.com/SDCofA)

## 📜 License
See `LICENSE`. © 2026 Monarch Castle Holdings · Ankara, Türkiye.

<div align="center"><sub>🏰 Monarch Castle Holdings — turning open-source noise into lawful, verified, decision-grade intelligence.</sub></div>

---

<!-- repository-hygiene:start -->

![Monarch Castle Technologies approved lockup](docs/brand/organization-lockup.png)

Interactive geopolitical intelligence brief mapping global nuclear exposure, supply-chain chokepoints, fuel-cycle concentration, and the coming reactor retirement cliff.

![Lifecycle: Active](docs/lifecycle-active.svg)

## Repository status

Lifecycle: **Active**. The badge and this statement describe maintenance status, not service availability.

## Public access

[Open the published project](https://monarchcastletech.github.io/NuclearEnergyIntelligence/)

## Screenshots

![Nuclear Energy Intelligence repository preview](docs/social-preview.png)

The preview is maintained as a repository asset; the live interface or generated output remains authoritative.

## Data and methodology

- [README.md](README.md)
- [src/](src/)

These repository-specific sources define the methodology or provenance boundary. Source dates, transformation steps, and known gaps must travel with analytical outputs.

## Update frequency

Weekly automated source check and GitHub Pages deployment. If the public source is unavailable or invalid, the workflow retains the last known good dataset and records the failed check.

## Quick start

```shell
npm ci
```

```shell
npm run dev
```

Run only in a trusted development environment and review repository-specific prerequisites before using networked or hardware features.

## Architecture

- `src/` — repository-specific implementation, data, or configuration boundary.
- `public/` — repository-specific implementation, data, or configuration boundary.

## Tests

```shell
npm test
```

```shell
npm run lint
```

```shell
npm run build
```

## Provenance

Original software history is maintained in Git. External datasets, reports, trademarks, screenshots, and assets are not relicensed by this repository; see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) before reuse.

## Forecast limitations

Scenarios and scores are comparative analytical aids. Review their source dates, assumptions and methodology before use.

## Security

Do not publish vulnerabilities in an issue. Use GitHub's private vulnerability-reporting flow when available, or follow the [organization security policy](https://github.com/MonarchCastleTech/.github/security/policy).

## License

Original repository code and documentation are available under **MIT**; see [LICENSE](LICENSE). That license does not override third-party terms documented in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## Citation

Use the machine-readable [CITATION.cff](CITATION.cff). Cite the specific commit and, for analytical use, record the data or model snapshot date.

## Masterbrand endorsement

Nuclear Energy Intelligence is a Monarch Castle Technologies project. **Part of Monarch Castle Technologies.**

<!-- repository-hygiene:end -->
