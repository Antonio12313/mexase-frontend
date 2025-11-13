'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { SetBreadcrumbs } from "@/lib/breadcrumbs-context";
import { useState, useEffect } from "react"
import { listarSetores } from "@/app/actions/setores"
import { salvarPaciente } from "@/app/actions/paciente"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { validarCPF } from "@/lib/utils"

const pacienteSchema = z.object({
    nome: z.string()
        .min(2, { error: "O nome deve ter no mínimo 2 caracteres" })
        .max(150, { error: "O nome deve ter no máximo 150 caracteres" }),

    email: z.email({ error: "Email inválido" }),

    cpf: z.string()
        .length(11, { error: "O CPF deve ter 11 dígitos" })
        .regex(/^\d+$/, { error: "O CPF deve conter apenas números" })
        .refine((cpf) => validarCPF(cpf), { message: "CPF inválido" }),

    data_nascimento: z.string()
        .refine((val) => {
        const data = new Date(val)
        const hoje = new Date()
        const minDate = new Date("1900-01-01")
        return data <= hoje && data >= minDate
        }, { message: "Data de nascimento inválida" }),

    telefone: z.string()
        .min(8, { error: "O telefone deve ter no mínimo 8 dígitos" })
        .max(11, { error: "O telefone deve ter no máximo 11 dígitos" })
        .optional()
        .or(z.literal("")),

    sexo: z.enum(["M", "F", "O"], { error: "Selecione M, F ou O" }).optional(),

    naturalidade: z.string()
        .min(2, { error: "A naturalidade deve ter no mínimo 2 caracteres" })
        .max(60, { error: "A naturalidade deve ter no máximo 60 caracteres" })
        .optional()
        .or(z.literal("")),

    cd_setor: z.string()
        .min(1, { error: "O setor é obrigatório" })
})

type PacienteFormValues = z.infer<typeof pacienteSchema>

export default function Page() {
    const form = useForm<PacienteFormValues>({
        resolver: zodResolver(pacienteSchema),
        defaultValues: {
            nome: "",
            email: "",
            cpf: "",
            data_nascimento: "",
            telefone: "",
            sexo: undefined,
            naturalidade: "",
            cd_setor: "",
        },
    })

    const [setores, setSetores] = useState<any[]>([])

    const fetchData = async () => {
        try {
            const result = await listarSetores();
            setSetores(result ?? []);
        } catch (error) {
            console.error("Erro ao listar setores:", error);
            setSetores([]);
        }
    };

    useEffect(() => {
        fetchData()
    }, [])

    const router = useRouter()

    const onSubmit = async (data: PacienteFormValues) => {
        try {
            const payload = {
                ...data,
                cd_setor: Number(data.cd_setor),
            };
            const result = await salvarPaciente(payload)

            if (result.success) {
                toast.success("Paciente cadastrado com sucesso!")
                router.push("/paciente")
            } else {
                toast.error("Falha ao cadastrar paciente.")
            }
        } catch (error) {
            console.error("Erro ao cadastrar paciente:", error)
            toast.error("Erro inesperado ao cadastrar paciente.")
        }
    }

    return (
        <div className="w-full h-full">
            <SetBreadcrumbs items={[
                { label: 'Home', href: '/home' },
                { label: 'Paciente', href: '/paciente' },
                { label: 'Cadastro' },
            ]} />
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4 justify-between">
                        <div>
                            <CardTitle className="text-2xl">Cadastrar Paciente</CardTitle>
                            <CardDescription>
                                Preencha os dados do novo paciente
                            </CardDescription>
                        </div>
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/paciente">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Dados Pessoais</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="nome"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Nome Completo *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Digite o nome completo" {...field} />
                                                </FormControl>
                                                <div className="min-h-[20px]">
                                                    <FormMessage />
                                                </div>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="cpf"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>CPF *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="00000000000" maxLength={11} {...field} />
                                                </FormControl>
                                                <div className="min-h-[20px]">
                                                    <FormDescription>Apenas números, sem pontos ou
                                                        traços</FormDescription>
                                                    <FormMessage />
                                                </div>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="data_nascimento"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Data de Nascimento *</FormLabel>
                                                <FormControl>
                                                    <Input type="date" {...field} />
                                                </FormControl>
                                                <div className="min-h-[20px]">
                                                    <FormMessage />
                                                </div>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="sexo"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Sexo</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecione o sexo" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="M">Masculino</SelectItem>
                                                        <SelectItem value="F">Feminino</SelectItem>
                                                        <SelectItem value="O">Outro</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <div className="min-h-[20px]">
                                                    <FormMessage />
                                                </div>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="naturalidade"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Naturalidade</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Cidade de nascimento" {...field} />
                                                </FormControl>
                                                <div className="min-h-[20px]">
                                                    <FormMessage />
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Dados de Contato</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Email *</FormLabel>
                                                <FormControl>
                                                    <Input type="email" placeholder="exemplo@email.com" {...field} />
                                                </FormControl>
                                                <div className="min-h-[20px]">
                                                    <FormMessage />
                                                </div>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="telefone"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Telefone</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="11987654321" maxLength={11} {...field} />
                                                </FormControl>
                                                <div className="min-h-[20px]">
                                                    <FormDescription>Apenas números, incluindo DDD</FormDescription>
                                                    <FormMessage />
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Dados do Atendimento</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="cd_setor"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Setor *</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecione o setor" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {setores.map((setor) => (
                                                            <SelectItem key={setor.cd_setor} value={String(setor.cd_setor)}>{setor.nome}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <div className="min-h-[20px]">
                                                    <FormMessage />
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-4 pt-4 border-t">
                                <Button type="button" variant="outline" asChild>
                                    <Link href="/paciente">
                                        Cancelar
                                    </Link>
                                </Button>
                                <Button type="submit" className="gap-2">
                                    <Save className="h-4 w-4" />
                                    Salvar Paciente
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}