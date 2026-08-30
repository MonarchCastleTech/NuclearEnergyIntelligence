import React from 'react';
import type { SelectedFacility } from './lib/facilities';

interface DossierProps {
    plant: SelectedFacility;
    onClose: () => void;
}

const DossierComponent: React.FC<DossierProps> = ({ plant, onClose }) => {
    const isReactor = 'reactors' in plant;

    return (
        <>
            <div className="facility-detail-header">
                <div>
                    <h3 className="facility-detail-name">{plant.name}</h3>
                    <span className="facility-detail-meta">
                        {isReactor ? `${plant.location} · ${plant.capacityMw} MWe (${plant.gridShare} Grid Share)` : `${plant.country} · ${plant.type}`}
                    </span>
                </div>
                <button className="facility-detail-close" onClick={onClose} aria-label="Close">×</button>
            </div>
            <p className="facility-detail-desc">{plant.description}</p>

            {isReactor && <div className="intelligence-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)', marginTop: 'var(--sp-5)' }}>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--sp-2)' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>CAPITAL COST</span>
                    <div style={{ fontSize: '1.2rem', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>${plant.capitalCostBillion}B</div>
                </div>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--sp-2)' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>DELAY YEARS</span>
                    <div style={{ fontSize: '1.2rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: plant.delayYears > 0 ? 'var(--red)' : 'var(--text)' }}>
                        {plant.delayYears} YRS
                    </div>
                </div>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--sp-2)' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>SUPPLY CHAIN RISK</span>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: plant.supplyChainRisk.includes('Extreme') || plant.supplyChainRisk.includes('High') ? 'var(--orange)' : 'var(--text)' }}>
                        {plant.supplyChainRisk}
                    </div>
                </div>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--sp-2)' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>BUILD YEAR</span>
                    <div style={{ fontSize: '1.1rem', fontFamily: 'var(--font-mono)' }}>{plant.buildYear}</div>
                </div>

                {plant.capacityHistory && (
                    <div style={{ gridColumn: '1 / -1', borderTop: '1px solid var(--border)', paddingTop: 'var(--sp-2)' }}>
                        <div style={{ display: 'flex', alignContent: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>CAPACITY FACTOR (LAST 6 YRS)</span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>{plant.capacityHistory[plant.capacityHistory.length - 1]}%</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-end', height: '40px', gap: '4px', marginTop: '8px' }}>
                            {plant.capacityHistory.map((val: number, i: number) => (
                                <div key={i} style={{
                                    flex: 1,
                                    backgroundColor: val === 0 ? 'var(--red-bg)' : 'var(--border)',
                                    borderTop: val === 0 ? '2px solid var(--red)' : '2px solid var(--text-muted)',
                                    height: `${Math.max(val, 5)}%`,
                                    minHeight: '2px',
                                    transition: 'height 0.3s'
                                }}></div>
                            ))}
                        </div>
                    </div>
                )}
            </div>}

            {/* Reactor specific simplified display */}
            {isReactor && <div className="process-list" style={{ marginTop: 'var(--sp-4)' }}>
                {plant.reactors.map((r, idx: number) => {
                    let badgeClass = 'badge--red';
                    if (r.status === 'Construction') badgeClass = 'badge--orange';
                    if (r.status === 'Shutdown') badgeClass = 'badge--yellow';
                    if (r.status === 'Planned') badgeClass = 'badge--yellow';

                    return (
                        <div key={idx} className="process-item" style={{ padding: 'var(--sp-2) var(--sp-3)' }}>
                            <span className={`badge ${badgeClass}`} style={{ fontSize: '0.6rem' }}>{r.status}</span>
                            <div className="process-item-body">
                                <h4 style={{ fontSize: '0.8rem', margin: 0 }}>{r.name}</h4>
                                <p style={{ fontSize: '0.75rem' }}>{r.type} · {r.capacityMw} MWe</p>
                            </div>
                        </div>
                    );
                })}
            </div>}
        </>
    );
};

export default DossierComponent;
