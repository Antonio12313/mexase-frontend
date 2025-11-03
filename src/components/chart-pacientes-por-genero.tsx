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
//import {} from ""

const dadosPacientes = [
  { genero: "Feminino", total: 50 },
  { genero: "Masculino", total: 35 },
]

const chartConfig = {
  total: {
    label: "Pacientes",
  },
} satisfies ChartConfig

export function ChartPacientesGenero() {
  const cores = ["var(--chart-feminino)", "var(--chart-masculino)"]

  return (
    <Card className="w-full max-w-full overflow-hidden">
        <CardHeader>
            <CardTitle>Pacientes por Gênero</CardTitle>
        </CardHeader>
        <CardContent className="h-80 w-full max-w-full overflow-hidden">
            <ChartContainer config={chartConfig} className="w-full h-full max-w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                data={dadosPacientes}
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
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "var(--color-foreground)" }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="total" radius={4} stroke="var(--color-border)" strokeWidth={1}>
                    {dadosPacientes.map((entry, index) => (
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
