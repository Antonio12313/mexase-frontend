'use client'
import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {Card, CardContent} from "@/components/ui/card"
import {Field, FieldDescription, FieldGroup, FieldLabel,} from "@/components/ui/field"
import {Input} from "@/components/ui/input"
import {login} from "@/app/actions/auth";
import {useState} from "react";
import {useRouter} from "next/navigation"
import Image from "next/image";

export function LoginForm({
                              className,
                              ...props
                          }: React.ComponentProps<"div">) {
    const [email, setEmail] = useState<string>("");
    const [senha, setSenha] = useState<string>("");
    const [error, setError] = useState<string>("")
    const router = useRouter()

    async function efetuarLogin() {
        const result = await login(email, senha)

        if (result.error) {
            setError(result.error)
        } else {
            router.push('/home')
            router.refresh()
        }
    }

    return (
            <div className={cn("flex flex-col gap-6", className)} {...props}>
                <Card className="overflow-hidden p-0">
                    <CardContent className="grid p-0 md:grid-cols-2">
                        <form className="p-6 md:p-8">
                            <FieldGroup>
                                <div className="flex flex-col items-center gap-2 text-center">
                                    <h1 className="text-2xl font-bold">Welcome back</h1>
                                    <p className="text-muted-foreground text-balance">
                                        Login to your Acme Inc account
                                    </p>
                                </div>
                                <Field>
                                    <FieldLabel htmlFor="email">Email</FieldLabel>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="m@example.com"
                                        required
                                    />
                                </Field>
                                <Field>
                                    <div className="flex items-center">
                                        <FieldLabel htmlFor="password">Password</FieldLabel>
                                    </div>
                                    <Input id="password" type="password" required value={senha}
                                           onChange={(e) => setSenha(e.target.value)}/>
                                </Field>
                                <Field>
                                    <Button type="button" onClick={efetuarLogin}>Login</Button>
                                </Field>
                            </FieldGroup>
                        </form>
                        <div className="bg-muted relative hidden md:block">
                            <Image
                                width={0}
                                height={0}
                                src="/images/placeholder.svg"
                                alt="Image"
                                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
    )
}
