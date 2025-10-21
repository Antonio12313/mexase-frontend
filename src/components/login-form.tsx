'use client'
import { Paper, Title, Stack, Text } from '@mantine/core'
import { useForm } from '@mantine/form'
import { login } from "@/app/actions/auth"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { User, Unlock } from "lucide-react"
import { FormInput } from './ui/FormInput'
import { FormPasswordInput } from './ui/FormPasswordInput'
import { PrimaryButton } from './ui/PrimaryButton'

type LoginFormProps = React.ComponentProps<"div">

export function LoginForm({ className, ...props }: LoginFormProps) {
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
            <div className="md:hidden min-h-screen relative">
                <div className="absolute inset-0 w-full h-full">
                    <Image
                        fill
                        src="/images/login-mobile.svg"
                        alt="Background"
                        className="object-cover"
                    />
                </div>

                <div className="absolute bottom-0 left-0 right-0 bg-[#E8F0EF] rounded-t-[30px] pt-12 pb-8 px-6">
                    <form onSubmit={form.onSubmit(handleSubmit)}>
                        <Stack gap="md" className="max-w-[380px] mx-auto">
                            <Title order={1} size="h2" className="text-black text-center mb-4">
                                Login
                            </Title>

                            <FormInput
                                id="email"
                                type="email"
                                placeholder="Usuario:"
                                icon={<User size={20} color="#777B73" />}
                                {...form.getInputProps('email')}
                            />

                            <FormPasswordInput
                                id="password"
                                placeholder="Senha:"
                                icon={<Unlock size={20} color="#777B73" />}
                                {...form.getInputProps('senha')}
                            />

                            <PrimaryButton>
                                Login
                            </PrimaryButton>

                            {error && (
                                <Text size="sm" c="red" ta="center">
                                    {error}
                                </Text>
                            )}
                        </Stack>
                    </form>
                </div>
            </div>

            <div className="hidden md:block">
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

                                    <FormInput
                                        id="email"
                                        type="email"
                                        placeholder="Usuario:"
                                        icon={<User size={20} color="#777B73" />}
                                        {...form.getInputProps('email')}
                                    />

                                    <FormPasswordInput
                                        id="password"
                                        placeholder="Senha:"
                                        icon={<Unlock size={20} color="#777B73" />}
                                        {...form.getInputProps('senha')}
                                    />

                                    <PrimaryButton>
                                        Login
                                    </PrimaryButton>

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
                                src="/images/login.svg"
                                alt="Background"
                                className="object-cover"
                            />
                        </div>
                    </div>
                </Paper>
            </div>
        </div>
    )
}