'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { alterarSenhaNutricionista } from "@/app/actions/nutricionista"
import { toast } from "sonner"
import Link from "next/link"
import { Save, ArrowLeft, EyeOff, Eye } from "lucide-react"

const schema = z.object({
  senha: z.string()
        .min(6, { error: "A senha deve ter no mínimo 6 caracteres" })
        .max(100, { error: "A senha deve ter no máximo 100 caracteres" }),
  confirmaSenha: z.string()
      .min(6, { error: "A confirmação de senha deve ter no mínimo 6 caracteres" })
      .max(100, { error: "A confirmação de senha deve ter no máximo 100 caracteres" }),
}).refine(
  (data) =>
    !data.senha || !data.confirmaSenha || data.senha === data.confirmaSenha,
  {
    message: "As senhas não coincidem",
    path: ["confirmaSenha"],
  }
)

type FormValues = z.infer<typeof schema>

export function FormularioAlterarSenha({ nutricionistaId }: { nutricionistaId: string }) {

  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmaSenha, setShowConfirmaSenha] = useState(false);

  const form = useForm<FormValues>({
      resolver: zodResolver(schema),
      defaultValues: {
          senha: "",
          confirmaSenha: "",
      },
  })

  const onSubmit = async (data: FormValues) => {
    try {
      const result = await alterarSenhaNutricionista(nutricionistaId, {
        senha: data.senha,
      })
      if (result.success) toast.success("Senha atualizada com sucesso!")
      else toast.error(result.error || "Erro ao alterar senha")
    } catch {
      toast.error("Erro inesperado ao salvar")
    }
  }

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
