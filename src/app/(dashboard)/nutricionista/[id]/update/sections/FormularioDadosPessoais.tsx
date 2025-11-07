'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm, UseFormReturn } from "react-hook-form"
import { useEffect, useState } from "react"
import { buscarNutricionistaPorId, atualizarNutricionista } from "@/app/actions/nutricionista"
import { toast } from "sonner"
import Link from "next/link"
import { Save, ArrowLeft } from "lucide-react"

const schema = z.object({
  nome: z.string().min(3, "O nome é obrigatório"),
  matricula: z.string().regex(/^\d+$/, { error: "A matricula deve conter apenas números" }),
  email: z.string().email("E-mail inválido"),
  telefone: z.string().min(10, "Telefone inválido").optional().or(z.literal("")),
  isAdmin: z.boolean(),
})

type FormValues = z.infer<typeof schema>

export function FormularioDadosPessoais({ nutricionistaId }: { nutricionistaId: string }) {
  const [loading, setLoading] = useState(true)

  const form = useForm<FormValues>({
      resolver: zodResolver(schema),
      defaultValues: {
          nome: "",
          email: "",
          matricula: "",
          telefone: "",
      },
  })

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const nutricionistaRes = await buscarNutricionistaPorId(nutricionistaId)
        if (nutricionistaRes.success && nutricionistaRes.data) {
          const n = nutricionistaRes.data
          form.reset({
            nome: n.nome,
            email: n.email,
            matricula: n.matricula?.toString() || "",
            telefone: n.telefone || "",
            isAdmin: n.isAdmin || false,
          })
        }
      } catch (err) {
        toast.error("Erro ao carregar nutricionista")
      } finally {
        setLoading(false)
      }
    }
    carregarDados()
  }, [nutricionistaId, form])

  const onSubmit = async (data: FormValues) => {
    try {
      const result = await atualizarNutricionista(nutricionistaId, {
        nome: data.nome,
        email: data.email,
        matricula: Number(data.matricula),
        telefone: data.telefone,
        isAdmin: data.isAdmin,
      })
      if (result.success) toast.success("Dados pessoais atualizados com sucesso!")
      else toast.error(result.error || "Erro ao atualizar dados pessoais")
    } catch {
      toast.error("Erro inesperado ao salvar")
    }
  }

  if (loading) return <p>Carregando dados...</p>

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field, fieldState }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Nome *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Digite o nome completo" />
                  </FormControl>
                  <div className="min-h-[1.25rem]">
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="matricula"
              render={({ field, fieldState }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Matrícula *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="0000000000" maxLength={10} value={field.value as string} />
                  </FormControl>
                  <div className="min-h-[1.25rem]">
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} placeholder="exemplo@email.com" />
                  </FormControl>
                  <div className="min-h-[1.25rem]">
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="telefone"
              render={({ field, fieldState }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="11987654321" maxLength={11} />
                  </FormControl>
                  <div className="min-h-[1.25rem]">
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                  </div>
                </FormItem>
              )}
            />

           <FormField
              control={form.control}
              name="isAdmin"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-1">
                  <FormControl>
                    <Input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="w-auto h-4"
                    />
                  </FormControl>
                  <FormLabel className="mb-0">Administrador</FormLabel>
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button variant="outline" asChild>
              <Link href="/nutricionista">
                <ArrowLeft className="h-4 w-4 mr-2" /> Cancelar
              </Link>
            </Button>
            <Button type="submit" className="gap-2">
              <Save className="h-4 w-4" /> Salvar Dados
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
