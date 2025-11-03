'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { SetBreadcrumbs } from "@/lib/breadcrumbs-context"
import { useParams } from "next/navigation"
import { FormularioDadosPessoais } from "./sections/FormularioDadosPessoais"
import { FormularioAlterarSenha } from './sections/FormularioAlterarSenha'


export default function EditarPacientePage() {
  const { id } = useParams()

  return (
    <div className="w-full h-full space-y-4">
      <SetBreadcrumbs items={[
        { label: 'Home', href: '/home' },
        { label: 'Natrucionista', href: '/nutricionista' },
        { label: 'Editar' },
      ]} />

      <Card className="p-6">
        <Tabs defaultValue="dadosPessoais">
          <TabsList className="mb-6 flex flex-wrap justify-start gap-2">
            <TabsTrigger value="dadosPessoais">Dados Pessoais</TabsTrigger>
            <TabsTrigger value="alterarSenha">Alterar Senha</TabsTrigger>
          </TabsList>

          <TabsContent value="dadosPessoais">
            <FormularioDadosPessoais nutricionistaId={id as string} />
          </TabsContent>
          <TabsContent value="alterarSenha">
            <FormularioAlterarSenha nutricionistaId={id as string} />
          </TabsContent>
        </Tabs>
          
      </Card>
    </div>
  )
}
