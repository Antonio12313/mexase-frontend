"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
} from "recharts"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ChartContainer, ChartConfig, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { buscarTotalDePacientesPorSexo } from "@/app/actions/paciente"
import { useEffect, useState } from "react"

interface PacienteGenero {
  genero: string
  total: number
}

const chartConfig = {
  total: {
    label: "Pacientes",
  },
} satisfies ChartConfig

export function ChartPacientesGenero() {
  const [dados, setDados] = useState<PacienteGenero[]>([])
  const cores = ["var(--chart-feminino)", "var(--chart-masculino)", "var(--chart-outro)"]

useEffect(() => {
    async function carregar() {
      const resposta = await buscarTotalDePacientesPorSexo()
      setDados(resposta.data)
    }

    carregar()
  }, [])

  return (
    <Card className="w-full max-w-full overflow-hidden h-100">
        <CardHeader>
            <CardTitle>Pacientes por Gênero</CardTitle>
        </CardHeader>
        <CardContent className="h-80 w-full max-w-full overflow-hidden">
            <ChartContainer config={chartConfig} className="w-full h-full max-w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                data={dados}
                margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
                >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis
                    dataKey="genero"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "var(--color-foreground)" }}
                />
                <YAxis
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "var(--color-foreground)" }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="total" radius={4} stroke="var(--color-border)" strokeWidth={1}>
                    {dados.map((entry, index) => (
                    <Cell key={index} fill={cores[index]} />
                    ))}
                </Bar>
                </BarChart>
            </ResponsiveContainer>
            </ChartContainer>
        </CardContent>
    </Card>
  )
}
