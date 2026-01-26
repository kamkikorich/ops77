"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { QRCodeWithLogo } from "@/components/ui/QRCodeWithLogo";
import { v4 as uuidv4 } from "uuid";

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
        <div className="flex flex-col gap-6 p-8 bg-white min-h-screen text-black print:p-0">
            {/* Controls - Hidden when printing */}
            <div className="flex gap-4 print:hidden">
                <Button onClick={generateBatch}>Jana 6 Sticker</Button>
                <Button variant="outline" onClick={() => window.print()}>
                    🖨️ Cetak A4
                </Button>
            </div>

            {/* Sticker Grid - 2 columns x 3 rows for A4 */}
            <div className="grid grid-cols-2 gap-0 print:gap-0">
                {stickers.map((uuid, index) => (
                    <div
                        key={uuid}
                        className="flex flex-col items-center justify-center p-6 border border-dashed border-gray-300 print:border-gray-400"
                        style={{
                            // Each sticker approximately 95mm x 90mm for A4
                            minHeight: "90mm",
                            pageBreakInside: "avoid",
                        }}
                    >
                        {/* Sticker Content */}
                        <div className="flex flex-col items-center gap-3 p-4 border-2 border-black bg-white">
                            {/* Header */}
                            <h2 className="text-lg font-extrabold text-center uppercase tracking-wide">
                                OPS Kesan PERKESO Keningau
                            </h2>

                            {/* QR Code with Logo */}
                            <QRCodeWithLogo value={uuid} size={140} />

                            {/* Short ID */}
                            <div className="text-center">
                                <p className="text-[10px] font-bold text-gray-500 uppercase">
                                    ID Premis
                                </p>
                                <p className="font-mono text-lg font-bold tracking-widest">
                                    {shortenUUID(uuid)}
                                </p>
                            </div>

                            {/* Footer */}
                            <p className="text-[10px] font-bold text-gray-600 uppercase border-t border-gray-200 pt-2 w-full text-center">
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
                    body {
                        background: white;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                }
            `}</style>
        </div>
    );
}
