"use client"

import { SetBreadcrumbs } from "@/lib/breadcrumbs-context"
import { ChartConsultasMes } from "@/components/chart-radial-consultas-mes"
import { ChartPacientesGenero} from "@/components/chart-pacientes-por-genero"

export default function HomePage() {

  return (
    <>
      <SetBreadcrumbs
        items={[
          { label: "Home", href: "/home" },
          { label: "Início" },
        ]}
      />
      <div className="p-2">
        <div className="grid gap-6 md:grid-cols-2 w-full max-w-full">
          <ChartConsultasMes />  
          <ChartPacientesGenero />
        </div>
      </div>
    </>
  )
}
