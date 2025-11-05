"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { Pie, PieChart, Cell, ResponsiveContainer } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import { buscarTotalDePacientesPorSetor } from "@/app/actions/paciente"

export const description = "Distribuição de pacientes por setor"

interface PacientesPorSetor {
  setor: string
  total: number
}

type ChartDatum = {
  setor: string
  total: number
  fill: string
}

export function ChartPacientesPorSetor() {
  const [chartData, setChartData] = useState<ChartDatum[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true)
        setError(null)

        const resposta = await buscarTotalDePacientesPorSetor()
        const data: PacientesPorSetor[] = Array.isArray(resposta?.data)
          ? resposta.data
          : []

        if (data.length === 0) {
          setChartData([])
          return
        }

        const cores = [
          "var(--chart-1)",
          "var(--chart-2)",
          "var(--chart-3)",
          "var(--chart-4)",
          "var(--chart-5)",
          "var(--chart-6)",
        ]

        const dadosFormatados: ChartDatum[] = data.map((item, index) => ({
          setor: item.setor,
          total: Number(item.total) || 0,
          fill: cores[index % cores.length],
        }))

        setChartData(dadosFormatados)
      } catch (err) {
        console.error("Erro ao carregar dados do gráfico:", err)
        setError("Falha ao carregar dados.")
      } finally {
        setLoading(false)
      }
    }

    carregarDados()
  }, [])

  const chartConfig = chartData.reduce((acc, item) => {
    acc[item.setor] = { label: item.setor, color: item.fill }
    return acc
  }, {} as Record<string, { label: string; color: string }>) as ChartConfig

  return (
    <Card className="w-full max-w-full overflow-hidden h-100">
      <CardHeader className="">
        <CardTitle>Pacientes por Setor</CardTitle>
        <CardDescription>Distribuição atual</CardDescription>
      </CardHeader>

      <CardContent className="h-80 w-full max-w-full overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center text-sm text-destructive py-8">{error}</div>
        ) : chartData.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground py-8">
            Nenhum dado disponível para exibir.
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="w-full h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={chartData}
                  dataKey="total"
                  nameKey="setor"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  label={({ setor, total }) => `${setor}: ${total}`}
                >
                  {chartData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>

      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          {chartData.length > 0
            ? `Total de setores ${chartData.length}`
            : "Sem setores"}
        </div>
        <div className="text-muted-foreground leading-none">
          Mostrando total de pacientes agrupados por setor
        </div>
      </CardFooter>
    </Card>
  )
}
