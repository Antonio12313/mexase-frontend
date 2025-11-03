"use client"

import { useEffect, useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { obterDadosDieteticos, salvarDadosDieteticos } from "@/app/actions/paciente"

const schema = z.object({
    aversao_alimentos: z.string().max(150, "Máximo de 150 caracteres").optional(),
    preferencia_alimentos: z.string().max(150, "Máximo de 150 caracteres").optional(),
    alergia_alimentos: z.string().max(150, "Máximo de 150 caracteres").optional(),
})

type DadosDieteticos = z.infer<typeof schema>

interface Props {
    pacienteId: string
}

export function FormularioDadosDieteticos({ pacienteId }: Props) {
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(true)

    const form = useForm<DadosDieteticos>({
        resolver: zodResolver(schema),
        defaultValues: {
            aversao_alimentos: "",
            preferencia_alimentos: "",
            alergia_alimentos: "",
        },
    })

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const res = await obterDadosDieteticos(pacienteId)
                if (!res.success || !res.data) {
                    setIsEditing(false)
                } else {
                    setIsEditing(true)
                    form.reset(res.data)
                }
            } catch (error) {
                console.error(error)
                toast.error("Erro ao carregar dados dieteticos")
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [pacienteId, form])

    const onSubmit = async (values: z.infer<typeof schema>) => {
        try {
            const res = await salvarDadosDieteticos(pacienteId, values, isEditing)
            if (res.success) {
                toast.success(isEditing ? "Dados dieteticos atualizado com sucesso!" : "Dados dieteticos cadastrado com sucesso!")
                setIsEditing(true)
            } else {
                toast.error(res.error)
            }
        } catch (error) {
            console.error(error)
            toast.error("Erro inesperado ao salvar dados dieteticos")
        }
    }

    if (loading) return <p>Carregando...</p>

    return (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="aversao_alimentos"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Aversão a Alimentos</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ex: Frutas cítricas, peixes..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="preferencia_alimentos"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Preferência por Alimentos</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ex: Massas, carnes brancas..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="alergia_alimentos"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Alergias Alimentares</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ex: Amendoim, lactose..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end">
                            <Button type="submit">{isEditing ? "Atualizar" : "Salvar"}</Button>
                        </div>
                    </form>
                </Form>
    )
}
