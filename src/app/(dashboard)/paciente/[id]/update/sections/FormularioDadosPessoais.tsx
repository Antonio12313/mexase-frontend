'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import { listarSetores } from "@/app/actions/setores"
import { buscarPacientePorId, atualizarPaciente } from "@/app/actions/paciente"
import { toast } from "sonner"
import Link from "next/link"
import { Save, ArrowLeft } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const schema = z.object({
  nome: z.string().min(3, "O nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  cpf: z.string().min(11, "CPF inválido"),
  telefone: z.string().min(10, "Telefone inválido"),
  sexo: z.string(),
  data_nascimento: z.string(),
  cd_setor: z.string(),
  naturalidade: z.string().min(3, "Naturalidade é obrigatória"),
})

export function FormularioDadosPessoais({ pacienteId }: { pacienteId: string }) {
  const [loading, setLoading] = useState(true)
  const [setores, setSetores] = useState<any[]>([])

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: "",
      email: "",
      cpf: "",
      telefone: "",
      sexo: "",
      data_nascimento: "",
      cd_setor: "",
      naturalidade: "",
    },
  })

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [pacienteRes, setoresRes] = await Promise.all([
          buscarPacientePorId(pacienteId),
          listarSetores(),
        ])
        setSetores(setoresRes)

        if (pacienteRes.success && pacienteRes.data) {
          const p = pacienteRes.data
          form.reset({
            nome: p.nome,
            email: p.email,
            cpf: p.cpf,
            telefone: p.telefone,
            sexo: p.sexo,
            data_nascimento: p.data_nascimento?.substring(0, 10),
            cd_setor: p.cd_setor?.toString() || "",
            naturalidade: p.naturalidade || "",
          })
        }
      } catch (err) {
        toast.error("Erro ao carregar paciente")
      } finally {
        setLoading(false)
      }
    }
    carregarDados()
  }, [pacienteId, form])

  const onSubmit = async (data: any) => {
    try {
      const result = await atualizarPaciente(pacienteId, {
        ...data,
        cd_setor: parseInt(data.cd_setor, 10),
      })

      if (result.success) {
        toast.success("Dados pessoais atualizados com sucesso!")
      } else {
        toast.error(result.error || "Erro ao atualizar dados pessoais")
      }
    } catch {
      toast.error("Erro inesperado ao salvar")
    }
  }

  if (loading) return <p>Carregando dados...</p>

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="nome" render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="cpf" render={({ field }) => (
              <FormItem>
                <FormLabel>CPF</FormLabel>
                <FormControl><Input {...field} maxLength={11} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="data_nascimento" render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Nascimento</FormLabel>
                <FormControl><Input type="date" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="sexo" render={({ field }) => (
              <FormItem>
                <FormLabel>Sexo</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="M">Masculino</SelectItem>
                    <SelectItem value="F">Feminino</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl><Input type="email" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="telefone" render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl><Input {...field} maxLength={11} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="naturalidade" render={({ field }) => (
              <FormItem>
                <FormLabel>Naturalidade</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="cd_setor" render={({ field }) => (
              <FormItem>
                <FormLabel>Setor</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {setores.map((s) => (
                      <SelectItem key={s.cd_setor} value={String(s.cd_setor)}>
                        {s.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button variant="outline" asChild>
              <Link href="/paciente">
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
