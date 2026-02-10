"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { Download } from 'lucide-react';

interface Premise {
    uuid: string;
    nama_kedai: string;
    no_lot: string;
    status_perkeso: string;
}

interface StrategyListProps {
    premises: Premise[];
}

export function StrategyList({ premises }: StrategyListProps) {
    // Strategy Logic:
    // 1. High Priority: 'Belum Daftar'
    // 2. Medium Priority: 'Ragu-ragu'

    const targets = premises.filter(p =>
        p.status_perkeso === 'Belum Daftar' ||
        p.status_perkeso === 'Ragu-ragu'
    ).sort((a, b) => {
        // Sort 'Belum Daftar' first
        if (a.status_perkeso === 'Belum Daftar' && b.status_perkeso !== 'Belum Daftar') return -1;
        if (a.status_perkeso !== 'Belum Daftar' && b.status_perkeso === 'Belum Daftar') return 1;
        return 0;
    });

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">Senarai Sasaran OPS ({targets.length})</h3>
                    <p className="text-sm text-gray-500">Premis yang perlu dilawati (Belum Daftar & Ragu-ragu)</p>
                </div>
                <Button variant="outline" size="sm" onClick={handlePrint}>
                    <Download className="mr-2 h-4 w-4" />
                    Cetak Senarai
                </Button>
            </div>

            <div className="rounded-md border bg-white shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Nama Kedai</th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">No Lot</th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 print:hidden">Tindakan</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {targets.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-4 text-center text-gray-500">Tiada sasaran dijumpai. Semua premis patuh!</td>
                            </tr>
                        ) : (
                            targets.map((p) => (
                                <tr key={p.uuid} className="hover:bg-gray-50">
                                    <td className="whitespace-nowrap px-4 py-3">
                                        <div className="font-medium text-gray-900">{p.nama_kedai}</div>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-gray-500">{p.no_lot}</td>
                                    <td className="whitespace-nowrap px-4 py-3">
                                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${p.status_perkeso === 'Belum Daftar' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {p.status_perkeso}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-medium print:hidden">
                                        <Link href={`/premis/${p.uuid}`} className="text-blue-600 hover:text-blue-900">
                                            Lihat
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="hidden print:block mt-8 text-center text-xs text-gray-400">
                Dijana oleh Sistem OPS Kesan - {new Date().toLocaleDateString()}
            </div>
        </div>
    );
}
