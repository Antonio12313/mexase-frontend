"use client"

import { LineChart, Line, CartesianGrid, XAxis, LabelList, Area } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart"
import { Inbox } from "lucide-react"

interface GraficoLinhaAreaProps {
  dados: any[]
  dataKey: string
  label: string
  legend?: boolean
}

export function GraficoLinhaArea({
  dados,
  dataKey,
  label,
  legend = true,
}: GraficoLinhaAreaProps) {
  const chartConfig: ChartConfig = {
    [dataKey]: {
      label: label,
      color: `var(--chart-1)`,
    },
  }

  const semDados = !dados || dados.length === 0

  if (semDados) {
    return (
      <div className="flex flex-col items-center justify-center h-[260px] text-center text-muted-foreground">
        <Inbox className="w-10 h-10 mb-2" />
        <p>Nenhum dado disponível</p>
      </div>
    )
  }

  return (
    <ChartContainer config={chartConfig} className="w-full h-64">
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
        />

        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />

        <Area
          type="natural"
          dataKey={dataKey}
          fill={`var(--color-${dataKey})`}
          fillOpacity={0.25}
          stroke="none"
          isAnimationActive={true}
        />

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
