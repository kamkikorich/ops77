"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function checkPremise(uuid: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("premises")
        .select("uuid")
        .eq("uuid", uuid)
        .single();

    if (error || !data) {
        return false; // Not found or error (assume new)
    }

    return true; // Exists
}

export async function updatePremiseStatus(uuid: string, status: string, kod_majikan?: string) {
    const supabase = await createClient();

    const updateData: any = { status_perkeso: status };
    if (status === "Sudah Daftar" && kod_majikan) {
        updateData.kod_majikan = kod_majikan;
    } else if (status !== "Sudah Daftar") {
        updateData.kod_majikan = null; // Clear if not registered
    }

    const { error } = await supabase
        .from("premises")
        .update(updateData)
        .eq("uuid", uuid);

    if (error) {
        console.error("Error updating premise status:", error);
        return { success: false, error: error.message };
    }

    revalidatePath(`/premis/${uuid}`);
    return { success: true };
}
