'use server'
import api from "@/services/api"
import { callApi } from "@/services/apiClient"
import { cookies } from "next/headers"

export async function salvarConsulta(dados: any) {
  const cookieStore = cookies()
  const token = (await cookieStore).get('@mexase/token')?.value

  return callApi(async () => {
    const response = await api.post("/consulta", dados, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return { success: true, data: response.data }
  })
}

