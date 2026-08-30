import React, { useMemo } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import reactorsData from '../data/reactors.json';

interface RetirementTooltipProps {
    active?: boolean;
    payload?: Array<{ value: number }>;
    label?: string;
}

const RetirementTooltip = ({ active, payload, label }: RetirementTooltipProps) => {
    if (active && payload?.length) {
        return (
            <div style={{ backgroundColor: '#000', border: '1px solid var(--border)', padding: '10px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#fff' }}>
                <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>Age: {label}</p>
                <p style={{ margin: 0, color: 'var(--accent)' }}>Operational Reactors: {payload[0].value}</p>
            </div>
        );
    }
    return null;
};

const RetirementCliffChart: React.FC = () => {
    const data = useMemo(() => {
        const currentYear = new Date().getFullYear();
        const ageGroups = [
            { name: '0-10 Years', count: 0, range: [0, 10] },
            { name: '11-20 Years', count: 0, range: [11, 20] },
            { name: '21-30 Years', count: 0, range: [21, 30] },
            { name: '31-40 Years', count: 0, range: [31, 40] },
            { name: '41-50 Years', count: 0, range: [41, 50] },
            { name: '51+ Years', count: 0, range: [51, 100] }
        ];

        reactorsData.forEach(r => {
            if (r.status !== 'Operational') return;
            const age = currentYear - r.buildYear;
            for (const group of ageGroups) {
                if (age >= group.range[0] && age <= group.range[1]) {
                    group.count += 1;
                    break;
                }
            }
        });

        return ageGroups;
    }, []);

    return (
        <div className="intelligence-panel">
            <div className="panel-header" style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '0.5rem', marginTop: 0 }}>The Retirement Cliff</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, maxWidth: '600px' }}>
                    Age profile of the operational reactors in this reference set. Older cohorts increase the importance of life-extension, replacement and demand scenarios; retirement timing remains uncertain.
                </p>
            </div>

            <div style={{ width: '100%', height: 350 }}>
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} initialDimension={{ width: 800, height: 350 }}>
                    <BarChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                        <XAxis
                            dataKey="name"
                            stroke="var(--text-muted)"
                            tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'var(--font-mono)' }}
                            tickLine={false}
                            axisLine={{ stroke: 'var(--border)' }}
                        />
                        <YAxis
                            stroke="var(--text-muted)"
                            tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'var(--font-mono)' }}
                            tickLine={false}
                            axisLine={{ stroke: 'var(--border)' }}
                        />
                        <Tooltip content={<RetirementTooltip />} cursor={{ fill: 'var(--bg-elevated)' }} />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                            {data.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={index >= 3 ? 'var(--orange)' : 'var(--accent)'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default RetirementCliffChart;
