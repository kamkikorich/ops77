"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import { Premis } from "@/lib/types";
import { useState } from "react";
import { updatePremiseStatus } from "@/lib/actions";

export default function PremisDashboardClient({ premis }: { premis: Premis }) {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [status, setStatus] = useState(premis.status_perkeso);
    const [kodMajikan, setKodMajikan] = useState(premis.kod_majikan || "");
    const [isLoading, setIsLoading] = useState(false);

    const handleUpdate = async () => {
        setIsLoading(true);
        const res = await updatePremiseStatus(premis.uuid, status, kodMajikan);
        if (res.success) {
            setIsModalOpen(false);
            router.refresh();
        } else {
            alert("Gagal mengemaskini: " + res.error);
        }
        setIsLoading(false);
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="rounded-2xl bg-slate-900 p-6 text-white shadow-xl">
                <h2 className="text-2xl font-bold">{premis.nama_kedai}</h2>
                <p className="opacity-80">{premis.no_lot}</p>
                <div className="mt-4 flex items-center gap-3">
                    <div className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ring-1 ring-inset ${premis.status_perkeso === "Sudah Daftar"
                        ? "bg-green-500/20 text-green-300 ring-green-500/50"
                        : "bg-yellow-500/20 text-yellow-300 ring-yellow-500/50"
                        }`}>
                        {premis.status_perkeso}
                    </div>
                    {premis.kod_majikan && (
                        <div className="text-sm font-mono text-slate-400">
                            {premis.kod_majikan}
                        </div>
                    )}
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="text-xs font-medium text-indigo-400 hover:text-indigo-300 underline"
                    >
                        Ubah Status
                    </button>
                </div>
            </div>

            <div className="flex gap-2">
                <Button size="xl" onClick={() => router.push(`/visit?id=${premis.uuid}`)} className="flex-1 shadow-lg shadow-indigo-500/30">
                    📝 Rekod Lawatan
                </Button>
                <Button size="xl" variant="secondary" onClick={() => window.open(`/sticker/${premis.uuid}`, '_blank')} className="shadow-sm">
                    🖨️ Sticker
                </Button>
            </div>

            <div className="flex flex-col gap-4">
                <h3 className="font-bold text-slate-500 uppercase text-xs tracking-wider">Sejarah Lawatan</h3>
                {premis.visits && premis.visits.length > 0 ? (
                    premis.visits.map((visit, index) => (
                        <div key={index} className="flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm dark:bg-slate-800">
                            <div>
                                <div className="font-bold">{visit.status}</div>
                                <div className="text-sm text-slate-500">{visit.catatan || '-'}</div>
                            </div>
                            <div className="text-sm font-mono text-slate-400">
                                {new Date(visit.created_at).toLocaleDateString('ms-MY')}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-slate-400 py-8">Tiada rekod lawatan.</div>
                )}
            </div>

            {
                isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-in fade-in duration-200">
                        <div className="w-full max-w-md space-y-4 rounded-2xl bg-slate-900 p-6 shadow-2xl ring-1 ring-white/10">
                            <div className="space-y-2">
                                <h3 className="text-lg font-bold text-white">Kemaskini Status</h3>
                                <p className="text-sm text-slate-400">Ubah status pendaftaran Perkeso premis ini.</p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-300">Status PERKESO</label>
                                    <select
                                        className="flex h-12 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                    >
                                        <option value="Belum Daftar">Belum Daftar</option>
                                        <option value="Sudah Daftar">Sudah Daftar</option>
                                        <option value="Ragu-ragu">Ragu-ragu</option>
                                    </select>
                                </div>

                                {status === "Sudah Daftar" && (
                                    <div className="animate-in fade-in slide-in-from-top-2">
                                        <label className="mb-2 block text-sm font-medium text-slate-300">Kod Majikan</label>
                                        <Input
                                            placeholder="Contoh: 9400000431Y"
                                            value={kodMajikan}
                                            onChange={(e) => setKodMajikan(e.target.value)}
                                            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button variant="ghost" className="flex-1" onClick={() => setIsModalOpen(false)}>
                                    Batal
                                </Button>
                                <Button className="flex-1" onClick={handleUpdate} disabled={isLoading}>
                                    {isLoading ? "Menyimpan..." : "Simpan"}
                                </Button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
}
