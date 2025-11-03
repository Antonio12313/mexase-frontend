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

export async function listarNutricionistas(page = 1, limit = 10, filtroTipo?: string, filtroValor?: string) {
  const cookieStore = cookies()
  const token = (await cookieStore).get('@mexase/token')?.value

  const params: any = { page, limit }
  if (filtroTipo && filtroValor) params[filtroTipo] = filtroValor
  return callApi(async () => {
    const response = await api.get('/nutricionistas', {
      headers: { Authorization: `Bearer ${token}` },
      params,
    })
    return response.data
  })
}

export async function salvarNutricionista(dados: any) {
  const cookieStore = cookies();
  const token = (await cookieStore).get("@mexase/token")?.value;

  return callApi(async () => {
    try {
      const response = await api.post("/nutricionista", dados, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message;
      const customError = new Error(errorMessage);
      (customError as any).status = error.response?.status;
      throw customError;
    }
  }) as Promise<ApiResult<any>>;;
}

type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function handleExcluirNutricionista(id: number) {
  const cookieStore = cookies()
  const token = (await cookieStore).get('@mexase/token')?.value
  return callApi(async () => {
    await api.patch(
      `/nutricionista/${id}/inativar`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
  })
}

export async function buscarNutricionistaPorId(id: string) {
  const cookieStore = cookies()
  const token = (await cookieStore).get('@mexase/token')?.value
  return callApi(async () => {
    const response = await api.get(`/nutricionista/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return { success: true, data: response.data }
  })
}

export async function atualizarNutricionista(id: string, dados: any) {
  try {
    console.log("Atualizando dados do nutricionista:", id, dados)
    const cookieStore = cookies()
    const token = (await cookieStore).get('@mexase/token')?.value

    const response = await api.put(`/nutricionista/${id}`, dados, {
      headers: { Authorization: `Bearer ${token}` },
    })

    return { success: true, data: response.data }
  } catch (error: any) {
    console.error("Erro ao atualizar dados do nutricionista:", error)
    return { success: false, error: error.response?.data?.message || "Erro ao atualizar dados do nutricionista" }
  }
}

export async function alterarSenhaNutricionista(id: string, dados: any) {
  try {
    console.log("Alterar senha do nutricionista:", id, dados)
    const cookieStore = cookies()
    const token = (await cookieStore).get('@mexase/token')?.value

    const response = await api.patch(`/nutricionista/${id}/alterar-senha`, dados, {
      headers: { Authorization: `Bearer ${token}` },
    })

    return { success: true, data: response.data }
  } catch (error: any) {
    console.error("Erro ao alterar senha do nutricionista:", error)
    return { success: false, error: error.response?.data?.message || "Erro ao alterar senha do nutricionista" }
  }
}

export async function alterarTemaDoNutricionista() {
  const cookieStore = cookies()
  const token = (await cookieStore).get('@mexase/token')?.value
  if (!token) {
    throw new Error("Token não encontrado")
  }
  const decoded = jwtDecode<TokenPayload>(token)
  const usuarioId = decoded.id
  return callApi(async () => {
    await api.patch(
      `/nutricionista/${usuarioId}/alterar-tema`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
  })
}