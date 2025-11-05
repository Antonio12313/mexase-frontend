"use client"

import { SetBreadcrumbs } from "@/lib/breadcrumbs-context"
import { ChartConsultasMes } from "@/components/chart-consultas-do-mes"
import { ChartPacientesGenero} from "@/components/chart-pacientes-por-genero"
import { ChartPacientesPorSetor } from "@/components/chart-pacientes-por-setor"
import {ChartConsultasPorMes} from "@/components/chart-consultas-por-mes"

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
          <ChartConsultasPorMes />
          <ChartPacientesGenero />
          <ChartPacientesPorSetor />
        </div>
      </div>
    </>
  )
}
