"use client"

import { useEffect, useState } from "react"
import { GraficoLinhaArea } from "@/components/chart-linha-area"
import { CardGrafico } from "@/components/card-grafico"   // <-- importe aqui
import { buscarEvolucaoAntropometrica } from "@/app/actions/paciente"
import { useParams } from "next/navigation"

export default function DashboardPage() {
  const params = useParams();
  const pacienteId = params.id;
  const [dados, setDados] = useState<any[]>([])

  useEffect(() => {
    async function carregar() {
      const resposta = await buscarEvolucaoAntropometrica(pacienteId as string)
       const dadosFormatados = resposta.data.map((item: any) => ({
         ...item,
        data: new Date(item.data).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short",
        }),
        }))

        setDados(dadosFormatados)
    }

    carregar()
  }, [pacienteId])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">

      <CardGrafico
        titulo="Evolução do Peso"
        subtitulo="Peso Corporal"
      >
        <GraficoLinhaArea dados={dados} dataKey="peso" label="Peso (kg)" />
      </CardGrafico>

      <CardGrafico
        titulo="Evolução do IMC"
        subtitulo="Indice de Massa Corporal"
      >
        <GraficoLinhaArea dados={dados} dataKey="imc" label="IMC" />
      </CardGrafico>

      <CardGrafico titulo="Cintura" subtitulo="Medida da Cintura">
        <GraficoLinhaArea dados={dados} dataKey="cintura" label="Cintura (cm)" />
      </CardGrafico>

      <CardGrafico titulo="Quadril" subtitulo="Medida do Quadril">
        <GraficoLinhaArea dados={dados} dataKey="quadril" label="Quadril (cm)" />
      </CardGrafico>

      <CardGrafico titulo="RCQ" subtitulo="Relação Cintura–Quadril">
        <GraficoLinhaArea dados={dados} dataKey="rcq" label="RCQ" />
      </CardGrafico>

      <CardGrafico titulo="Dobras Cutâneas" subtitulo="Medida das Dobras Cutâneas">
        <GraficoLinhaArea dados={dados} dataKey="dobras" label="Dobras (mm)" />
      </CardGrafico>

    </div>
  )
}
