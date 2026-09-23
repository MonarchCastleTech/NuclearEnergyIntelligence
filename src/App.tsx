import { useMemo, useState } from 'react';
import shares from './data/verified-shares.json';
import freshness from './data/freshness.json';
import './App.css';

type ShareRow = {
  countryCode: string;
  countryName: string;
  nuclearSharePct: number;
  observationYear?: number;
};

const rows = shares as ShareRow[];
const percentage = new Intl.NumberFormat('en', { maximumFractionDigits: 1 });
const sourceCheck = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
}).format(new Date(freshness.checkedAt));

export default function App() {
  const [query, setQuery] = useState('');
  const filteredRows = useMemo(
    () => rows.filter((row) => row.countryName.toLowerCase().includes(query.trim().toLowerCase())),
    [query],
  );

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to data</a>
      <nav className="site-nav scrolled" aria-label="Primary navigation">
        <div className="nav-inner">
          <a href="#top" className="nav-brand" aria-label="Nuclear Energy Intelligence home">
            <img className="product-mark" src="/NuclearEnergyIntelligence/logo.png" alt="Nuclear Energy Intelligence" />
            <div className="brand-copy">
              <span className="brand-title">Nuclear Energy Intelligence</span>
              <span className="brand-endorsement">Part of Monarch Castle Technologies.</span>
            </div>
            <span className="brand-divider" aria-hidden="true" />
            <img className="masterbrand-mark" src="/NuclearEnergyIntelligence/mct-logo.png" alt="Monarch Castle Technologies" />
          </a>
          <div className="nav-links">
            <a href="#data">Data</a>
            <a href="#methodology">Method</a>
            <a href="https://monarchcastle.com/products/">Products</a>
          </div>
        </div>
      </nav>

      <main id="main-content" className="verification-page">
        <header id="top" className="verification-hero">
          <p className="verification-eyebrow">SOURCE-TRACED SERIES / NUCLEAR ELECTRICITY</p>
          <h1>Where nuclear power shapes the grid.</h1>
          <p className="verification-lead">The share of electricity generated from nuclear power across 23 selected countries, using the latest available annual observation for each country.</p>
          <div className="verification-meta">
            <span><strong>23</strong> selected countries</span>
            <span><strong>{freshness.dataThroughYear}</strong> latest year in this selection</span>
            <span><strong>{freshness.status === 'current' ? 'CURRENT' : 'RETAINED'}</strong> source check</span>
          </div>
        </header>

        <section className="verification-notice" aria-labelledby="hold-title">
          <div>
            <p className="verification-eyebrow">PUBLICATION BOUNDARY</p>
            <h2 id="hold-title">Facility and project analysis is under source review.</h2>
          </div>
          <p>Reactor counts, plant capacities, construction costs, delays, capacity-factor histories, forging-site claims, and fuel-cycle market shares are withheld from this public view until each record has a dated primary source. The country electricity-share series below remains available.</p>
        </section>

        <section id="data" className="verification-data" aria-labelledby="data-title">
          <div className="verification-section-heading">
            <div>
              <p className="verification-eyebrow">OBSERVED DATA</p>
              <h2 id="data-title">Nuclear share of electricity</h2>
              <p>Percent of national electricity generation, rounded to one decimal. Observation years can differ by country.</p>
            </div>
            <label className="verification-search">
              Search countries
              <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Country name" />
            </label>
          </div>
          <div className="verification-table-wrap">
            <table className="verification-table">
              <thead><tr><th scope="col">Country</th><th scope="col">Nuclear share</th><th scope="col">Observation year</th></tr></thead>
              <tbody>
                {filteredRows.map((row) => (
                  <tr key={row.countryCode}>
                    <th scope="row"><span className="verification-code">{row.countryCode}</span>{row.countryName}</th>
                    <td><div className="verification-share"><span>{percentage.format(row.nuclearSharePct)}%</span><span className="verification-track" aria-hidden="true"><span style={{ width: `${Math.max(0, Math.min(100, row.nuclearSharePct))}%` }} /></span></div></td>
                    <td>{row.observationYear ?? 'Year unavailable'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredRows.length === 0 && <p className="verification-empty">No country in this selected set matches your search.</p>}
          </div>
        </section>

        <section id="methodology" className="verification-method" aria-labelledby="method-title">
          <div>
            <p className="verification-eyebrow">METHOD / PROVENANCE</p>
            <h2 id="method-title">One measure, one source trail.</h2>
          </div>
          <div>
            <p>The scheduled refresh reads the public Our World in Data CSV, selects the latest annual nuclear-electricity share for each named country, rounds it to one decimal place, and records its observation year. It requires at least 20 country matches and a latest source year of at least 2023 before replacing the last good snapshot.</p>
            <p>Last source check: <time dateTime={freshness.checkedAt}>{sourceCheck}</time>. {freshness.status === 'current' ? 'The source refresh succeeded.' : 'The last known good values were retained because the latest source check failed.'} This is a selected-country comparison, not a complete global reactor inventory or a forecast.</p>
            <a className="verification-source" href={freshness.sourceUrl} target="_blank" rel="noreferrer">Open the source CSV ↗</a>
            <a className="verification-source" href="https://github.com/MonarchCastleTech/NuclearEnergyIntelligence/blob/main/scripts/refresh-data.mjs" target="_blank" rel="noreferrer">Read the refresh method ↗</a>
          </div>
        </section>
      </main>
      <footer className="verification-footer"><span>NUCLEAR ENERGY INTELLIGENCE</span><span>Public data · declared limits · reproducible method</span></footer>
    </>
  );
}
