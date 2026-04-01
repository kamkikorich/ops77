"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

// Re-export for backwards compatibility
export { processStatusData } from '@/lib/analytics';

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
