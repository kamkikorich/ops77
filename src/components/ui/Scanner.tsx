"use client";

import { Scanner as QrScanner } from "@yudiel/react-qr-scanner";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ScannerProps {
    onScan: (result: string) => void;
    className?: string;
}

export function Scanner({ onScan, className }: ScannerProps) {
    const [error, setError] = useState<string | null>(null);

    return (
        <div className={cn("relative overflow-hidden rounded-xl border border-slate-200 bg-slate-900 shadow-inner", className)}>
            <QrScanner
                onScan={(result) => {
                    if (result && result.length > 0) {
                        onScan(result[0].rawValue);
                    }
                }}
                onError={(err) => {
                    console.error(err);
                    setError("Camera error. Please ensure permissions are granted.");
                }}
                // components prop removed
                styles={{
                    container: {
                        width: '100%',
                        height: '100%',
                        borderRadius: '0.75rem',
                    }
                }}
            />
            {error && (
                <div className="absolute top-0 left-0 w-full bg-red-500/80 p-2 text-center text-xs text-white backdrop-blur">
                    {error}
                </div>
            )}
        </div>
    );
}
