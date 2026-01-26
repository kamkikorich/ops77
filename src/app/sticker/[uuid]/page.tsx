"use client";

import { use } from "react";
import QRCode from "react-qr-code";
import { Button } from "@/components/ui/Button";

export default function StickerPage({ params }: { params: Promise<{ uuid: string }> }) {
    // Unwrap params using React.use() or await in async component
    // Since this is a client component, we can use `use` hook in React 19 (which Next.js 16 uses)
    // or just make it async if Next.js allows async client components (it doesn't generally for page props unwrapping easily without `use`)
    // Actually, in Next.js 15+, params is a Promise.
    const { uuid } = use(params);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-white p-8 text-black print:p-0">
            {/* Print Controls - Hidden when printing */}
            <div className="fixed top-4 left-4 flex gap-4 print:hidden">
                <Button variant="outline" onClick={() => window.print()}>
                    🖨️ Cetak
                </Button>
                <Button variant="ghost" onClick={() => window.history.back()}>
                    Kembali
                </Button>
            </div>

            {/* Sticker Content */}
            <div className="flex flex-col items-center gap-6 border-4 border-black p-12 text-center print:border-4">
                <div className="flex flex-col items-center gap-2">
                    <h1 className="font-heading text-3xl font-extrabold uppercase tracking-widest text-black text-center leading-tight">
                        OPS Kesan PERKESO Keningau
                    </h1>
                    <p className="text-sm font-bold uppercase tracking-widest text-slate-500">
                        Imbas Untuk Rekod Lawatan
                    </p>
                </div>

                <div className="p-4 bg-white">
                    <QRCode
                        value={uuid}
                        size={300}
                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                        viewBox={`0 0 256 256`}
                    />
                </div>

                <div className="flex flex-col items-center gap-1">
                    <p className="text-xs font-bold text-slate-400">ID PREMIS</p>
                    <p className="font-mono text-xl font-bold tracking-widest">{uuid}</p>
                </div>

                <div className="mt-4 border-t-2 border-slate-200 pt-4 w-full">
                    <p className="text-xs font-bold text-slate-900">PERTUBUHAN KESELAMATAN SOSIAL</p>
                </div>
            </div>

            <style jsx global>{`
                @media print {
                    @page {
                        margin: 0;
                        size: auto;
                    }
                    body {
                        background: white;
                    }
                }
            `}</style>
        </div>
    );
}
