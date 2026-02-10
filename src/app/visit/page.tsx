"use client";

import { Button } from "@/components/ui/Button";
import { BackButton } from "@/components/ui/BackButton";
import { Input } from "@/components/ui/Input";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
// import { createClient } from "@/utils/supabase/client";
import { VisitSchema } from "@/lib/schemas";

function VisitContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id"); // Premise UUID
    const router = useRouter();
    // const supabase = createClient();

    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        status: "Patuh",
        catatan: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // 1. Zod Validation
        const result = VisitSchema.safeParse({
            premis_id: id,
            inspector_id: 'admin', // Placeholder until auth is sorted
            status: formData.status,
            catatan: formData.catatan,
        });

        if (!result.success) {
            alert(`Ralat Validasi:\n${result.error.issues.map((issue) => issue.message).join("\n")}`);
            setIsLoading(false);
            return;
        }

        try {
            const { addVisit } = await import('../actions');
            await addVisit(result.data);
            alert("Lawatan direkodkan!");
            router.push(`/premis/${id}`);
        } catch (error: unknown) {
            console.error(error);
            const message = error instanceof Error ? error.message : "Ralat tidak diketahui";
            alert(`Gagal simpan: ${message}`);
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div>
                <BackButton />
                <h2 className="text-xl font-bold">Rekod Lawatan</h2>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-3">
                    {["Patuh", "Kompoun", "Lawat Semula"].map((status) => (
                        <button
                            key={status}
                            type="button"
                            onClick={() => setFormData({ ...formData, status })}
                            className={`h-20 rounded-xl border-2 font-bold text-lg transition-all ${formData.status === status
                                ? "border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200"
                                : "border-transparent bg-white shadow-sm hover:border-slate-200 dark:bg-slate-800"
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">Catatan / No. Notis</label>
                    <Input
                        placeholder="Contoh: Kompoun RM500 sebab tiada caruman"
                        value={formData.catatan}
                        onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
                        className="h-24"
                    />
                </div>

                <Button size="xl" type="submit" disabled={isLoading} variant={formData.status === 'Patuh' ? 'default' : 'destructive'}>
                    {isLoading ? "Menyimpan..." : "Hantar Laporan"}
                </Button>
            </form>
        </div>
    );
}

export default function VisitPage() {
    return (
        <Suspense fallback={<div>Loading visit form...</div>}>
            <VisitContent />
        </Suspense>
    );
}
