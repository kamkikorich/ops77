"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { PremiseSchema } from "@/lib/schemas";
import { z } from "zod";

function RegisterContent() {
    const searchParams = useSearchParams();
    const uuid = searchParams.get("uuid") || "";
    const router = useRouter();
    const supabase = createClient();

    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        nama_kedai: "",
        no_lot: "",
        status_perkeso: "Belum Daftar",
        gps: "",
    });

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setFormData((prev) => ({
                        ...prev,
                        gps: `${position.coords.latitude},${position.coords.longitude}`,
                    }));
                },
                (error) => console.error("Error getting GPS:", error)
            );
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // 1. Validate Data using Zod
        const result = PremiseSchema.safeParse({
            uuid: uuid,
            nama_kedai: formData.nama_kedai,
            no_lot: formData.no_lot,
            status_perkeso: formData.status_perkeso,
            gps: formData.gps || null,
        });

        if (!result.success) {
            // Check for checking validation errors
            const errorMessage = result.error.issues.map((e: z.ZodIssue) => e.message).join("\n");
            alert(`Ralat Validasi:\n${errorMessage}`);
            setIsLoading(false);
            return;
        }

        // 2. Insert to DB (Data is guaranteed clean now)
        const { error } = await supabase.from("premises").insert(result.data);

        if (error) {
            console.error("DB Error:", error);
            alert(`Gagal menyimpan: ${error.message}`);
            setIsLoading(false);
        } else {
            alert("Pendaftaran Berjaya!");
            router.push(`/premis/${uuid}`);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h2 className="text-xl font-bold">Pendaftaran Premis Baru</h2>
                <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-700 dark:bg-blue-950 dark:text-blue-200">
                    UUID: <span className="font-mono font-bold">{uuid}</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="mb-2 block text-sm font-medium">Nama Kedai / Syarikat</label>
                    <Input
                        required
                        placeholder="Contoh: Restoran Maju"
                        value={formData.nama_kedai}
                        onChange={(e) => setFormData({ ...formData, nama_kedai: e.target.value })}
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">No. Lot / Unit</label>
                    <Input
                        required
                        placeholder="Contoh: A-1-2"
                        value={formData.no_lot}
                        onChange={(e) => setFormData({ ...formData, no_lot: e.target.value })}
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">Status PERKESO</label>
                    <select
                        className="flex h-14 w-full rounded-xl border border-input bg-background px-4 py-3 text-lg ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        value={formData.status_perkeso}
                        onChange={(e) => setFormData({ ...formData, status_perkeso: e.target.value })}
                    >
                        <option value="Belum Daftar">Belum Daftar</option>
                        <option value="Sudah Daftar">Sudah Daftar</option>
                        <option value="Ragu-ragu">Ragu-ragu (Siasatan Lanjut)</option>
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">Koordinat GPS</label>
                    <Input
                        readOnly
                        value={formData.gps}
                        className="bg-slate-50 text-slate-500"
                    />
                </div>

                <Button size="xl" type="submit" disabled={isLoading} className="mt-4">
                    {isLoading ? "Menyimpan..." : "Simpan & Daftar"}
                </Button>
            </form>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <Suspense fallback={<div>Loading form...</div>}>
            <RegisterContent />
        </Suspense>
    );
}
