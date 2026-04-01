// Utility function to process premises data for analytics charts
// This is intentionally a separate file without "use client" so it can be used in Server Components

export type PremiseForAnalytics = {
    status_perkeso: string;
};

export function processStatusData(premises: PremiseForAnalytics[]) {
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