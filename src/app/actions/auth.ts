'use server'

import {cookies} from 'next/headers'
import {redirect} from 'next/navigation'
import api from "@/services/api";

export async function login(email: string, senha: string) {
    try {
        const response = await api.post('/login', {
            email: email,
            senha: senha
        })

        const cookieStore = await cookies()
        cookieStore.set('@mexase/token', response.data.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
        })

        return {success: true}
    } catch (error) {
        console.error('Erro no login:', error)
        return {error: 'Erro ao fazer login'}
    }
}

export async function logout() {
    const cookieStore = await cookies()
    cookieStore.delete('@mexase/token')
    redirect('/login')
}