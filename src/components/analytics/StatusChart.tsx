"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

type DataItem = {
    name: string;
    value: number;
    color: string;
};

interface StatusChartProps {
    data: DataItem[];
}

export function StatusChart({ data }: StatusChartProps) {
    // If no data, show empty state
    if (!data || data.length === 0) {
        return <div className="flex h-64 items-center justify-center text-gray-500">Tiada Data</div>;
    }

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ''} ${((percent || 0) * 100).toFixed(0)}%`}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

// Helper to process raw data into chart format
export function processStatusData(premises: { status_perkeso: string }[]) {
    const counts: Record<string, number> = {};

    premises.forEach(p => {
        const status = p.status_perkeso || 'Unknown';
        counts[status] = (counts[status] || 0) + 1;
    });

    const COLORS: Record<string, string> = {
        'Sudah Daftar': '#22c55e', // Green
        'Belum Daftar': '#ef4444', // Red
        'Ragu-ragu': '#eab308',   // Yellow
        'Unknown': '#9ca3af'      // Gray
    };

    return Object.entries(counts).map(([name, value]) => ({
        name,
        value,
        color: COLORS[name] || '#6b7280'
    }));
}
