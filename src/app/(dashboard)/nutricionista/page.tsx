'use client'
import { useState, useEffect } from "react"
import { listarNutricionistas, handleExcluirNutricionista } from "@/app/actions/nutricionista"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { formatarTelefone } from "@/lib/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "@/components/ui/alert-dialog"
import { MoreVertical, Pencil, Plus, Search, Trash2 } from "lucide-react"
import Link from "next/link"
import { SetBreadcrumbs } from "@/lib/breadcrumbs-context"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Page() {
    const [nutricionistas, setNutricionistas] = useState<any[]>([])
    const [meta, setMeta] = useState({ totalPages: 1, page: 1, limit: 10, totalItems: 0 })
    const [loading, setLoading] = useState(true)

    const [filtroTipo, setFiltroTipo] = useState("nome")
    const [filtroValor, setFiltroValor] = useState("")
    const [filtroStatus, setFiltroStatus] = useState("todos")

    const [nutricionistaParaExcluir, setNutricionistaParaExcluir] = useState<number | null>(null)

    const buscar = async (page = 1) => {
        setLoading(true)
        try {
            const result = await listarNutricionistas(page, meta.limit, filtroTipo, filtroValor)
            setNutricionistas(result.data)
            setMeta(result.meta)
        } catch (error) {
            console.error("Erro ao buscar nutricionistas:", error)
        } finally {
            setLoading(false)
        }
    }
    const fetchData = async (page = 1) => {
        setLoading(true)
        const result = await listarNutricionistas(page, meta.limit)
        setNutricionistas(result.data)
        setMeta(result.meta)
        setLoading(false)
    }

    const router = useRouter()

    const editarNutricionista = async (id: string) => {
        router.push(`/nutricionista/${id}/update`)
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

    if (loading) return <p className="text-center py-10">Carregando nutricionistas...</p>

    return (
        <div className="w-full h-full space-y-4">
            <SetBreadcrumbs items={[{ label: "Home", href: "/home" }, { label: "Nutricionista" }]} />
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl">Nutricionistas</CardTitle>
                            <CardDescription>Gerencie os nutricionistas cadastrados no sistema</CardDescription>
                        </div>
                        <Button className="gap-3" asChild>
                            <Link href="/nutricionista/create">
                                <Plus className="h-4 w-4" /> Novo Nutri
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="mb-4 flex gap-2 items-center">

                        <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                            <SelectTrigger className="w-32">
                                <SelectValue placeholder="Tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="nome">Nome</SelectItem>
                                <SelectItem value="matricula">Matricula</SelectItem>
                                <SelectItem value="email">Email</SelectItem>
                            </SelectContent>
                        </Select>

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
                                    <TableHead>Matricula</TableHead>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Telefone</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {nutricionistas.map((nutricionista) => (
                                    <TableRow key={nutricionista.id}>
                                        <TableCell>{nutricionista.matricula}</TableCell>
                                        <TableCell className="font-medium">{nutricionista.nome}</TableCell>
                                        <TableCell>{nutricionista.email}</TableCell>
                                        <TableCell>{formatarTelefone(nutricionista.telefone)}</TableCell>
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
                                                    <DropdownMenuItem
                                                        className="gap-2"
                                                        onClick={() => editarNutricionista(nutricionista.id)}
                                                    >
                                                        <Pencil className="h-4 w-4" /> Editar nutricionista
                                                    </DropdownMenuItem>

                                                    <DropdownMenuSeparator />

                                                    <DropdownMenuItem
                                                        onClick={() => setNutricionistaParaExcluir(nutricionista.id)}
                                                        className="gap-2 text-destructive focus:text-destructive"
                                                    >
                                                        <Trash2 className="h-4 w-4" /> Excluir nutricionista
                                                    </DropdownMenuItem>

                                                </DropdownMenuContent>

                                            </DropdownMenu>
                                             <AlertDialog
                                                open={nutricionistaParaExcluir === nutricionista.id}
                                                onOpenChange={(open) => !open && setNutricionistaParaExcluir(null)}
                                            >
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Tem certeza que deseja excluir?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Essa ação não pode ser desfeita. O nutricionista será removido permanentemente.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel onClick={() => setNutricionistaParaExcluir(null)}>Cancelar</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={async () => {
                                                                try {
                                                                    await handleExcluirNutricionista(nutricionista.id)
                                                                    setNutricionistaParaExcluir(null)
                                                                    await buscar(1)
                                                                    toast.success("Nutricionista removido com sucesso!")
                                                                } catch (error) {
                                                                    console.error("Erro ao remover nutricionista:", error)
                                                                    toast.error("Não foi possível remover o nutricionista.")
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
                            Mostrando <strong>{nutricionistas.length}</strong> de <strong>{meta.totalItems}</strong> nutricionistas
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
