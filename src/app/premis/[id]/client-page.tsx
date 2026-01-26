"use client";

import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { Premis } from "@/lib/types";

export default function PremisDashboardClient({ premis }: { premis: Premis }) {
    const router = useRouter();

    return (
        <div className="flex flex-col gap-6">
            <div className="rounded-2xl bg-slate-900 p-6 text-white shadow-xl">
                <h2 className="text-2xl font-bold">{premis.nama_kedai}</h2>
                <p className="opacity-80">{premis.no_lot}</p>
                <div className="mt-4 inline-flex items-center rounded-full bg-green-500/20 px-3 py-1 text-sm font-medium text-green-300 ring-1 ring-inset ring-green-500/50">
                    {premis.status_perkeso}
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
        </div>
    );
}
