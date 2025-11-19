"use client"

import { LineChart, Line, CartesianGrid, XAxis, LabelList, Legend } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart"

interface GraficoLinhaProps {
  dados: any[]
  dataKey: string
  label: string
  legend?: boolean
}

export function GraficoLinha({ dados, dataKey, label, legend = true }: GraficoLinhaProps) {
  const chartConfig: ChartConfig = {
    [dataKey]: {
      label: label,
      color: `var(--chart-1)`,
    },
  }

  return (
    <ChartContainer config={chartConfig} className="w-full h-full">
      <LineChart
        accessibilityLayer
        data={dados}
        margin={{ top: 20, left: 12, right: 12 }}
      >
        <CartesianGrid vertical={false} />

        <XAxis
          dataKey="data"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(v) =>
            new Date(v).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
          }
        />

        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />

        {legend && <Legend />}

        <Line
          type="natural"
          dataKey={dataKey}
          stroke={`var(--color-${dataKey})`}
          strokeWidth={2}
          dot={{ fill: `var(--color-${dataKey})` }}
          activeDot={{ r: 6 }}
        >
          <LabelList
            position="top"
            offset={12}
            className="fill-foreground"
            fontSize={12}
          />
        </Line>
      </LineChart>
    </ChartContainer>
  )
}
