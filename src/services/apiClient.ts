// src/services/apiClient.ts
import axios, { AxiosError } from "axios"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
})

export async function callApi<T>(fn: () => Promise<T>): Promise<T> {
    try {
        return await fn()
    } catch (err: any) {
        if (axios.isAxiosError(err)) {
            const { status, data } = err.response || {}
            if (status === 403 && data?.error?.toLowerCase().includes("token expirado")) {
                const cookieStore = cookies()
                ;(await cookieStore).delete("@mexase/token")
                redirect("/login?session=expired")
            }
        }
        throw err
    }
}

export default api
