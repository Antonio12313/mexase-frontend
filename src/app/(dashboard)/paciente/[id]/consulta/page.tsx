"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { listarConsultas, obterTokenParaPDF } from "@/app/actions/consulta"; // você vai criar isso
import api from "@/services/api";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { SetBreadcrumbs } from "@/lib/breadcrumbs-context";
import { formatarCPF, formatarTelefone } from "@/lib/utils";
import { Eye, MoreVertical, Pencil, Plus, Printer } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { fi, ur } from "zod/v4/locales";
import { toast } from "sonner";

export default function ConsultasPage() {
  const [consultas, setConsultas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [printing, setPrinting] = useState(false);

  const router = useRouter();

  const params = useParams();
  const pacienteId = params.id;

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      try {
        const result = await listarConsultas(pacienteId as string);
        setConsultas(result.data);
      } catch (err) {
        console.error("Erro ao listar consultas:", err);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  const visualizarConsulta = (idConsulta: number) => {
    router.push(`/paciente/${idConsulta}/consulta/view`);
  };

  const editarConsulta = (idConsulta: number) => {
    router.push(
      `/paciente/${pacienteId}/consulta/create?consulta=${idConsulta}`
    );
  };

  const imprimirConsulta = async (idConsulta: string) => {
    setPrinting(true);
    try {
      const tokenResult = await obterTokenParaPDF();

      if (!tokenResult.success || !tokenResult.token) {
        toast.error("Não foi possível carregar o PDF para impressão.");
        return;
      }

      const token = tokenResult.token;
      const url = `${process.env.NEXT_PUBLIC_API_URL}/consulta/${idConsulta}/pdf`;
      console.log("TOKEN:", obterTokenParaPDF());
      const response = await axios.get(url, {
        responseType: "arraybuffer",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const arrayBuffer = response.data;

      const blob = new Blob([arrayBuffer], { type: "application/pdf" });

      const urlPDF = URL.createObjectURL(blob);
      const newWindow = window.open(urlPDF, "_blank");

      if (!newWindow) {
        toast.error(
          "O bloqueador de pop-up impediu a abertura. Permita pop-ups."
        );
      }

      setTimeout(() => URL.revokeObjectURL(urlPDF), 60000);
    } catch (error) {
      toast.error("Não foi possível carregar o PDF para impressão.");
    } finally {
      setPrinting(false);
    }
  };

  return (
    <div className="w-full h-full space-y-4">
      <SetBreadcrumbs
        items={[
          { label: "Home", href: "/home" },
          { label: "Paciente", href: "/paciente" },
          { label: "Listar Consultas" },
        ]}
      />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Consultas</CardTitle>
              <CardDescription>
                Histórico de consultas realizadas no sistema
              </CardDescription>
            </div>
            <Button className="gap-3" asChild>
              <Link href={`/paciente/${pacienteId}/consulta/create`}>
                <Plus className="h-4 w-4" /> Nova Consulta
              </Link>
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            {loading ? (
              <p>Carregando...</p>
            ) : consultas.length === 0 ? (
              <p className="text-center text-muted-foreground py-6">
                Nenhuma consulta encontrada para este paciente.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Nutricionista</TableHead>
                    <TableHead>Paciente</TableHead>
                    <TableHead>CPF</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead className="text-right"></TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {consultas.map((c, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {new Date(c.data_consulta).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell>{c.nutricionista?.nome}</TableCell>
                      <TableCell>{c.paciente?.nome}</TableCell>
                      <TableCell>{formatarCPF(c.paciente?.cpf)}</TableCell>
                      <TableCell>{c.paciente?.email}</TableCell>
                      <TableCell>
                        {formatarTelefone(c.paciente?.telefone)}
                      </TableCell>

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
                              onClick={() => visualizarConsulta(c.id)}
                            >
                              <Eye className="h-4 w-4" /> Visualizar Consulta
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="gap-2"
                              onClick={() => editarConsulta(c.id)}
                            >
                              <Pencil className="h-4 w-4" /> Editar Consulta
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="gap-2"
                              onClick={() => imprimirConsulta(c.id)}
                              disabled={printing}
                            >
                              {printing ? (
                                <>
                                  <span className="h-4 w-4 animate-spin border-t-2 border-r-2 rounded-full mr-2" />
                                  Gerando PDF...
                                </>
                              ) : (
                                <>
                                  <Printer className="h-4 w-4" /> Imprimir
                                  Consulta
                                </>
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {loading && (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Carregando consultas...
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
