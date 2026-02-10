'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { loginUser } from '../actions'


interface LoginState {
    error?: string;
}

export async function login(_prevState: LoginState, formData: FormData) {
    // Real login logic using Google Sheets
    const result = await loginUser(_prevState, formData);

    if (result.success) {
        // Set a dummy cookie to persist session locally if needed, 
        // but for now we trust the redirect. 
        // Ideally we should set a session cookie here.
        // For simplicity in this "sheet-as-db" app, we just redirect.
        // A production app would use a session library (jose/iron-session).

        // We will set a simple cookie to indicate logged in state
        const { cookies } = await import('next/headers');
        (await cookies()).set('session', 'true', { httpOnly: true });

        revalidatePath('/', 'layout')
        redirect('/')
    }

    return { error: result.error || 'Gagal log masuk.' }
}

export async function logout() {
    // nothing to sign out from
    revalidatePath('/', 'layout')
    redirect('/login')
}
