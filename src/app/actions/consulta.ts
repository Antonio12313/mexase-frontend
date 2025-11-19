'use server'
import api from "@/services/api"
import { callApi } from "@/services/apiClient"
import { cookies } from "next/headers"
import { Buffer } from 'buffer';

export async function salvarConsulta(dados: any, id_paciente: string, consultaId: string) {
  console.log("chegou aqui3")
  const cookieStore = cookies()
  const token = (await cookieStore).get('@mexase/token')?.value
  return callApi(async () => {
    const headers = { Authorization: `Bearer ${token}` }
    const response = consultaId
      ? await api.put(`/consulta/${consultaId}`, dados, { headers })
      : await api.post(`/paciente/${id_paciente}/consulta`, dados, { headers })
    return { success: true, data: response.data }
  })
}

export async function listarConsultas(id_paciente: string) {
  const cookieStore = cookies()
  const token = (await cookieStore).get('@mexase/token')?.value
  return callApi(async () => {
    const response = await api.get(`/paciente/${id_paciente}/consultas`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return { success: true, data: response.data }
  })
}

export async function buscarConsultaPorId(id_consulta: string) {
  const cookieStore = cookies()
  const token = (await cookieStore).get('@mexase/token')?.value
  return callApi(async () => {
    const response = await api.get(`/consulta/${id_consulta}?consultaCompleta=true`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return { success: true, data: response.data }
  })
}

export async function obterTokenParaPDF(): Promise<{ success: boolean, token: string | null, error?: string }> {
    const cookieStore = cookies();
    const token = (await cookieStore).get('@mexase/token')?.value;

    if (!token) {
        return { success: false, token: null, error: "Token de autenticação não encontrado." };
    }
    
    return { success: true, token: token }; 
}
