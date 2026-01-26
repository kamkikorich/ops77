"use server";

import { createClient } from "@/utils/supabase/server";

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
