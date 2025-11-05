import { TrendingUp } from "lucide-react"
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

const chartData = [
  { month: "Jan", consultas: 45 },
  { month: "Fev", consultas: 60 },
  { month: "Mar", consultas: 40 },
  { month: "Abr", consultas: 75 },
  { month: "Mai", consultas: 80 },
  { month: "Jun", consultas: 70 },
  { month: "Jul", consultas: 5 },
  { month: "Ago", consultas: 90 },
  { month: "Set", consultas: 78 },
  { month: "Out", consultas: 88 },
  { month: "Nov", consultas: 95 },
  { month: "Dez", consultas: 29 },
]

const chartConfig = {
  consultas: {
    label: "Consultas",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function ChartConsultasPorMes() {
  return (
    <Card className="w-full h-100">
      <CardHeader>
        <CardTitle>Consultas por Mês</CardTitle>
        <CardDescription>Número total de consultas ao longo do ano</CardDescription>
      </CardHeader>
      <CardContent className="w-full max-w-full overflow-hidden">
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
                type="natural"
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
              Janeiro - Dezembro {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
