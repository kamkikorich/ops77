"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { BackButton } from "@/components/ui/BackButton";
import { Input } from "@/components/ui/Input";
// import { createClient } from "@/utils/supabase/client";
import type { ReportRow } from "@/app/actions";

interface Stats {
    total: number;
    patuh: number;
    kompoun: number;
    lawatSemula: number;
}

export default function ReportPage() {
    // const supabase = createClient();
    const [visits, setVisits] = useState<ReportRow[]>([]);
    const [stats, setStats] = useState<Stats>({ total: 0, patuh: 0, kompoun: 0, lawatSemula: 0 });
    const [loading, setLoading] = useState(false);
    const [filterType, setFilterType] = useState<"range" | "year">("range");

    // Date range filter
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // Year filter
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

    const fetchReport = async () => {
        setLoading(true);

        try {
            const { getReport } = await import('@/app/actions');

            // Convert strings to number for year if needed, but getReport takes string/undefined dates and number year
            const data = await getReport(
                filterType,
                startDate || undefined,
                endDate || undefined,
                selectedYear
            );

            if (data) {
                setVisits(data);

                // Calculate stats
                const statsData = {
                    total: data.length,
                    patuh: data.filter((v) => v.status === "Patuh").length,
                    kompoun: data.filter((v) => v.status === "Kompoun").length,
                    lawatSemula: data.filter((v) => v.status === "Lawat Semula").length,
                };
                setStats(statsData);
            }
        } catch (error: unknown) {
            console.error("Error fetching report:", error);
            const message = error instanceof Error ? error.message : "Ralat tidak diketahui";
            alert("Gagal mendapatkan laporan: " + message);
        }

        setLoading(false);
    };

    // Auto-fetch on year change
    useEffect(() => {
        if (filterType === "year") {
            const fetch = async () => {
                await fetchReport();
            };
            fetch();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedYear, filterType]);

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("ms-MY", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusBadge = (status: string) => {
        const colors: Record<string, string> = {
            Patuh: "bg-green-100 text-green-800",
            Kompoun: "bg-red-100 text-red-800",
            "Lawat Semula": "bg-yellow-100 text-yellow-800",
        };
        return colors[status] || "bg-gray-100 text-gray-800";
    };

    return (
        <div className="flex flex-col gap-6 p-6 max-w-6xl mx-auto">
            <div className="flex items-center gap-4">
                <BackButton href="/" label="Utama" className="mb-0" />
                <h1 className="text-2xl font-bold">Laporan Lawatan</h1>
            </div>

            {/* Filter Section */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border">
                <div className="flex gap-4 mb-4">
                    <button
                        onClick={() => setFilterType("range")}
                        className={`px-4 py-2 rounded-lg font-medium transition ${filterType === "range"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 dark:bg-slate-700"
                            }`}
                    >
                        Julat Tarikh
                    </button>
                    <button
                        onClick={() => setFilterType("year")}
                        className={`px-4 py-2 rounded-lg font-medium transition ${filterType === "year"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 dark:bg-slate-700"
                            }`}
                    >
                        Tahun
                    </button>
                </div>

                {filterType === "range" ? (
                    <div className="flex flex-wrap gap-4 items-end">
                        <div>
                            <label className="block text-sm font-medium mb-1">Dari</label>
                            <Input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Hingga</label>
                            <Input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                        <Button onClick={fetchReport} disabled={loading || !startDate || !endDate}>
                            {loading ? "Memuatkan..." : "Jana Laporan"}
                        </Button>
                    </div>
                ) : (
                    <div className="flex gap-4 items-end">
                        <div>
                            <label className="block text-sm font-medium mb-1">Tahun</label>
                            <select
                                className="h-12 px-4 rounded-xl border border-input bg-background"
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(Number(e.target.value))}
                            >
                                {years.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* Stats Cards */}
            {stats.total > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4 text-center">
                        <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
                        <p className="text-sm text-blue-800 dark:text-blue-200">Jumlah Lawatan</p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-4 text-center">
                        <p className="text-3xl font-bold text-green-600">{stats.patuh}</p>
                        <p className="text-sm text-green-800 dark:text-green-200">Patuh</p>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/30 rounded-xl p-4 text-center">
                        <p className="text-3xl font-bold text-red-600">{stats.kompoun}</p>
                        <p className="text-sm text-red-800 dark:text-red-200">Kompoun</p>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded-xl p-4 text-center">
                        <p className="text-3xl font-bold text-yellow-600">{stats.lawatSemula}</p>
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">Lawat Semula</p>
                    </div>
                </div>
            )}

            {/* Table */}
            {visits.length > 0 && (
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 dark:bg-slate-700">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium">Tarikh</th>
                                    <th className="px-4 py-3 text-left font-medium">Nama Kedai</th>
                                    <th className="px-4 py-3 text-left font-medium">No. Lot</th>
                                    <th className="px-4 py-3 text-left font-medium">Status</th>
                                    <th className="px-4 py-3 text-left font-medium">Catatan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                                {visits.map((visit) => (
                                    <tr key={visit.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            {formatDate(visit.created_at)}
                                        </td>
                                        <td className="px-4 py-3 font-medium">
                                            {visit.premises?.nama_kedai || "-"}
                                        </td>
                                        <td className="px-4 py-3">
                                            {visit.premises?.no_lot || "-"}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(visit.status)}`}>
                                                {visit.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400 max-w-xs truncate">
                                            {visit.catatan || "-"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!loading && visits.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    <p>Tiada data lawatan untuk dipaparkan.</p>
                    <p className="text-sm">Sila pilih tarikh dan klik &quot;Jana Laporan&quot;.</p>
                </div>
            )}

            {/* Print Button */}
            {visits.length > 0 && (
                <div className="flex justify-end print:hidden">
                    <Button variant="outline" onClick={() => window.print()}>
                        🖨️ Cetak Laporan
                    </Button>
                </div>
            )}

            <style jsx global>{`
                @media print {
                    @page { margin: 1cm; }
                    body { background: white; }
                }
            `}</style>
        </div>
    );
}
