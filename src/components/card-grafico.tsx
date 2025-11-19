import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"

interface CardGraficoProps {
  titulo: string
  subtitulo?: string
  rodape?: string
  children: React.ReactNode
}

export function CardGrafico({ titulo, subtitulo, rodape, children }: CardGraficoProps) {
  return (
    <Card className="rounded-2xl shadow-sm w-full">
      <CardHeader>
        <CardTitle>{titulo}</CardTitle>
        {subtitulo && <CardDescription>{subtitulo}</CardDescription>}
      </CardHeader>

      <CardContent className="pt-0 h-72">
        {children}
      </CardContent>

      {rodape && (
        <CardFooter className="text-sm text-muted-foreground">
          {rodape}
        </CardFooter>
      )}
    </Card>
  )
}
