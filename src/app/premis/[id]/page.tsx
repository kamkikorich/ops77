import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import PremisDashboardClient from "./client-page";
import { Visit } from "@/lib/types";

export default async function PremisDashboard({ params }: { params: { id: string } }) {
    const uuid = (await params).id // Await params in newer Next.js versions if needed, but for now direct access might work or await. In Next 15+ params is a promise.
    // wait, params is a promise in Next.js 15. The installed version is 16.1.4 (Canary? or standard). 
    // Wait, package.json said "next": "16.1.4". Next.js 15 is current. 
    // Wait, "next": "16.1.4"? That sounds like a very new version (or I misread 15.1.4).
    // Assuming standard Next.js 15 behavior: params is a Promise.

    const supabase = await createClient();

    const { data: premis, error } = await supabase
        .from("premises")
        .select("*, visits(*)") // Select premise and join visits
        .eq("uuid", uuid)
        .single();

    if (error || !premis) {
        if (error?.code === 'PGRST116') { // 0 rows
            // If not found, maybe redirect to register?
            // Or show 404
            return notFound();
        }
        console.error(error);
        return <div>Error loading premise.</div>;
    }

    // Sort visits by date desc manually since we didn't order in join (Supabase join ordering syntax is tricky sometimes, simpler to sort in JS for small sets or use .order on foreign table)
    if (premis.visits) {
        premis.visits.sort((a: Visit, b: Visit) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return <PremisDashboardClient premis={premis} />;
}
