"use client"

import { useEffect, useState } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, ResponsiveContainer } from "recharts"
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

import { buscarTotalConsultasDosUltimos12Meses } from "@/app/actions/nutricionista"

const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]

const chartConfig = {
  consultas: {
    label: "Consultas",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function ChartConsultasPorMes() {
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    async function carregar() {
      const resposta = await buscarTotalConsultasDosUltimos12Meses()
      const dados = resposta.data

      if (!Array.isArray(dados)) return

      const convertidos = dados.map((item) => ({
        month: meses[item.mes - 1], 
        consultas: item.total,
        ano: item.ano,
        mesNumero: item.mes,
      }))

      convertidos.sort((a, b) => {
        if (a.ano !== b.ano) return a.ano - b.ano
        return a.mesNumero - b.mesNumero
      })

      setChartData(convertidos)
    }

    carregar()
  }, [])

  return (
    <Card className="h-100">
      <CardHeader>
        <CardTitle>Consultas por Mês</CardTitle>
        <CardDescription>Últimos 12 meses</CardDescription>
      </CardHeader>

      <CardContent className="overflow-hidden">
        <ChartContainer config={chartConfig} className="h-full w-full max-w-full overflow-hidden">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Area
                dataKey="consultas"
                type="monotone"
                fill="var(--color-consultas)"
                fillOpacity={0.4}
                stroke="var(--color-consultas)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>

      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              Últimos 12 meses até {meses[new Date().getMonth()]} {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
