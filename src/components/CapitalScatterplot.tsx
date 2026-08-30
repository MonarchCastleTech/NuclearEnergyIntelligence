import React from 'react';
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ZAxis
} from 'recharts';
import reactorsData from '../data/reactors.json';

interface CapitalPoint {
    name: string;
    cost: number;
    delay: number;
    country: string;
}

interface CapitalTooltipProps {
    active?: boolean;
    payload?: Array<{ payload: CapitalPoint }>;
}

const CapitalTooltip = ({ active, payload }: CapitalTooltipProps) => {
    if (active && payload?.length) {
        const dataPoint = payload[0].payload;
        return (
            <div style={{ backgroundColor: '#000', border: '1px solid var(--border)', padding: '10px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#fff' }}>
                <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>{dataPoint.name}</p>
                <p style={{ margin: 0, color: 'var(--text-muted)' }}>Location: {dataPoint.country}</p>
                <p style={{ margin: 0, color: 'var(--red)' }}>Cost: ${dataPoint.cost} Billion</p>
                <p style={{ margin: 0, color: 'var(--orange)' }}>Delay: {dataPoint.delay} Years</p>
            </div>
        );
    }
    return null;
};

const CapitalScatterplot: React.FC = () => {
    // Filter for projects with valid capital cost data and delay years relative to western vs eastern models
    const data = reactorsData
        .filter(r => r.capitalCostBillion > 0 && r.delayYears !== undefined)
        .map(r => ({
            name: r.name,
            cost: r.capitalCostBillion,
            delay: r.delayYears,
            country: r.country,
            status: r.status,
            fill: r.country === 'United States' || r.country === 'France' || r.country === 'United Kingdom' || r.country === 'Finland' ? 'var(--red)' : 'var(--orange)' // Simplified categorization for visual distinction
        }));

    return (
        <div className="intelligence-panel">
            <div className="panel-header" style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '0.5rem', marginTop: 0 }}>Capital Delivery Matrix</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, maxWidth: '600px' }}>
                    Selected greenfield projects plotted by reported capital cost and schedule delay. The sample is descriptive and not representative of every regional delivery model.
                </p>
            </div>

            <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                    <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                        <XAxis
                            type="number"
                            dataKey="delay"
                            name="Delay (Years)"
                            stroke="var(--text-muted)"
                            tick={{ fill: 'var(--text-muted)', fontSize: 12, fontFamily: 'var(--font-mono)' }}
                            tickLine={false}
                            axisLine={{ stroke: 'var(--border)' }}
                            label={{ value: 'Construction Delay (Years)', position: 'insideBottom', offset: -10, fill: 'var(--text-secondary)', fontSize: 12 }}
                        />
                        <YAxis
                            type="number"
                            dataKey="cost"
                            name="Capital Cost ($B)"
                            stroke="var(--text-muted)"
                            tick={{ fill: 'var(--text-muted)', fontSize: 12, fontFamily: 'var(--font-mono)' }}
                            tickLine={false}
                            axisLine={{ stroke: 'var(--border)' }}
                            label={{ value: 'Capital Cost ($ Billion)', angle: -90, position: 'insideLeft', offset: -5, fill: 'var(--text-secondary)', fontSize: 12 }}
                        />
                        <ZAxis type="number" range={[100, 100]} />
                        <Tooltip content={<CapitalTooltip />} cursor={{ strokeDasharray: '3 3', stroke: 'var(--border-hover)' }} />
                        <Scatter name="Projects" data={data} fill="var(--accent)" shape="circle" fillOpacity={0.8} />
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default CapitalScatterplot;
