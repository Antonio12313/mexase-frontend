'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { SetBreadcrumbs } from "@/lib/breadcrumbs-context"
import { useParams } from "next/navigation"
import { FormularioDadosPessoais } from "./sections/FormularioDadosPessoais"
import { FormularioEstiloVida } from "./sections/FormularioEstiloVida"
import { FormularioHistoricoFamiliar } from "./sections/FormularioHistoricoFamiliar"
import { FormularioDadosDieteticos } from "./sections/FormularioDadosDieteticos"

export default function EditarPacientePage() {
  const { id } = useParams()

  return (
    <div className="w-full h-full space-y-4">
      <SetBreadcrumbs items={[
        { label: 'Home', href: '/home' },
        { label: 'Paciente', href: '/paciente' },
        { label: 'Editar' },
      ]} />

      <Card className="p-6">
        <Tabs defaultValue="dadosPessoais">
          <TabsList className="mb-6 flex flex-wrap justify-start gap-2">
            <TabsTrigger value="dadosPessoais">Dados Pessoais</TabsTrigger>
            <TabsTrigger value="estiloVida">Estilo de Vida</TabsTrigger>
            <TabsTrigger value="historicoFamiliar">Histórico Familiar</TabsTrigger>
            <TabsTrigger value="dadosDieteticos">Dados Dietéticos</TabsTrigger>
          </TabsList>

          <TabsContent value="dadosPessoais">
            <FormularioDadosPessoais pacienteId={id as string} />
          </TabsContent>

          <TabsContent value="estiloVida">
            <FormularioEstiloVida pacienteId={id as string} />
          </TabsContent>

          <TabsContent value="historicoFamiliar">
            <FormularioHistoricoFamiliar pacienteId={id as string} />
          </TabsContent>

          <TabsContent value="dadosDieteticos">
            <FormularioDadosDieteticos pacienteId={id as string} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}
