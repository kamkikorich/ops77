// import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import PremisDashboardClient from "./client-page";
// import { Visit } from "@/lib/types";

export default async function PremisDashboard({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    const { getPremiseWithVisits } = await import('@/app/actions');
    const premis = await getPremiseWithVisits(id);

    if (!premis) {
        return notFound();
    }

    return <PremisDashboardClient premis={premis} />;
}
