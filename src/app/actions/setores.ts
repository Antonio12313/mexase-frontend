'use server'
import api from "@/services/api"
import { cookies } from "next/headers"


export async function listarSetores() {
  try {
    const cookieStore = cookies()
    const token = (await cookieStore).get('@mexase/token')?.value


    const response = await api.get(
      `/setores`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    return response.data
  } catch (error) {
    console.error('Erro ao listar setores:', error)
    return { data: [], meta: { totalItems: 0, totalPages: 0, page: 1, limit: 10 } }
  }

}