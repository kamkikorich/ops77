"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { QRCodeWithLogo } from "@/components/ui/QRCodeWithLogo";
import { v4 as uuidv4 } from "uuid";
import { BackButton } from "@/components/ui/BackButton";

export default function BatchPrintPage() {
    const [stickers, setStickers] = useState<string[]>([]);

    const generateBatch = () => {
        // Generate 6 UUIDs for A4 layout (2x3)
        const newStickers = Array.from({ length: 6 }).map(() => uuidv4());
        setStickers(newStickers);
    };

    // Shorten UUID for display (first 8 characters)
    const shortenUUID = (uuid: string) => uuid.slice(0, 8).toUpperCase();

    return (
        <div className="flex flex-col bg-white min-h-screen text-black print:p-0 print:m-0">
            {/* Controls - Hidden when printing */}
            <div className="flex flex-col p-4 print:hidden gap-4">
                <BackButton href="/" label="Halaman Utama" />
                <div className="flex gap-4">
                    <Button onClick={generateBatch}>Jana 6 Sticker</Button>
                    <Button variant="outline" onClick={() => window.print()}>
                        🖨️ Cetak A4
                    </Button>
                </div>

                {/* Sticker Grid - 2 columns x 3 rows for A4 */}
                {/* A4 = 210mm x 297mm, with 5mm margins = 200mm x 287mm usable */}
                {/* Each cell: 100mm x 95mm (approx) */}
                <div
                    className="grid grid-cols-2 grid-rows-3 print:w-[200mm] print:h-[287mm] print:mx-auto"
                    style={{ gap: 0 }}
                >
                    {stickers.map((uuid) => (
                        <div
                            key={uuid}
                            className="flex items-center justify-center border border-dashed border-gray-300 print:border-gray-400"
                            style={{
                                height: "95.67mm", // 287mm / 3 rows
                                pageBreakInside: "avoid",
                            }}
                        >
                            {/* Sticker Content - Compact */}
                            <div className="flex flex-col items-center gap-1 p-2 border-2 border-black bg-white">
                                {/* Header */}
                                <h2 className="text-sm font-extrabold text-center uppercase tracking-wide leading-tight">
                                    OPS Kesan PERKESO Keningau
                                </h2>

                                {/* QR Code with Logo - smaller for 6 per page */}
                                <QRCodeWithLogo
                                    value={`${typeof window !== 'undefined' ? window.location.origin : ''}/scan/${uuid}`}
                                    size={100}
                                />

                                {/* Short ID */}
                                <div className="text-center">
                                    <p className="text-[8px] font-bold text-gray-500 uppercase">
                                        ID Premis
                                    </p>
                                    <p className="font-mono text-sm font-bold tracking-widest">
                                        {shortenUUID(uuid)}
                                    </p>
                                </div>

                                {/* Footer */}
                                <p className="text-[8px] font-bold text-gray-600 uppercase border-t border-gray-200 pt-1 w-full text-center">
                                    PERTUBUHAN KESELAMATAN SOSIAL
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Print Styles */}
                <style jsx global>{`
                @media print {
                    @page {
                        margin: 5mm;
                        size: A4 portrait;
                    }
                    html, body {
                        width: 210mm;
                        height: 297mm;
                        margin: 0;
                        padding: 0;
                        background: white;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                }
            `}</style>
            </div>
        </div>
    );
}
