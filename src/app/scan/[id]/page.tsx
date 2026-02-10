// import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function ScanPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    // 1. Check if premise exists
    const { checkPremiseExists } = await import('@/app/actions');
    const exists = await checkPremiseExists(id);

    // 2. Redirect logic
    if (exists) {
        // Registered -> Go to Dashboard
        redirect(`/premis/${id}`)
    } else {
        // Not Registered -> Go to Register Page with pre-filled UUID
        redirect(`/register?uuid=${id}`)
    }
}
