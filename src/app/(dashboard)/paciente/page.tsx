import {Button} from "@/components/ui/button"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Badge} from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Eye, MoreVertical, Pencil, Plus, Search, Trash2} from "lucide-react"
import Link from "next/link";
import {SetBreadcrumbs} from "@/lib/breadcrumbs-context";

// Dados mockados para exemplo
const pacientes = [
    {
        id: 1,
        nome: "Maria Silva Santos",
        email: "maria.silva@email.com",
        cpf: "123.456.789-00",
        data_nascimento: "1985-03-15",
        telefone: "(11) 98765-4321",
        sexo: "F",
        naturalidade: "São Paulo",
        setor: "Cardiologia"
    },
    {
        id: 2,
        nome: "João Pedro Oliveira",
        email: "joao.pedro@email.com",
        cpf: "987.654.321-00",
        data_nascimento: "1990-07-22",
        telefone: "(11) 99876-5432",
        sexo: "M",
        naturalidade: "Rio de Janeiro",
        setor: "Ortopedia"
    },
    {
        id: 3,
        nome: "Ana Carolina Lima",
        email: "ana.lima@email.com",
        cpf: "456.789.123-00",
        data_nascimento: "1978-11-30",
        telefone: "(11) 97654-3210",
        sexo: "F",
        naturalidade: "Belo Horizonte",
        setor: "Pediatria"
    },
    {
        id: 4,
        nome: "Carlos Eduardo Souza",
        email: "carlos.souza@email.com",
        cpf: "321.654.987-00",
        data_nascimento: "1995-01-10",
        telefone: "(11) 96543-2109",
        sexo: "M",
        naturalidade: "Curitiba",
        setor: "Neurologia"
    },
    {
        id: 5,
        nome: "Juliana Ferreira Costa",
        email: "juliana.costa@email.com",
        cpf: "789.123.456-00",
        data_nascimento: "1988-09-05",
        telefone: "(11) 95432-1098",
        sexo: "F",
        naturalidade: "Salvador",
        setor: "Dermatologia"
    },
]

function calcularIdade(dataNascimento: string): number {
    const hoje = new Date()
    const nascimento = new Date(dataNascimento)
    let idade = hoje.getFullYear() - nascimento.getFullYear()
    const mes = hoje.getMonth() - nascimento.getMonth()
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--
    }
    return idade
}

export default function Page() {
    return (
        <div className="w-full h-full space-y-4">
            <SetBreadcrumbs items={[
                {label: 'Home', href: '/home'},
                {label: 'Paciente'}
            ]}/>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl">Pacientes</CardTitle>
                            <CardDescription>
                                Gerencie os pacientes cadastrados no sistema
                            </CardDescription>
                        </div>
                        <Button className="gap-2" asChild>
                            <Link href="/paciente/create">
                                <Plus className="h-4 w-4"/>
                                Novo Paciente
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="mb-4">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                            <Input
                                type="search"
                                placeholder="Buscar por nome, CPF ou email..."
                                className="pl-8"
                            />
                        </div>
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
                                        <TableCell className="font-medium">
                                            {paciente.nome}
                                        </TableCell>
                                        <TableCell>{paciente.cpf}</TableCell>
                                        <TableCell>{paciente.email}</TableCell>
                                        <TableCell>{paciente.telefone}</TableCell>
                                        <TableCell>
                                            {calcularIdade(paciente.data_nascimento)} anos
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={paciente.sexo === "F" ? "secondary" : "outline"}>
                                                {paciente.sexo === "F" ? "Feminino" : "Masculino"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{paciente.setor}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Abrir menu</span>
                                                        <MoreVertical className="h-4 w-4"/>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                                    <DropdownMenuItem className="gap-2">
                                                        <Eye className="h-4 w-4"/>
                                                        Visualizar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="gap-2">
                                                        <Pencil className="h-4 w-4"/>
                                                        Editar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator/>
                                                    <DropdownMenuItem
                                                        className="gap-2 text-destructive focus:text-destructive">
                                                        <Trash2 className="h-4 w-4"/>
                                                        Excluir
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                        <p className="text-sm text-muted-foreground">
                            Mostrando <strong>5</strong> de <strong>5</strong> pacientes
                        </p>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" disabled>
                                Anterior
                            </Button>
                            <Button variant="outline" size="sm" disabled>
                                Próximo
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}