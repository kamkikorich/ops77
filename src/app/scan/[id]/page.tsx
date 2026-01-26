import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function ScanPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    // 1. Check if premise exists
    // Using .maybeSingle() instead of .single() to avoid error if not found
    const { data: premis } = await supabase
        .from('premises')
        .select('uuid')
        .eq('uuid', id)
        .maybeSingle()

    // 2. Redirect logic
    if (premis) {
        // Registered -> Go to Dashboard
        redirect(`/premis/${id}`)
    } else {
        // Not Registered -> Go to Register Page with pre-filled UUID
        redirect(`/register?uuid=${id}`)
    }
}
