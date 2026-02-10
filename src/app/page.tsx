"use client";

import { Button } from "@/components/ui/Button";
import { Scanner } from "@/components/ui/Scanner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { checkPremiseExists } from "@/app/actions";

export default function Home() {
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(false);
  const [manualId, setManualId] = useState("");

  const handleScan = async (result: string) => {
    setIsScanning(false);

    // Check if premise exists in DB
    const exists = await checkPremiseExists(result);

    if (exists) {
      // If exists, go to dashboard
      router.push(`/premis/${result}`);
    } else {
      // If not exists, go to register with uuid
      router.push(`/register?uuid=${result}`);
    }
  };

  return (

    <div className="flex min-h-screen flex-col justify-between py-6">
      <div className="flex flex-col gap-6">
        <div className="text-center space-y-4 pt-8">
          <div className="flex justify-center">
            <img src="/perkeso-logo-new.jpg" alt="PERKESO Logo" className="h-24 w-auto object-contain" />
          </div>
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary shadow-sm backdrop-blur-sm">
            ✨ Sistem Operasi Digital v2.0
          </div>
          <h1 className="font-heading text-4xl font-extrabold tracking-tight sm:text-5xl bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent pb-2">
            Ops Kesan Digital
          </h1>
          <p className="text-lg text-muted-foreground max-w-[280px] mx-auto leading-relaxed">
            Imbas kod QR pada pelekat premis untuk merekod lawatan atau mendaftar premis baru.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {isScanning ? (
            <div className="flex flex-col gap-4">
              <div className="aspect-square w-full overflow-hidden rounded-2xl bg-black">
                <Scanner onScan={handleScan} />
              </div>
              <Button variant="secondary" onClick={() => setIsScanning(false)}>
                Batal Imbas
              </Button>
            </div>
          ) : (
            <Button size="xl" onClick={() => setIsScanning(true)} className="bg-gradient-to-br from-indigo-500 to-blue-600 shadow-xl shadow-blue-500/30">
              📷 Imbas QR
            </Button>
          )}

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-100 px-2 text-slate-500 dark:bg-slate-900">Atau</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Input
              placeholder="Masukkan ID Premis (UUID)"
              value={manualId}
              onChange={(e) => setManualId(e.target.value)}
            />
            <Button
              size="lg"
              variant="outline"
              disabled={!manualId}
              onClick={() => handleScan(manualId)}
            >
              Cari Premis
            </Button>
          </div>

          <div className="mt-8 flex flex-col items-center gap-4 border-t pt-8">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Akses Petugas</p>
            <div className="flex w-full gap-3">
              <Button variant="ghost" className="flex-1 text-xs" onClick={() => router.push('/login')}>
                🔐 Log Masuk
              </Button>
              <Button variant="ghost" className="flex-1 text-xs" onClick={() => router.push('/admin/print-batch')}>
                🖨️ Cetak Sticker
              </Button>
              <Button variant="ghost" className="flex-1 text-xs" onClick={() => router.push('/admin/analytics')}>
                📊 Analisis
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-muted-foreground/60 py-4 space-y-1">
        <p className="font-medium text-muted-foreground">Pejabat PERKESO Keningau</p>
        <p>© WajuTech 2026. Hak Cipta Terpelihara.</p>
      </div>
    </div>
  );
}
