'use client'

import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import React, {useState} from "react"
import {useRouter} from "next/navigation"
import {login} from "@/app/actions/auth"
import {useForm} from "react-hook-form"
import {FormField} from "./form-field"

type LoginFormData = {
    email: string
    senha: string
}

export function LoginForm({
                              className,
                              ...props
                          }: React.ComponentPropsWithoutRef<"form">) {
    const [error, setError] = useState("")
    const router = useRouter()

    const form = useForm<LoginFormData>({
        defaultValues: {email: '', senha: ''}
    })

    const onSubmit = async (data: LoginFormData) => {
        setError("")
        const result = await login(data.email, data.senha)

        if (result.error) {
            setError(result.error)
        } else {
            router.push('/home')
            router.refresh()
        }
    }

    return (
        <form
            className={cn("flex flex-col gap-6", className)}
            onSubmit={form.handleSubmit(onSubmit)}
            {...props}
        >
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Fazer Login</h1>
                <p className="text-balance text-sm text-muted-foreground">
                    Coloque seu email abaixo para logar na sua conta
                </p>
            </div>

            {error && (
                <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                    {error}
                </div>
            )}

            <div className="grid gap-6">
                <FormField
                    control={form.control}
                    name="email"
                    label="Email"
                >
                    <Input
                        type="email"
                        placeholder="email@example.com"
                        required
                    />
                </FormField>

                <FormField
                    control={form.control}
                    name="senha"
                    label="Senha"
                >
                    <Input
                        type="password"
                        required
                    />
                </FormField>

                <Button
                    type="submit"
                    className="w-full"
                    disabled={form.formState.isSubmitting}
                >
                    {form.formState.isSubmitting ? "Carregando..." : "Login"}
                </Button>
            </div>
        </form>
    )
}