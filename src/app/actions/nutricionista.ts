'use server'
import api from "@/services/api"
import { cookies } from "next/headers"
import { jwtDecode } from "jwt-decode"
import { callApi } from "@/services/apiClient"

interface TokenPayload {
  id: number
  iat: number
  exp: number
}

export async function obterDadosNutri() {
  const cookieStore = cookies()
  const token = (await cookieStore).get('@mexase/token')?.value
  if (!token) {
    throw new Error("Token não encontrado")
  }
  const decoded = jwtDecode<TokenPayload>(token)
  const usuarioId = decoded.id
  return callApi(async () => {
    const response = await api.get(`/nutricionista/${usuarioId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return { success: true, data: response.data }
  })
}
