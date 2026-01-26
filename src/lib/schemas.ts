import { z } from "zod";

export const PremiseSchema = z.object({
    uuid: z.string().uuid({ message: "ID Premis tidak sah" }),
    nama_kedai: z.string().min(3, { message: "Nama kedai terlalu pendek (min 3 huruf)" }),
    no_lot: z.string().min(1, { message: "No Lot wajib diisi" }),
    status_perkeso: z.enum(["Belum Daftar", "Sudah Daftar", "Ragu-ragu"] as const),
    gps: z.string().regex(/^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/, {
        message: "Format GPS tidak sah (contoh: 3.123,101.456)",
    }).nullable().optional(),
});

export const VisitSchema = z.object({
    premis_id: z.string().uuid({ message: "ID Premis tidak sah" }),
    inspector_id: z.string().uuid({ message: "ID Pemeriksa tidak sah" }),
    status: z.enum(["Patuh", "Kompoun", "Lawat Semula"] as const),
    catatan: z.string().optional(),
});

export type PremiseInput = z.infer<typeof PremiseSchema>;
export type VisitInput = z.infer<typeof VisitSchema>;
