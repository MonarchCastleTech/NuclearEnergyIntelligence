import React, { useState, useEffect } from 'react';
import MapComponent from './MapComponent';
import DossierComponent from './DossierComponent';
import PolicyModal from './PolicyModal';
import { ExposureTable } from './components/ExposureTable';
import { FeaturedReports } from './components/FeaturedReports';
import reactorsData from './data/reactors.json';
import exposureData from './data/exposure.json';
import chokepointData from './data/chokepoints.json';
import { featuredReports } from './content/featuredReports';
import type { FeaturedReportFacts } from './lib/types';
import 'leaflet/dist/leaflet.css';
import './App.css';

// Phase II Imports
import CapitalScatterplot from './components/CapitalScatterplot';
import FuelCycleMatrix from './components/FuelCycleMatrix';
import RetirementCliffChart from './components/RetirementCliffChart';
import TurkiyeDossier from './components/TurkiyeDossier';

type SelectedFacility = (typeof reactorsData)[number] | (typeof chokepointData)[number];

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState<SelectedFacility | null>(null);
  const [filters, setFilters] = useState({
    operational: true,
    construction: true,
    shutdown: true,
  });
  const [showChokepoints, setShowChokepoints] = useState(false);
  const [timelineYear, setTimelineYear] = useState(2025);
  const [activeModal, setActiveModal] = useState<'methodology' | 'policy' | null>(null);

  // Parse the facts for the featured reports component
  const facts: FeaturedReportFacts = {
    france: {
      factText: "64.8% nuclear share | 56 active reactors | 61.4 GW active capacity"
    },
    concentration: {
      factText: "Slovenia relies on a single reactor for 36.8%; Bulgaria gets 40.5% exposure with 2 reactors; Slovakia hits 61.3% with 5 reactors."
    },
    scale: {
      factText: "United States: 95.8 GW at 18.5% | China: 53.2 GW at 4.9% | Korea: 25.8 GW at 31.5%"
    }
  };

  // Handle sticky nav scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFilter = (type: keyof typeof filters) => {
    setFilters(prev => ({ ...prev, [type]: !prev[type] }));
    if (selectedPlant && selectedPlant.status.toLowerCase() === type && filters[type]) {
      setSelectedPlant(null);
    }
  };

  const handleFacilityKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    facility: SelectedFacility,
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setSelectedPlant(facility);
    }
  };

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to intelligence brief</a>

      {/* ===== STICKY NAV ===== */}
      <nav className={`site-nav ${scrolled ? 'scrolled' : ''}`} aria-label="Primary navigation">
        <div className="nav-inner">
          <a href="#hero" className="nav-brand" aria-label="Nuclear Energy Intelligence home">
            <img className="product-mark" src="/NuclearEnergyIntelligence/logo.png" alt="Nuclear Energy Intelligence" />
            <div className="brand-copy">
              <span className="brand-title">Nuclear Energy Intelligence</span>
              <span className="brand-endorsement">Part of Monarch Castle Technologies.</span>
            </div>
            <span className="brand-divider" aria-hidden="true"></span>
            <img className="masterbrand-mark" src="/NuclearEnergyIntelligence/mct-logo.png" alt="Monarch Castle Technologies" />
          </a>
          <div className="nav-links">
            <a href="#reports-section" className="active">Reports</a>
            <a href="#table-section">Exposure Table</a>
            <a href="#map-section">The Fleet</a>
            <button onClick={() => setActiveModal('methodology')}>Methodology</button>
            <button className="policy-link" onClick={() => setActiveModal('policy')}>Policy memo</button>
          </div>
        </div>
      </nav>

      <main id="main-content">
      {/* ===== HERO ===== */}
      <section className="hero" id="hero" aria-labelledby="page-title">
        <div className="hero-grid-bg" aria-hidden="true"></div>
        <div className="hero-content">
          <p className="eyebrow">Independent energy systems research</p>
          <h1 className="hero-title" id="page-title">
            Nuclear<br /><span className="hero-title-accent text-red">Energy Intelligence</span>
          </h1>
          <p className="hero-subtitle">
            An intelligence brief detailing national dependence on nuclear generation,
            scale vs. exposure dynamics, and the operational fleet that powers the globe.
          </p>
          <p className="hero-tagline">
            "A nation that cannot forge its own pressure vessels cannot dictate its own nuclear sovereignty."
          </p>

          <div className="release-strip" aria-label="Research release status">
            <span className="release-status">Research release</span>
            <time dateTime="2026-03-01T10:58:22+03:00">Research snapshot: 1 March 2026</time>
            <span>Method version: NEI-M1.0</span>
          </div>

          <div className="severity-legend" aria-label="Map status legend">
            <div className="severity-item">
              <div className="severity-dot severity-dot--red" aria-hidden="true"></div>
              <span>Operational / Dominant</span>
            </div>
            <div className="severity-item">
              <div className="severity-dot severity-dot--orange" aria-hidden="true"></div>
              <span>Under Construction</span>
            </div>
            <div className="severity-item">
              <div className="severity-dot severity-dot--yellow" aria-hidden="true"></div>
              <span>Restricted / Offline</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS BANNER ===== */}
      <div className="stats-banner">
        <div className="stats-inner">
          <div className="stat-item">
            <div className="stat-number">64.8%</div>
            <div className="stat-label">Highest national exposure (France)</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">95.8 <span style={{ fontSize: '0.5em', verticalAlign: 'middle' }}>GW</span></div>
            <div className="stat-label">Largest scale operating capacity (USA)</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">30%</div>
            <div className="stat-label">Nations over 30% generating share</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">12+</div>
            <div className="stat-label">Years of regulatory delay for standard Western approvals</div>
          </div>
        </div>
      </div>

      {/* ===== RELEASE EVIDENCE ===== */}
      <section id="evidence-register" className="product-section evidence-register" aria-labelledby="evidence-title">
        <div className="section-header evidence-heading">
          <div>
            <p className="eyebrow">Evidence before assertion</p>
            <h2 id="evidence-title">Release method &amp; provenance</h2>
            <p className="section-header-sub">
              Point-in-time analyst-curated snapshot. This interface is not continuously updated.
            </p>
          </div>
          <button className="method-button" onClick={() => setActiveModal('methodology')}>
            Read full methodology
          </button>
        </div>

        <div className="evidence-grid">
          <article className="evidence-card" data-evidence-class="observed-data">
            <span className="evidence-kind">Observed data</span>
            <h3>Reported fleet &amp; generation</h3>
            <p>Country shares, reactor status, net capacity and project records reproduced from the committed research snapshot.</p>
            <dl>
              <div><dt>Confidence</dt><dd>Moderate</dd></div>
              <div><dt>Uncertainty</dt><dd>Source dates and later status changes</dd></div>
            </dl>
          </article>
          <article className="evidence-card" data-evidence-class="assessment">
            <span className="evidence-kind">Assessment</span>
            <h3>Industrial constraint scoring</h3>
            <p>Analyst interpretation of permitting, capital formation and heavy-manufacturing constraints.</p>
            <dl>
              <div><dt>Confidence</dt><dd>Moderate</dd></div>
              <div><dt>Uncertainty</dt><dd>Jurisdiction and policy can change</dd></div>
            </dl>
          </article>
          <article className="evidence-card" data-evidence-class="scenario">
            <span className="evidence-kind">Scenario</span>
            <h3>Age &amp; retirement stress</h3>
            <p>Exploratory pathways based on fleet age and selected retirement assumptions; not a scheduled outcome.</p>
            <dl>
              <div><dt>Confidence</dt><dd>Low–moderate</dd></div>
              <div><dt>Uncertainty</dt><dd>Life extensions and policy intervention</dd></div>
            </dl>
          </article>
          <article className="evidence-card" data-evidence-class="forecast">
            <span className="evidence-kind">Forecast</span>
            <h3>No point forecast published</h3>
            <p>Forward-looking statements are directional assessments only and are not probability-calibrated predictions.</p>
            <dl>
              <div><dt>Confidence</dt><dd>Not scored</dd></div>
              <div><dt>Uncertainty</dt><dd>Material and irreducible</dd></div>
            </dl>
          </article>
        </div>

        <div className="method-panel">
          <div>
            <h3>Method version</h3>
            <p><strong>NEI-M1.0</strong> · descriptive comparison, analyst classification and scenario framing.</p>
          </div>
          <div>
            <h3>Release provenance</h3>
            <p>Dataset commit <code>1a37fcd</code> · collected as a research release on 1 March 2026.</p>
          </div>
          <div>
            <h3>Source register</h3>
            <ul>
              <li>
                <a href="https://pris.iaea.org/PRIS/home.aspx" target="_blank" rel="noreferrer">
                  International Atomic Energy Agency (IAEA) PRIS
                </a>
              </li>
              <li>
                <a href="https://www.oecd-nea.org/jcms/pl_14934/nuclear-energy-data" target="_blank" rel="noreferrer">
                  OECD Nuclear Energy Agency
                </a>
              </li>
              <li>Repository snapshots in <code>src/data/</code>; values are unchanged in this release.</li>
            </ul>
          </div>
          <div className="limitations">
            <h3>Forecast limitations</h3>
            <p>Scenarios do not model every outage, life extension, licensing decision, commodity shock or technology change. Do not treat them as investment advice or expected outcomes.</p>
          </div>
          <div>
            <h3>Performance context</h3>
            <p>Historical capacity, cost and delay observations describe selected records; they do not establish future project performance.</p>
          </div>
        </div>
      </section>

      {/* ===== FEATURED REPORTS SECTION ===== */}
      <section id="reports-section" className="product-section reveal-section visible">
        <div className="section-header">
          <span className="evidence-pill assessment">Assessment · Moderate confidence</span>
          <h2>Featured Reports</h2>
          <p className="section-header-sub">The three stories that explain the current exposure map</p>
          <div className="section-rule"></div>
        </div>
        <FeaturedReports reports={featuredReports} facts={facts} />
      </section>

      {/* ===== EXPOSURE TABLE SECTION ===== */}
      <section id="table-section" className="product-section reveal-section visible">
        <div className="section-header">
          <span className="evidence-pill observed">Observed data · Moderate confidence</span>
          <h2>Nuclear Exposure Table</h2>
          <p className="section-header-sub">Countries ranked from highest to lowest dependence on nuclear generation</p>
          <div className="section-rule"></div>
        </div>

        <div className="section-layout">
          <div className="section-text" style={{ gridColumn: '1 / -1' }}>
            <p className="section-subtitle">
              Scale and generating share are distinct metrics. A country may have a massive operating fleet but minimal exposure, while another relies entirely on a single site.
            </p>
            <ExposureTable rows={exposureData} />
          </div>
        </div>
      </section>

      {/* ===== REGIONAL INTELLIGENCE ===== */}
      <section id="regional-section" className="product-section reveal-section visible">
        <span className="evidence-pill assessment">Assessment · Moderate confidence</span>
        <TurkiyeDossier />
      </section>

      {/* ===== FINANCIAL & COMMODITY INTELLIGENCE ===== */}
      <section id="financial-section" className="product-section reveal-section visible">
        <div className="section-header">
          <span className="evidence-pill scenario">Observed data + assessment + scenario</span>
          <h2>Geopolitical Indicators</h2>
          <p className="section-header-sub">Tracking the supply chain, capital destruction, and future deficits.</p>
          <div className="section-rule"></div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-8)' }}>
          <FuelCycleMatrix />
          <CapitalScatterplot />
          <RetirementCliffChart />
        </div>
      </section>

      {/* ===== MAP SECTION ===== */}
      <section id="map-section" className="reveal-section">
        <div className="map-section-inner">
          <div className="section-header">
            <span className="evidence-pill observed">Observed data · Snapshot dated 1 March 2026</span>
            <h2>The Operational Fleet</h2>
            <div className="section-rule"></div>
          </div>
          <p className="section-subtitle" style={{ marginBottom: '2rem' }}>
            These grandfathered gigawatt-scale facilities provide zero-carbon baseload power.
            If they closed, the regulatory environment ensures they could never be replaced identically.
          </p>

          <div className="filter-bar">
            {/* Same filter buttons with matching Reference classes */}
            <button
              className={`filter-btn ${!showChokepoints && filters.operational ? 'active' : ''}`}
              onClick={() => { setShowChokepoints(false); toggleFilter('operational'); }}
              aria-pressed={!showChokepoints && filters.operational}
            >
              Operational
            </button>
            <button
              className={`filter-btn ${!showChokepoints && filters.construction ? 'active' : ''}`}
              onClick={() => { setShowChokepoints(false); toggleFilter('construction'); }}
              aria-pressed={!showChokepoints && filters.construction}
            >
              Construction
            </button>
            <button
              className={`filter-btn ${!showChokepoints && filters.shutdown ? 'active' : ''}`}
              onClick={() => { setShowChokepoints(false); toggleFilter('shutdown'); }}
              aria-pressed={!showChokepoints && filters.shutdown}
            >
              Shutdown
            </button>

            <div style={{ width: '1px', background: 'var(--border)', margin: '0 var(--sp-2)' }}></div>

            <button
              className={`filter-btn ${showChokepoints ? 'active' : ''}`}
              onClick={() => setShowChokepoints(true)}
              aria-pressed={showChokepoints}
              style={{ color: showChokepoints ? 'var(--red)' : '' }}
            >
              Heavy Manufacturing (Chokepoints)
            </button>
          </div>

          <div className="timeline-container" style={{ marginBottom: 'var(--sp-6)', padding: 'var(--sp-4)', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--sp-3)' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', margin: 0, color: 'var(--text)' }}>Industrial Decay Timeline</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Filtering active facilities by build constraints.</span>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', fontWeight: 700, color: 'var(--red)', lineHeight: 1 }}>{timelineYear}</div>
            </div>
            <input
              type="range"
              min="1970"
              max="2030"
              value={timelineYear}
              onChange={(e) => setTimelineYear(parseInt(e.target.value))}
              aria-label="Industrial decay timeline year"
              style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--red)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--sp-2)', fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              <span>1970</span>
              <span>1990 (WESTERN PEAK)</span>
              <span>2010 (STAGNATION)</span>
              <span>2030</span>
            </div>
          </div>

          <div className="map-wrapper">
            <MapComponent
              onSelectPlant={setSelectedPlant}
              filterTypes={filters}
              timelineYear={timelineYear}
              showChokepoints={showChokepoints}
            />
            {/* Facility list matching the reference's layout for the map sidebar */}
            <div className="facility-list" id="facility-list">
              {!showChokepoints ? reactorsData.filter(r => {
                if (r.buildYear > timelineYear) return false;
                const statusLower = r.status.toLowerCase();
                if (statusLower === 'operational' && !filters.operational) return false;
                if (statusLower === 'construction' && !filters.construction) return false;
                if (statusLower === 'shutdown' && !filters.shutdown) return false;
                return true;
              }).map(plant => (
                <button
                  type="button"
                  key={plant.id}
                  className={`facility-card ${selectedPlant?.id === plant.id ? 'active' : ''}`}
                  onClick={() => setSelectedPlant(plant)}
                  tabIndex={0}
                  aria-pressed={selectedPlant?.id === plant.id}
                  onKeyDown={(event) => handleFacilityKeyDown(event, plant)}
                >
                  <h4>{plant.name}</h4>
                  <span className="facility-city">{plant.location.split(',')[0]} · Est. {plant.established}</span><br />
                  <span className="facility-type" style={{
                    color: plant.status === 'Operational' ? 'var(--red)' : plant.status === 'Construction' ? 'var(--orange)' : 'var(--yellow)',
                    background: plant.status === 'Operational' ? 'var(--red-bg)' : plant.status === 'Construction' ? 'var(--orange-bg)' : 'var(--yellow-bg)'
                  }}>
                    {plant.status}
                  </span>
                </button>
              )) : chokepointData.map(forge => (
                <button
                  type="button"
                  key={forge.id}
                  className="facility-card"
                  onClick={() => setSelectedPlant(forge)} // Reusing the dossier component for forges
                  tabIndex={0}
                  aria-pressed={selectedPlant?.id === forge.id}
                  onKeyDown={(event) => handleFacilityKeyDown(event, forge)}
                >
                  <h4>{forge.name}</h4>
                  <span className="facility-city">{forge.country}</span><br />
                  <span className="facility-type" style={{
                    color: 'var(--accent)',
                    background: 'var(--accent-dim)'
                  }}>
                    {forge.type}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {selectedPlant && (
            <div className={`facility-detail visible`} style={{
              borderLeftColor: selectedPlant.status === 'Operational' ? 'var(--red)' : selectedPlant.status === 'Construction' ? 'var(--orange)' : 'var(--yellow)'
            }}>
              <DossierComponent
                plant={selectedPlant}
                onClose={() => setSelectedPlant(null)}
              />
            </div>
          )}
        </div>
      </section>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="site-footer">
        <div className="footer-rule"></div>
        <div className="footer-inner">
          <div>
            <p className="footer-attribution">Nuclear Energy Intelligence</p>
            <p>Part of Monarch Castle Technologies.</p>
          </div>
          <p className="footer-freshness">
            <span>Point-in-time research release</span>
            <time dateTime="2026-03-01T10:58:22+03:00">Updated 1 March 2026</time>
          </p>
        </div>
      </footer>

      {/* ===== MODALS ===== */}
      {activeModal === 'methodology' && (
        <PolicyModal
          title="Intelligence Methodology"
          subtitle="MONARCH CASTLE TECHNOLOGIES ASSESSMENT FRAMEWORK"
          onClose={() => setActiveModal(null)}
          content={
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <p><strong>Method NEI-M1.0.</strong> The release combines descriptive observations from committed records with analyst assessments and explicitly labelled scenarios. It does not publish a probability-calibrated forecast.</p>
              <p>Our assessment framework categorically evaluates industrial processes based on historical permitting success rates, legal blockade velocity, and capital formation requirements in modern Western regulatory regimes.</p>

              <h4 style={{ color: 'var(--text)', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', margin: 0 }}>The Tri-Color Severity Scale</h4>
              <ul style={{ paddingLeft: '1.2rem', gap: '1rem', display: 'flex', flexDirection: 'column', margin: 0 }}>
                <li><strong style={{ color: 'var(--red)', fontFamily: 'var(--font-mono)' }}>IMPOSSIBLE:</strong> Processes with a 0% success rate in overcoming NEPA/NRC environmental impact litigation within the last 20 years. Capital markets assign an infinite risk premium to these greenfield projects.</li>
                <li><strong style={{ color: 'var(--orange)', fontFamily: 'var(--font-mono)' }}>EXTREMELY DIFFICULT:</strong> Processes achievable only by entity-level government carveouts, multi-billion dollar cost overruns, and routine schedule delays exceeding 100%.</li>
                <li><strong style={{ color: 'var(--yellow)', fontFamily: 'var(--font-mono)' }}>RESTRICTED:</strong> Processes practically confined to expanding footprint on pre-existing licensed nuclear sites ("brownfielding").</li>
              </ul>
              <p><strong>Limitations:</strong> classifications are sensitive to source coverage, policy change and analyst judgment. They are comparative signals, not deterministic outcomes or investment recommendations.</p>
              <p>By mapping the physical prerequisites of the fuel cycle against this legal-regulatory decay matrix, we assess possible long-term geopolitical leverage constraints.</p>
            </div>
          }
        />
      )}

      {activeModal === 'policy' && (
        <PolicyModal
          title="Policy Memo: The Forging Deficit"
          subtitle="LOSS OF WESTERN ULTRA-HEAVY MANUFACTURING CAPABILITY"
          onClose={() => setActiveModal(null)}
          content={
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <p><strong>SUBJECT:</strong> Strategic vulnerability stemming from the global consolidation of ultra-heavy forging presses.</p>
              <p>The construction of a monolithic Reactor Pressure Vessel (RPV) for Gen-III+ designs requires steel ingots often exceeding 500 tons. The presses capable of forging these ingots (14,000+ ton hydraulic presses paired with extreme-scale melt shops) are virtually extinct in the Western hemisphere.</p>

              <div style={{
                borderLeft: '2px solid var(--red)',
                paddingLeft: '1rem',
                backgroundColor: 'rgba(255, 51, 51, 0.05)',
                padding: '1rem'
              }}>
                <i>"A nation that cannot forge its own pressure vessels cannot dictate its own nuclear sovereignty. Relying on Japan Steel Works (JSW), China First Heavy Industries, or Russia's OMZ for the literal core of domestic power security presents an unhedged geopolitical vulnerability."</i>
              </div>

              <p>Reconstituting this supply chain is not merely a matter of capital allocation; it requires metallurgical institutional knowledge, heavy industrial zoning, and skilled tradesmen that have withered over four decades of service-economy transition.</p>
            </div>
          }
        />
      )}
    </>
  );
};

export default App;
