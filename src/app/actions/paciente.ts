'use server'
import api from "@/services/api"
import { callApi } from "@/services/apiClient"
import { cookies } from "next/headers"

export async function listarPacientes(page = 1, limit = 10, filtroTipo?: string, filtroValor?: string) {
  const cookieStore = cookies()
  const token = (await cookieStore).get('@mexase/token')?.value

  const params: any = { page, limit }
  if (filtroTipo && filtroValor) params[filtroTipo] = filtroValor
  return callApi(async () => {
    const response = await api.get('/pacientes', {
      headers: { Authorization: `Bearer ${token}` },
      params,
    })
    return response.data
  })
}

export async function handleExcluirPaciente(id: number) {
  const cookieStore = cookies()
  const token = (await cookieStore).get('@mexase/token')?.value
  return callApi(async () => {
    await api.post(
      `/paciente/${id}/inativar`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
  })
}

export async function salvarPaciente(dados: any) {
  const cookieStore = cookies()
  const token = (await cookieStore).get('@mexase/token')?.value
  return callApi(async () => {
    const response = await api.post("/paciente", dados, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return { success: true, data: response.data }
  })
}

export async function buscarPacientePorId(id: string) {
  const cookieStore = cookies()
  const token = (await cookieStore).get('@mexase/token')?.value
  return callApi(async () => {
    const response = await api.get(`/paciente/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return { success: true, data: response.data }
  })
}

export async function atualizarPaciente(id: string, dados: any) {
  try {
    const cookieStore = cookies()
    const token = (await cookieStore).get('@mexase/token')?.value

    const response = await api.put(`/paciente/${id}`, dados, {
      headers: { Authorization: `Bearer ${token}` },
    })

    return { success: true, data: response.data }
  } catch (error: any) {
    console.error("Erro ao salvar paciente:", error)
    return { success: false, error: error.response?.data?.message || "Erro ao salvar paciente" }
  }
}


export async function obterEstiloDeVida(id: string) {
  try {
    const cookieStore = cookies()
    const token = (await cookieStore).get('@mexase/token')?.value

    if (!token) {
      return { success: false, error: "Token não encontrado" }
    }

    const response = await api.get(`/paciente/${id}/estilo-vida`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    return { success: true, data: response.data }
  } catch (error: any) {
    console.error("Erro ao obter estilo de vida:", error)
    return {
      success: false,
      error: error.response?.data?.message || "Erro ao obter estilo de vida"
    }
  }
}


export async function salvarEstiloDeVida(pacienteId: string, dados: any, isEditing: boolean) {
  try {
    const cookieStore = cookies()
    const token = (await cookieStore).get('@mexase/token')?.value

    const payload = {
      tipo_exercicio: dados.tipo_exercicio || undefined,
      orientacao_dieta: dados.orientacao_dieta || undefined,
      tabagista_status: dados.tabagista_status || undefined,
      etilista: !!dados.etilista,
      frequencia_etilismo: dados.frequencia_etilismo ? Number(dados.frequencia_etilismo) : undefined,
      problema_denticao: !!dados.problema_denticao,
      medicamentos: dados.medicamentos || undefined,
      suplementos: dados.suplementos || undefined,
      restricao_sal: !!dados.restricao_sal,
      restricao_acucar: !!dados.restricao_acucar,
      outras_restricoes: dados.outras_restricoes || undefined,
      local_refeicoes: dados.local_refeicoes || undefined,
      quem_prepara_refeicoes: dados.quem_prepara_refeicoes || undefined,
    }


    const method = isEditing ? 'PUT' : 'POST'

    const response = await api({
      url: `/paciente/${pacienteId}/estilo-vida`,
      method,
      headers: { Authorization: `Bearer ${token}` },
      data: payload,
    })

    return { success: true, data: response.data }
  } catch (error: any) {
    console.error("Erro ao salvar estilo de vida:", error)
    return { success: false, error: error.response?.data?.message || "Erro ao salvar estilo de vida" }
  }
}


export async function obterHistoricoFamiliar(id: string) {
  try {
    const cookieStore = cookies()
    const token = (await cookieStore).get('@mexase/token')?.value

    if (!token) {
      return { success: false, error: "Token não encontrado" }
    }

    const response = await api.get(`/paciente/${id}/historico-familiar`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    return { success: true, data: response.data }
  } catch (error: any) {
    console.error("Erro ao obter histórico familiar:", error)
    return {
      success: false,
      error: error.response?.data?.message || "Erro ao obter histórico familiar"
    }
  }
}


export async function salvarHistoricoFamiliar(pacienteId: string, dados: any, isEditing: boolean) {
  try {
    const cookieStore = cookies()
    const token = (await cookieStore).get('@mexase/token')?.value

    const method = isEditing ? 'PUT' : 'POST'

    const response = await api({
      url: `/paciente/${pacienteId}/historico-familiar`,
      method,
      headers: { Authorization: `Bearer ${token}` },
      data: dados,
    })

    return { success: true, data: response.data }
  } catch (error: any) {
    console.error("Erro ao salvar histórico familiar:", error)
    return { success: false, error: error.response?.data?.message || "Erro ao salvar histórico familiar" }
  }
}

export async function obterDadosDieteticos(id: string) {
  try {
    const cookieStore = cookies()
    const token = (await cookieStore).get('@mexase/token')?.value

    if (!token) {
      return { success: false, error: "Token não encontrado" }
    }

    const response = await api.get(`/paciente/${id}/dados-dieteticos`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    return { success: true, data: response.data }
  } catch (error: any) {
    console.error("Erro ao obter estilo de vida:", error)
    return {
      success: false,
      error: error.response?.data?.message || "Erro ao obter estilo de vida"
    }
  }
}


export async function salvarDadosDieteticos(pacienteId: string, dados: any, isEditing: boolean) {
  try {
    const cookieStore = cookies()
    const token = (await cookieStore).get('@mexase/token')?.value

    const method = isEditing ? 'PUT' : 'POST'

    const response = await api({
      url: `/paciente/${pacienteId}/dados-dieteticos`,
      method,
      headers: { Authorization: `Bearer ${token}` },
      data: dados,
    })

    return { success: true, data: response.data }
  } catch (error: any) {
    console.error("Erro ao salvar estilo de vida:", error)
    return { success: false, error: error.response?.data?.message || "Erro ao salvar estilo de vida" }
  }
}

export async function buscarTotalDePacientesPorSexo() {
  const cookieStore = cookies()
  const token = (await cookieStore).get('@mexase/token')?.value
  return callApi(async () => {
    const response = await api.get(`/pacientes/por-genero`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return { success: true, data: response.data }
  })
}

export async function buscarTotalDePacientesPorSetor() {
  const cookieStore = cookies()
  const token = (await cookieStore).get('@mexase/token')?.value

  return callApi(async () => {
    const response = await api.get(`/pacientes/por-setor`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return { success: true, data: response.data }
  })
}

export async function buscarEvolucaoAntropometrica(idPaciente: string) {
  const cookieStore = cookies();
  const token = (await cookieStore).get("@mexase/token")?.value;

  return callApi(async () => {
    const response = await api.get(`/paciente/${idPaciente}/evolucao-antropometrica`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return { success: true, data: response.data };
  });
}
