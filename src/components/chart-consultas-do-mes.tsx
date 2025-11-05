"use client"

import { TrendingUp } from "lucide-react"
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"

const totalConsultas = 40

const chartData = [
  {
    name: "Consultas",
    consultas: totalConsultas,
    fill: "var(--chart-2)",
  },
]

const chartConfig = {
  consultas: {
    label: "Consultas",
  },
} satisfies ChartConfig

export function ChartConsultasMes() {
  return (
    <Card className="flex flex-col h-96 overflow-hidden">
      <CardHeader className="items-center pb-0">
        <CardTitle>Total de Consultas</CardTitle>
        <CardDescription>
          {new Date().toLocaleString("pt-BR", { month: "long", year: "numeric" })}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center p-0">
        <ChartContainer
          config={chartConfig}
          className="w-full max-w-[240px] h-full max-h-[240px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={0}
            endAngle={250}
            innerRadius={80}
            outerRadius={110}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="consultas" background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          className="fill-foreground text-4xl font-bold"
                        >
                          {totalConsultas}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          consultas
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Crescimento de 5% este mês <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Total de consultas realizadas no mês atual
        </div>
      </CardFooter>
    </Card>
  )
}
