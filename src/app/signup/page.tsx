'use client'

import { useActionState } from 'react'
import { registerUser, ActionState } from '../actions'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { BackButton } from '@/components/ui/BackButton'
import Link from 'next/link'

const initialState: ActionState = {
    error: '',
    success: ''
}

export default function SignupPage() {
    const [state, formAction, isPending] = useActionState(registerUser, initialState)

    return (
        <div className="flex min-h-[80vh] flex-col items-center justify-center p-4">
            <div className="w-full max-w-sm">
                <BackButton href="/login" label="Kembali ke Log Masuk" />
            </div>
            <div className="w-full max-w-sm space-y-6">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold">Daftar Akaun</h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Daftar akaun baru untuk petugas
                    </p>
                </div>

                {state?.success ? (
                    <div className="rounded-md bg-green-50 p-4 text-green-700">
                        <p>{state.success}</p>
                        <Link href="/login" className="mt-4 block text-center font-medium text-blue-600 hover:underline">
                            Kembali ke Log Masuk
                        </Link>
                    </div>
                ) : (
                    <form action={formAction} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="email">Emel</label>
                            <Input id="email" name="email" type="email" required placeholder="nama@perkeso.gov.my" />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password">Kata Laluan</label>
                            <Input id="password" name="password" type="password" required minLength={6} />
                        </div>

                        {state?.error && (
                            <div className="text-sm font-medium text-red-500">
                                {state.error}
                            </div>
                        )}

                        <Button type="submit" size="lg" className="w-full" disabled={isPending}>
                            {isPending ? 'Sedang Mendaftar...' : 'Daftar'}
                        </Button>

                        <p className="text-center text-sm text-gray-500">
                            Sudah ada akaun?{' '}
                            <Link href="/login" className="font-medium text-blue-600 hover:underline">
                                Log Masuk
                            </Link>
                        </p>
                    </form>
                )}
            </div>
        </div>
    )
}
