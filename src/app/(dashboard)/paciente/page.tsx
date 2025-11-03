'use client'
import { useState, useEffect } from "react"
import { listarPacientes, handleExcluirPaciente } from "@/app/actions/paciente"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { calcularIdade, formatarCPF, formatarTelefone } from "@/lib/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"
import { Eye, LucideStethoscope, MoreVertical, Pencil, Plus, Search, StethoscopeIcon, Trash2 } from "lucide-react"
import Link from "next/link"
import { SetBreadcrumbs } from "@/lib/breadcrumbs-context"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function Page() {
    const [pacientes, setPacientes] = useState<any[]>([])
    const [meta, setMeta] = useState({ totalPages: 1, page: 1, limit: 10, totalItems: 0 })
    const [loading, setLoading] = useState(true)

    const [filtroTipo, setFiltroTipo] = useState("nome")
    const [filtroValor, setFiltroValor] = useState("")

    const [pacienteParaExcluir, setPacienteParaExcluir] = useState<number | null>(null)

    const buscar = async (page = 1) => {
        setLoading(true)
        try {
            const result = await listarPacientes(page, meta.limit, filtroTipo, filtroValor)
            setPacientes(result.data)
            setMeta(result.meta)
        } catch (error) {
            console.error("Erro ao buscar pacientes:", error)
        } finally {
            setLoading(false)
        }
    }
    const fetchData = async (page = 1) => {
        setLoading(true)
        const result = await listarPacientes(page, meta.limit)
        setPacientes(result.data)
        setMeta(result.meta)
        setLoading(false)
    }

    const router = useRouter()

    const editarPaciente = async (id: string) => {
        router.push(`/paciente/${id}/update`)
    }


    useEffect(() => {
        fetchData()
    }, [])

    const handleNext = () => {
        if (meta.page < meta.totalPages) fetchData(meta.page + 1)
    }

    const handlePrev = () => {
        if (meta.page > 1) fetchData(meta.page - 1)
    }

    if (loading) return <p className="text-center py-10">Carregando pacientes...</p>



    return (
        <div className="w-full h-full space-y-4">
            <SetBreadcrumbs items={[{ label: "Home", href: "/home" }, { label: "Paciente" }]} />
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl">Pacientes</CardTitle>
                            <CardDescription>Gerencie os pacientes cadastrados no sistema</CardDescription>
                        </div>
                        <Button className="gap-2" asChild>
                            <Link href="/paciente/create">
                                <Plus className="h-4 w-4" /> Novo Paciente
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="mb-4 flex gap-2 items-center">
                        <select
                            className="border rounded px-2 py-1"
                            value={filtroTipo}
                            onChange={(e) => setFiltroTipo(e.target.value)}
                        >
                            <option value="nome">Nome</option>
                            <option value="cpf">CPF</option>
                            <option value="email">Email</option>
                        </select>

                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Digite o valor..."
                                className="pl-8"
                                value={filtroValor}
                                onChange={(e) => setFiltroValor(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") buscar()
                                }}
                            />
                        </div>

                        <Button onClick={() => buscar(1)}>Buscar</Button>
                    </div>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>CPF</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Telefone</TableHead>
                                    <TableHead>Idade</TableHead>
                                    <TableHead>Sexo</TableHead>
                                    <TableHead>Setor</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pacientes.map((paciente) => (
                                    <TableRow key={paciente.id}>
                                        <TableCell className="font-medium">{paciente.nome}</TableCell>
                                        <TableCell>{formatarCPF(paciente.cpf)}</TableCell>
                                        <TableCell>{paciente.email}</TableCell>
                                        <TableCell>{formatarTelefone(paciente.telefone)}</TableCell>
                                        <TableCell>{calcularIdade(paciente.data_nascimento)} anos</TableCell>
                                        <TableCell>
                                            <Badge variant={paciente.sexo === "F" ? "secondary" : "outline"}>
                                                {paciente.sexo === "F" ? "Feminino" : "Masculino"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{paciente.nome_setor}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Abrir menu</span>
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                                    <DropdownMenuItem className="gap-2">
                                                        <StethoscopeIcon className="h-4 w-4" /> Iniciar Consulta
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="gap-2"><Eye className="h-4 w-4" /> Visualizar Consulta</DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="gap-2"
                                                        onClick={() => editarPaciente(paciente.id)}
                                                    >
                                                        <Pencil className="h-4 w-4" /> Editar paciente
                                                    </DropdownMenuItem>

                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => setPacienteParaExcluir(paciente.id)}
                                                        className="gap-2 text-destructive focus:text-destructive"
                                                    >
                                                        <Trash2 className="h-4 w-4" /> Excluir paciente
                                                    </DropdownMenuItem>

                                                </DropdownMenuContent>

                                            </DropdownMenu>

                                            <AlertDialog
                                                open={pacienteParaExcluir === paciente.id}
                                                onOpenChange={(open) => !open && setPacienteParaExcluir(null)}
                                            >
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Tem certeza que deseja excluir?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Essa ação não pode ser desfeita. O paciente será removido permanentemente.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel onClick={() => setPacienteParaExcluir(null)}>Cancelar</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={async () => {
                                                                try {
                                                                    await handleExcluirPaciente(paciente.id)
                                                                    setPacienteParaExcluir(null)
                                                                    await buscar(1)
                                                                    toast.success("Paciente removido com sucesso!")
                                                                } catch (error) {
                                                                    console.error("Erro ao remover paciente:", error)
                                                                    toast.error("Não foi possível remover o paciente.")
                                                                }
                                                            }}
                                                        >
                                                            Confirmar
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                    </div>
                    <div className="flex items-center justify-between mt-4">
                        <p className="text-sm text-muted-foreground">
                            Mostrando <strong>{pacientes.length}</strong> de <strong>{meta.totalItems}</strong> pacientes
                            {" "} - Página <strong>{meta.page}</strong> de <strong>{meta.totalPages}</strong>
                        </p>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" disabled={meta.page <= 1} onClick={handlePrev}>
                                Anterior
                            </Button>
                            <Button variant="outline" size="sm" disabled={meta.page >= meta.totalPages} onClick={handleNext}>
                                Próximo
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
