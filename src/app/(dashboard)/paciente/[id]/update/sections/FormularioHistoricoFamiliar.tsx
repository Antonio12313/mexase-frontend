'use client'

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { Save } from "lucide-react"
import { obterHistoricoFamiliar, salvarHistoricoFamiliar } from "@/app/actions/paciente"

const schema = z.object({
    historico_hipertensao: z.boolean().default(false),
    historico_diabetes: z.boolean().default(false),
    historico_dislipidemia: z.boolean().default(false),
    historico_cancer: z.boolean().default(false),
    historico_cardiacas: z.boolean().default(false),
    historico_tireoide: z.boolean().default(false),
    historico_excesso_peso: z.boolean().default(false),
    historico_outras_condicoes: z.string().optional(),
    antecedentes_familiares: z.string().optional(),
})

export function FormularioHistoricoFamiliar({ pacienteId }: { pacienteId: string }) {
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            historico_hipertensao: false,
            historico_diabetes: false,
            historico_dislipidemia: false,
            historico_cancer: false,
            historico_cardiacas: false,
            historico_tireoide: false,
            historico_excesso_peso: false,
            historico_outras_condicoes: "",
            antecedentes_familiares: "",
        },
    })

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const res = await obterHistoricoFamiliar(pacienteId)
                if (!res.success || !res.data) {
                    setIsEditing(false)
                } else {
                    setIsEditing(true)
                    form.reset(res.data)
                }
            } catch (error) {
                console.error(error)
                toast.error("Erro ao carregar histórico familiar")
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [pacienteId, form])

    const onSubmit = async (values: z.infer<typeof schema>) => {
        try {
            const res = await salvarHistoricoFamiliar(pacienteId, values, isEditing)
            if (res.success) {
                toast.success(isEditing ? "Histórico familiar atualizado com sucesso!" : "Histórico familiar cadastrado com sucesso!")
                setIsEditing(true)
            } else {
                toast.error(res.error)
            }
        } catch (error) {
            console.error(error)
            toast.error("Erro inesperado ao salvar histórico familiar")
        }
    }

    if (loading) {
        return <p className="text-center py-10">Carregando dados do histórico familiar...</p>
    }

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                        <FormField
                            control={form.control} name="historico_hipertensao" render={({ field }) => (
                                <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormLabel>Hipertensão</FormLabel>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control} name="historico_diabetes" render={({ field }) => (
                                <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormLabel>Diabetes</FormLabel>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control} name="historico_dislipidemia" render={({ field }) => (
                                <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormLabel>Dislipidemia</FormLabel>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control} name="historico_cancer" render={({ field }) => (
                                <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormLabel>Câncer</FormLabel>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control} name="historico_cardiacas" render={({ field }) => (
                                <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormLabel>Cardíaca</FormLabel>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control} name="historico_tireoide" render={({ field }) => (
                                <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormLabel>Tireoide</FormLabel>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control} name="historico_excesso_peso" render={({ field }) => (
                                <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormLabel>Obesidade</FormLabel>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="historico_outras_condicoes" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Outras Condições</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: Asma, alergias..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="antecedentes_familiares" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Antecedentes Familiares</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: Histórico de infarto, AVC..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>

                    <div className="flex justify-end pt-4 border-t">
                        <Button type="submit" className="gap-2">
                            <Save className="h-4 w-4" /> Salvar Histórico Familiar
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
