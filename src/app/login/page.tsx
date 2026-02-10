'use client'

import { useActionState } from 'react'
import { login } from './actions'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const initialState = {
    error: '',
}

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(login, initialState)

    return (
        <div className="flex min-h-[80vh] flex-col items-center justify-center p-4">
            <div className="w-full max-w-sm space-y-6">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold">Log Masuk</h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Akses sistem untuk pemeriksa PERKESO
                    </p>
                </div>
                <form action={formAction} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="email">Emel</label>
                        <Input id="email" name="email" type="email" required placeholder="pemeriksa@perkeso.gov.my" />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="password">Kata Laluan</label>
                        <Input id="password" name="password" type="password" required />
                    </div>

                    {/* Remember Me Checkbox */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="rememberMe"
                            name="rememberMe"
                            defaultChecked
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="rememberMe" className="text-sm text-gray-600 dark:text-gray-400">
                            Ingat saya (kekal log masuk)
                        </label>
                    </div>

                    {state?.error && (
                        <div className="text-sm font-medium text-red-500">
                            {state.error}
                        </div>
                    )}
                    <Button type="submit" size="lg" className="w-full" disabled={isPending}>
                        {isPending ? 'Sedang Log Masuk...' : 'Masuk'}
                    </Button>

                    <p className="text-center text-sm text-gray-500">
                        Belum ada akaun?{' '}
                        <Link href="/signup" className="font-medium text-blue-600 hover:underline">
                            Daftar Akaun
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
}
