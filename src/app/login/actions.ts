'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

interface LoginState {
    error?: string;
}

export async function login(_prevState: LoginState, formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    // Note: rememberMe is handled by Supabase's persistent session cookies

    // Sign in with password
    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { error: 'Gagal log masuk. Sila semak emel dan kata laluan.' }
    }

    // If "Remember Me" is checked, set a longer session
    // Supabase sessions are persistent by default (stored in cookies)
    // The session will remain until user explicitly logs out
    // or the refresh token expires (default: 7 days, can be extended in Supabase dashboard)

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/login')
}
