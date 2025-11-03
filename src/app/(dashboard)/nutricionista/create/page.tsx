'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import { ArrowLeft, Save, Eye, EyeOff} from "lucide-react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { SetBreadcrumbs } from "@/lib/breadcrumbs-context";
import { useState, useEffect } from "react"
import { salvarNutricionista } from "@/app/actions/nutricionista"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const nutricionistaSchema = z.object({
    nome: z.string()
        .min(2, { error: "O nome deve ter no mínimo 2 caracteres" })
        .max(150, { error: "O nome deve ter no máximo 150 caracteres" }),

    email: z.email({ error: "Email inválido" }),

    matricula: z.string().regex(/^\d+$/, { error: "A matricula deve conter apenas números" }),

    telefone: z.string()
        .min(8, { error: "O telefone deve ter no mínimo 8 dígitos" })
        .max(11, { error: "O telefone deve ter no máximo 11 dígitos" })
        .optional()
        .or(z.literal("")),

    senha: z.string()
        .min(6, { error: "A senha deve ter no mínimo 6 caracteres" })
        .max(100, { error: "A senha deve ter no máximo 100 caracteres" }),

    confirmaSenha: z.string()
        .min(6, { error: "A confirmação de senha deve ter no mínimo 6 caracteres" })
        .max(100, { error: "A confirmação de senha deve ter no máximo 100 caracteres" }),
})
.refine(
  (data) =>
    !data.senha || !data.confirmaSenha || data.senha === data.confirmaSenha,
  {
    message: "As senhas não coincidem",
    path: ["confirmaSenha"],
  }
)

type NutricionistaFormValues = z.infer<typeof nutricionistaSchema>

export default function Page() {
    const form = useForm<NutricionistaFormValues>({
        resolver: zodResolver(nutricionistaSchema),
        defaultValues: {
            nome: "",
            email: "",
            matricula: "",
            telefone: "",
            senha: "",
            confirmaSenha: "",
        },
    })

    const router = useRouter()

    const [showSenha, setShowSenha] = useState(false);
    const [showConfirmaSenha, setShowConfirmaSenha] = useState(false);

    const onSubmit = async (data: NutricionistaFormValues) => {
    try {
        const payload = {
        matricula: Number(data.matricula),
        nome: data.nome,
        email: data.email,
        telefone: data.telefone || null,
        senha: data.senha,
        };

        const result = await salvarNutricionista(payload);
        console.error("Result do salvarNutricionista:", result);
        if (result.success) {
            toast.success("Nutricionista cadastrado com sucesso!");
            router.push("/nutricionista");
        } else {
            console.log("Erro ao cadastrar nutricionista:", result.error);
            toast.error(result.error || "Falha ao cadastrar nutricionista.");
        }
    } catch (error: any) {
        console.error("Erro ao cadastrar nutricionista:", error);
        toast.error(error.message || "Ocorreu um erro ao cadastrar o nutricionista.");
    }
    };

    return (
        <div className="w-full h-full">
            <SetBreadcrumbs items={[
                { label: 'Home', href: '/home' },
                { label: 'Nutricionista', href: '/nutricionista' },
                { label: 'Cadastro' },
            ]} />
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4 justify-between">
                        <div>
                            <CardTitle className="text-2xl">Cadastrar Nutricionista</CardTitle>
                            <CardDescription>
                                Preencha os dados do novo nutricionista
                            </CardDescription>
                        </div>
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/nutricionista">
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
                                        name="matricula"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Matricula *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="0000000000" {...field} />
                                                </FormControl>
                                                <div className="min-h-[20px]">
                                                    <FormDescription>Apenas números, sem pontos ou
                                                        traços</FormDescription>
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
                                <h3 className="text-lg font-semibold">Dados de Login</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="senha"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Senha *</FormLabel>
                                                <div className="relative">
                                                    <FormControl>
                                                        <Input id="password" type={showSenha ? "text" : "password"} placeholder="••••••••" {...field}/>
                                                    </FormControl>
                                                    <button
                                                        type="button"
                                                        aria-label={showSenha ? "Esconder senha" : "Mostrar senha"}
                                                        onClick={() => setShowSenha((s) => !s)}
                                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded outline-none focus:outline-none"                                                    >
                                                        {showSenha ? (
                                                        <EyeOff className="h-5 w-5" />
                                                        ) : (
                                                        <Eye className="h-5 w-5" />
                                                        )}
                                                    </button>
                                                </div>
                                                <div className="min-h-[20px]">
                                                    <FormMessage />
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="confirmaSenha"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Confirme a senha *</FormLabel>
                                                <div className="relative">
                                                    <FormControl>
                                                        <Input id="password" type={showConfirmaSenha ? "text" : "password"} placeholder="••••••••" {...field}/>
                                                    </FormControl>
                                                    <button
                                                        type="button"
                                                        aria-label={showConfirmaSenha ? "Esconder senha" : "Mostrar senha"}
                                                        onClick={() => setShowConfirmaSenha((s) => !s)}
                                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded outline-none focus:outline-none"                                                    >
                                                        {showConfirmaSenha ? (
                                                        <EyeOff className="h-5 w-5" />
                                                        ) : (
                                                        <Eye className="h-5 w-5" />
                                                        )}
                                                    </button>
                                                </div>
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
                                    <Link href="/nutricionista">
                                        Cancelar
                                    </Link>
                                </Button>
                                <Button type="submit" className="gap-2">
                                    <Save className="h-4 w-4" />
                                    Salvar Nutricionista
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}