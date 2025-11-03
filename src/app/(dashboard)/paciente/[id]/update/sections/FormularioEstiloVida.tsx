'use client'

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Save } from "lucide-react"
import { obterEstiloDeVida, salvarEstiloDeVida } from "@/app/actions/paciente"

const schema = z.object({
    tipo_exercicio: z.string().optional(),
    frequencia_exercicio_semana: z.string().optional(),
    duracao_exercicio_minutos: z.string().optional(),
    orientacao_dieta: z.string().optional(),
    tabagista_status: z.string().optional(),
    etilista: z.boolean().default(false),
    duracao_etilismo_anos: z.string().optional(),
    frequencia_etilismo: z.string().optional(),
    problema_denticao: z.boolean().default(false),
    tempo_sono_horas: z.string().optional(),
    medicamentos: z.string().optional(),
    suplementos: z.string().optional(),
    restricao_sal: z.boolean().default(false),
    restricao_acucar: z.boolean().default(false),
    outras_restricoes: z.string().optional(),
    local_refeicoes: z.string().optional(),
    quem_prepara_refeicoes: z.string().optional(),
})

export function FormularioEstiloVida({ pacienteId }: { pacienteId: string }) {
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            tipo_exercicio: "",
            frequencia_exercicio_semana: "",
            duracao_exercicio_minutos: "",
            orientacao_dieta: "",
            tabagista_status: "",
            etilista: false,
            duracao_etilismo_anos: "",
            frequencia_etilismo: "",
            problema_denticao: false,
            tempo_sono_horas: "",
            medicamentos: "",
            suplementos: "",
            restricao_sal: false,
            restricao_acucar: false,
            outras_restricoes: "",
            local_refeicoes: "",
            quem_prepara_refeicoes: "",
        },
    })

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const res = await obterEstiloDeVida(pacienteId)
                if (!res.success || !res.data) {
                    setIsEditing(false)
                } else {
                    setIsEditing(true)
                    form.reset({
                        ...res.data,
                        frequencia_exercicio_semana: res.data.frequencia_exercicio_semana?.toString() || "",
                        duracao_exercicio_minutos: res.data.duracao_exercicio_minutos?.toString() || "",
                        duracao_etilismo_anos: res.data.duracao_etilismo_anos?.toString() || "",
                        tempo_sono_horas: res.data.tempo_sono_horas?.toString() || "",
                    })
                }
            } catch (error) {
                console.error(error)
                toast.error("Erro ao carregar dados do estilo de vida")
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [pacienteId, form])

    const onSubmit = async (values: z.infer<typeof schema>) => {
        try {
            const payload = {
                ...values,
                frequencia_exercicio_semana: values.frequencia_exercicio_semana ? Number(values.frequencia_exercicio_semana) : undefined,
                duracao_exercicio_minutos: values.duracao_exercicio_minutos ? Number(values.duracao_exercicio_minutos) : undefined,
                duracao_etilismo_anos: values.duracao_etilismo_anos ? Number(values.duracao_etilismo_anos) : undefined,
                tempo_sono_horas: values.tempo_sono_horas ? Number(values.tempo_sono_horas) : undefined,
            }
            const res = await salvarEstiloDeVida(pacienteId, payload, isEditing)

            if (res.success) {
                toast.success(isEditing ? "Estilo de vida atualizado com sucesso!" : "Estilo de vida cadastrado com sucesso!")
                setIsEditing(true)
            } else {
                toast.error(res.error)
            }
        } catch (error) {
            console.error(error)
            toast.error("Erro inesperado ao salvar dados")
        }
    }

    if (loading) {
        return <p className="text-center py-10">Carregando dados do estilo de vida...</p>
    }

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="tipo_exercicio" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tipo de Exercício</FormLabel>
                                <FormControl><Input placeholder="Ex: Caminhada leve" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="frequencia_exercicio_semana" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Frequência (vezes por semana)</FormLabel>
                                <FormControl><Input
                                    {...field}
                                    type="text"
                                    onChange={(e) => {
                                        const value = e.target.value
                                        if (/^\d*$/.test(value)) {
                                            field.onChange(value)
                                        }
                                    }}
                                /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="duracao_exercicio_minutos" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Duração (minutos)</FormLabel>
                                <FormControl><Input
                                    {...field}
                                    type="text"
                                    onChange={(e) => {
                                        const value = e.target.value
                                        if (/^\d*$/.test(value)) {
                                            field.onChange(value)
                                        }
                                    }}
                                /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="tempo_sono_horas" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tempo de Sono (horas)</FormLabel>
                                <FormControl><Input
                                    {...field}
                                    type="text"
                                    onChange={(e) => {
                                        const value = e.target.value
                                        if (/^\d*$/.test(value)) {
                                            field.onChange(value)
                                        }
                                    }}
                                /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />


                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="orientacao_dieta" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Orientação Dieta</FormLabel>
                                <FormControl><Input placeholder="Ex: Dieta balanceada" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="suplementos" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Suplementos</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />





                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{
                        marginBottom: "2px",
                    }}>
                        <FormField control={form.control} name="quem_prepara_refeicoes" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Quem Prepara as Refeições</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="local_refeicoes" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Local das Refeições</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />






                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                        <FormField control={form.control} name="restricao_sal" render={({ field }) => (
                            <FormItem className="flex items-center gap-2 mt-6">
                                <FormControl>
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <FormLabel>Restrição de sal</FormLabel>
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="restricao_acucar" render={({ field }) => (
                            <FormItem className="flex items-center gap-2 mt-6">
                                <FormControl>
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <FormLabel>Restrição de açúcar</FormLabel>
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="problema_denticao" render={({ field }) => (
                            <FormItem className="flex items-center gap-2 mt-6">
                                <FormControl>
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <FormLabel>Problema de dentição</FormLabel>
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="etilista" render={({ field }) => (
                            <FormItem className="flex items-center gap-2 mt-6">
                                <FormControl>
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <FormLabel>Étilista</FormLabel>
                            </FormItem>
                        )} />


                    </div>





                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <FormField control={form.control} name="duracao_etilismo_anos" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Duração do Etílismo (anos)</FormLabel>
                                <FormControl><Input
                                    {...field}
                                    type="text"
                                    onChange={(e) => {
                                        const value = e.target.value
                                        if (/^\d*$/.test(value)) {
                                            field.onChange(value)
                                        }
                                    }}
                                /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="frequencia_etilismo" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Frequência do Consumo de Álcool</FormLabel>
                                <FormControl><Input placeholder="Ex: Social, fins de semana" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="outras_restricoes" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Outras Restrições</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />


                        <FormField control={form.control} name="medicamentos" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Medicamentos</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="tabagista_status" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tabagista</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione o status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="NAO_TABAGISTA">Não tabagista</SelectItem>
                                        <SelectItem value="TABAGISTA">Tabagista</SelectItem>
                                        <SelectItem value="EX_TABAGISTA">Ex-tabagista</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />


                    </div>

                    <div className="flex justify-end pt-4 border-t">
                        <Button type="submit" className="gap-2">
                            <Save className="h-4 w-4" /> Salvar Estilo de Vida
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
