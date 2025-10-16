'use client'
import { Paper, TextInput, PasswordInput, Button, Title, Stack, Text } from '@mantine/core'
import { useForm } from '@mantine/form'
import { login } from "@/app/actions/auth"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { User, Unlock } from "lucide-react"

export function LoginForm({
                              className,
                              ...props
                          }: React.ComponentProps<"div">) {
    const [error, setError] = useState<string>("")
    const router = useRouter()

    const form = useForm({
        initialValues: {
            email: '',
            senha: ''
        },
        validate: {
            email: (value) => {
                if (!value) return 'Email é obrigatório'
                if (!/^\S+@\S+$/.test(value)) return 'Email inválido'
                return null
            },
            senha: (value) => !value ? 'Senha é obrigatória' : null
        }
    })

    async function handleSubmit(values: typeof form.values) {
        setError("")
        const result = await login(values.email, values.senha)

        if (result.error) {
            setError(result.error)
        } else {
            router.push('/home')
            router.refresh()
        }
    }

    return (
        <div className={className} {...props}>
            <Paper
                shadow="xl"
                radius="lg"
                className="max-w-[920px] mx-auto overflow-hidden p-0"
            >
                <div className="grid md:grid-cols-[468px_452px]">
                    <div className="p-8 md:p-12 flex flex-col justify-center">
                        <form onSubmit={form.onSubmit(handleSubmit)}>
                            <Stack gap="md">
                                <div className="flex flex-col items-center gap-4">
                                    <Title order={1} size="h2" className="text-black">
                                        Login
                                    </Title>
                                </div>

                                <TextInput
                                    id="email"
                                    type="email"
                                    placeholder="Usuario:"
                                    leftSection={<User size={20} color="#777B73" />}
                                    styles={{
                                        input: {
                                            height: '56px',
                                            backgroundColor: '#EDF5E6',
                                            border: 'none',
                                            borderRadius: '18px',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                            fontSize: '14px',
                                            '::placeholder': {
                                                color: '#777B73',
                                                fontWeight: 'bold'
                                            }
                                        }
                                    }}
                                    {...form.getInputProps('email')}
                                />

                                <PasswordInput
                                    id="password"
                                    placeholder="Senha:"
                                    leftSection={<Unlock size={20} color="#777B73" />}
                                    styles={{
                                        input: {
                                            height: '56px',
                                            backgroundColor: '#EDF5E6',
                                            border: 'none',
                                            borderRadius: '18px',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                            fontSize: '14px',
                                            '::placeholder': {
                                                color: '#777B73',
                                                fontWeight: 'bold'
                                            }
                                        }
                                    }}
                                    {...form.getInputProps('senha')}
                                />

                                <Button
                                    type="submit"
                                    fullWidth
                                    size="lg"
                                    className="h-[56px] bg-[#97B067]"
                                    styles={{
                                        root: {
                                            borderRadius: '20px',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                            fontWeight: 'bold',
                                            '&:hover': {
                                                backgroundColor: '#88a058'
                                            }
                                        }
                                    }}
                                >
                                    Login
                                </Button>

                                {error && (
                                    <Text size="sm" c="red" ta="center">
                                        {error}
                                    </Text>
                                )}
                            </Stack>
                        </form>
                    </div>

                    <div className="relative hidden md:block rounded-r-[25px] overflow-hidden">
                        <Image
                            width={452}
                            height={600}
                            src="/images/retangulo.svg"
                            alt="Background"
                            className="object-cover"
                        />
                    </div>
                </div>
            </Paper>
        </div>
    )
}