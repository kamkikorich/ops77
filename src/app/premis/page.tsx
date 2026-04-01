"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { BackButton } from "@/components/ui/BackButton";
import { Input } from "@/components/ui/Input";
import { LocationViewButton } from "@/components/LocationInput";
import Link from "next/link";
import type { PremiseRecord } from "@/app/actions";

export default function PremisListPage() {
    const [premises, setPremises] = useState<PremiseRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");

    useEffect(() => {
        async function fetchPremises() {
            try {
                const { getAllPremises } = await import('@/app/actions');
                const data = await getAllPremises();
                setPremises(data);
            } catch (error) {
                console.error("Error fetching premises:", error);
                alert("Gagal memuatkan data premis");
            }
            setLoading(false);
        }
        fetchPremises();
    }, []);

    // Filter premises based on search and status
    const filteredPremises = useMemo(() => {
        return premises.filter((p) => {
            // Status filter
            if (statusFilter !== "all" && p.status_perkeso !== statusFilter) {
                return false;
            }

            // Search filter (nama_kedai, no_lot, kod_majikan)
            if (searchQuery.trim() !== "") {
                const query = searchQuery.toLowerCase();
                const matchNama = p.nama_kedai.toLowerCase().includes(query);
                const matchLot = p.no_lot.toLowerCase().includes(query);
                const matchKod = p.kod_majikan?.toLowerCase().includes(query);
                return matchNama || matchLot || matchKod;
            }

            return true;
        });
    }, [premises, searchQuery, statusFilter]);

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            "Sudah Daftar": "bg-green-100 text-green-800 border-green-200",
            "Belum Daftar": "bg-red-100 text-red-800 border-red-200",
            "Ragu-ragu": "bg-yellow-100 text-yellow-800 border-yellow-200",
        };
        return styles[status] || "bg-gray-100 text-gray-800";
    };

    if (loading) {
        return (
            <div className="flex flex-col gap-6 p-4">
                <BackButton />
                <div className="text-center py-8">
                    <p>Memuatkan data premis...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 p-4 max-w-4xl mx-auto">
            <BackButton />

            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold">Senarai Premis</h1>
                <p className="text-sm text-muted-foreground">
                    Cari premis untuk lihat lokasi dan rekod lawatan
                </p>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
                <Input
                    placeholder="Cari nama kedai, no lot, kod majikan..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                />
                <select
                    className="h-12 px-4 rounded-xl border border-input bg-background"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all">Semua Status</option>
                    <option value="Sudah Daftar">Sudah Daftar</option>
                    <option value="Belum Daftar">Belum Daftar</option>
                    <option value="Ragu-ragu">Ragu-ragu</option>
                </select>
            </div>

            {/* Stats */}
            <div className="flex gap-2 text-sm">
                <span className="text-muted-foreground">
                    Jumlah: {filteredPremises.length} premis
                </span>
                {searchQuery && (
                    <span className="text-blue-600">
                        (Carian: "{searchQuery}")
                    </span>
                )}
            </div>

            {/* Premises List */}
            {filteredPremises.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    {searchQuery ? (
                        <p>Tiada premis matching carian "{searchQuery}"</p>
                    ) : (
                        <p>Tiada premis dalam sistem</p>
                    )}
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {filteredPremises.map((premis) => (
                        <Link
                            key={premis.uuid}
                            href={`/premis/${premis.uuid}`}
                            className="block"
                        >
                            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border hover:shadow-md hover:border-indigo-300 transition cursor-pointer">
                                <div className="flex flex-col gap-2">
                                    {/* Header */}
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-lg">{premis.nama_kedai}</h3>
                                            <p className="text-sm text-muted-foreground">{premis.no_lot}</p>
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(premis.status_perkeso)}`}>
                                            {premis.status_perkeso}
                                        </span>
                                    </div>

                                    {/* Kod Majikan */}
                                    {premis.kod_majikan && (
                                        <div className="text-sm font-mono text-slate-600">
                                            Kod: {premis.kod_majikan}
                                        </div>
                                    )}

                                    {/* Location */}
                                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
                                        <span className="text-xs text-muted-foreground">Lokasi:</span>
                                        <LocationViewButton gps={premis.gps} />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}