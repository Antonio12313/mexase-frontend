'use client'

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { SetBreadcrumbs } from "@/lib/breadcrumbs-context"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Save, ArrowLeft, ArrowRight } from "lucide-react"
import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { obterDadosDieteticos } from "@/app/actions/paciente"
import { buscarConsultaPorId, salvarConsulta } from "@/app/actions/consulta"
import { toast } from "sonner"



const historicoFamiliar = z.object({
    historico_hipertensao: z.boolean().default(false),
    historico_diabetes: z.boolean().default(false),
    historico_dislipidemia: z.boolean().default(false),
    historico_cancer: z.boolean().default(false),
    historico_cardiacas: z.boolean().default(false),
    historico_tireoide: z.boolean().default(false),
    historico_excesso_peso: z.boolean().default(false),
    historico_outras_condicoes: z.string().optional(),
    antecedentes_familiares: z.string().optional(),
})

const estiloVida = z.object({
    tipo_exercicio: z.string().optional(),
    frequencia_exercicio_semana: z.string().optional(),
    duracao_exercicio_minutos: z.string().optional(),
    orientacao_dieta: z.string().optional(),
    tabagista_status: z.string().optional(),
    etilista: z.boolean().default(false),
    duracao_etilismo_anos: z.string().optional(),
    frequencia_etilismo: z.string().optional(),
    problema_denticao: z.boolean().default(false),
    tempo_sono_horas: z.string().optional(),
    medicamentos: z.string().optional(),
    suplementos: z.string().optional(),
    restricao_sal: z.boolean().default(false),
    restricao_acucar: z.boolean().default(false),
    outras_restricoes: z.string().optional(),
    local_refeicoes: z.string().optional(),
    quem_prepara_refeicoes: z.string().optional(),
})

const consultaBase = z.object({
    eliminacao_intestinal: z.string().max(60),
    frequencia_evacuatoria: z.string().max(60),
    objetivo_consulta: z.string().max(150),
    peso_atual: z.number(),
    peso_habitual: z.number(),
    estatura: z.number(),
    imc_atual: z.number(),
    cb: z.number(),          // Circunferência do Braço
    cc: z.number(),          // Circunferência da Cintura
    cq: z.number(),          // Circunferência do Quadril
    c_pescoco: z.number(),   // Circunferência do Pescoço
    dct: z.number(),         // Dobra Cutânea Tricipital
    dcb: z.number(),         // Dobra Cutânea Bicipital
    dcse: z.number(),        // Dobra Cutânea Subescapular
    dcsi: z.number(),        // Dobra Cutânea Supra-Ilíaca
    dcx: z.number(),         // Dobra Cutânea da Coxa
    dca: z.number(),         // Dobra Cutânea Abdominal
    ambc: z.number(),        // Área Muscular do Braço Corrigida
    cmb: z.number(),         // Circunferência Muscular do Braço
    somatorio_dobras: z.number(),
    id_nutricionista: z.number().int(),
    id_paciente: z.number().int(),
    percentual_gc: z.number().optional(),
})

const classificacoesDefaultArray = [
    { parametro: "peso_atual", valor_classificacao: "" },
    { parametro: "peso_habitual", valor_classificacao: "" },
    { parametro: "estatura", valor_classificacao: "" },
    { parametro: "imc_atual", valor_classificacao: "" },
    { parametro: "cb", valor_classificacao: "" },
    { parametro: "cc", valor_classificacao: "" },
    { parametro: "cq", valor_classificacao: "" },
    { parametro: "c_pescoco", valor_classificacao: "" },
    { parametro: "dct", valor_classificacao: "" },
    { parametro: "dcb", valor_classificacao: "" },
    { parametro: "dcse", valor_classificacao: "" },
    { parametro: "dcsi", valor_classificacao: "" },
    { parametro: "dcx", valor_classificacao: "" },
    { parametro: "dca", valor_classificacao: "" },
    { parametro: "ambc", valor_classificacao: "" },
    { parametro: "cmb", valor_classificacao: "" },
    { parametro: "somatorio_dobras", valor_classificacao: "" },
    { parametro: "percentual_gc", valor_classificacao: "" },
];

export const TipoRefeicaoEnum = z.enum([
    "Desjejum",
    "Colação",
    "Almoço",
    "Lanche",
    "Jantar",
    "Ceia",
]);

export const FrequenciaEnum = z.enum([
    "Diário",
    "Semanal",
    "Quinzenal",
    "Mensal",
]);

export const DiaSemanaEnum = z.enum([
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
]);


const refeicaoSchema = z.object({
    tipo_refeicao: TipoRefeicaoEnum,
    dia_semana: DiaSemanaEnum,
    horario_refeicao: z
        .string()
        .optional(),

    alimentos_consumidos: z.string().max(250).optional(),
    frequencia: FrequenciaEnum.default("Diário"),
    observacao: z.string().max(250).optional(),
    grupos_alimentares_ids: z.array(z.number()),
});


const recordatorioSchema = z.object({
    desjejum: refeicaoSchema,
    colacao: refeicaoSchema,
    almoco: refeicaoSchema,
    lanche: refeicaoSchema,
    jantar: refeicaoSchema,
    ceia: refeicaoSchema,
});


const dadosDieteticos = z.object({
    aversao_alimentos: z.string().max(150, "Máximo de 150 caracteres").optional(),
    preferencia_alimentos: z.string().max(150, "Máximo de 150 caracteres").optional(),
    alergia_alimentos: z.string().max(150, "Máximo de 150 caracteres").optional(),
})


export const UnidadeMedidaEnum = z.enum([
    "g/dL", "mg/dL", "mmol/L", "U/L", "μmol/L", "ng/mL", "pg/mL",
    "IU/L", "mEq/L", "g/L", "mg/L", "mmHg", "µg/dL", "mL/min", "U/gHb",
    "U/gCr", "U/mL", "ng/dL", "mmol/mol", "mg/mL", "µmol/mol", "mIU/L",
    "U/mg", "U/g", "U/µL", "mg/mmol", "mmol/mmol", "µg/mL", "ng/µL", "Outro"
]);

export type DadoBioquimico = z.infer<typeof dadoBioquimicoSchema>;

export const dadoBioquimicoSchema = z.object({
    nome_exame: z.string(),
    valor: z.number().optional(),
    unidade: UnidadeMedidaEnum.default("mg/dL"),
    data_exame: z.string().min(1, "A data do exame é obrigatória."),
});

export const dadosBioquimicosSchema = z.array(dadoBioquimicoSchema);

export const diagnosticoSchema = z.object({
    diagnostico_nutricional: z
        .string(),
    diagnostico_dietoterapia: z
        .string(),
    conduta_nutricional: z
        .string(),
});

const classificacaoSchema = z.object({
    parametro: z.string(),
    valor_classificacao: z.string().optional(),
});

export const classificacoesSchema = z.array(classificacaoSchema);


const schema = z.object({
    historicoFamiliar,
    estiloVida,
    consultaBase,
    recordatorio: recordatorioSchema,
    dadosDieteticos,
    dados_bioquimicos: dadosBioquimicosSchema,
    diagnostico: diagnosticoSchema,
    classificacao: classificacoesSchema
})

const dadosBioquimicosDefault = [
    {
        nome_exame: "",
        valor: 0,
        unidade: UnidadeMedidaEnum.enum["mg/dL"],
        data_exame: new Date().toISOString().split("T")[0],
    },
];



const recordatorioDefault = {
    desjejum: {
        tipo_refeicao: TipoRefeicaoEnum.enum.Desjejum,
        dia_semana: DiaSemanaEnum.enum["Segunda-feira"],
        horario_refeicao: "7:30",
        alimentos_consumidos: "cafe",
        frequencia: FrequenciaEnum.enum.Diário,
        observacao: "",
        grupos_alimentares_ids: [],
    },
    colacao: {
        tipo_refeicao: TipoRefeicaoEnum.enum.Colação,
        dia_semana: DiaSemanaEnum.enum["Segunda-feira"],
        horario_refeicao: "7:30",
        alimentos_consumidos: "cafe",
        frequencia: FrequenciaEnum.enum.Diário,
        observacao: "",
        grupos_alimentares_ids: [],
    },
    almoco: {
        tipo_refeicao: TipoRefeicaoEnum.enum.Almoço,
        dia_semana: DiaSemanaEnum.enum["Segunda-feira"],
        horario_refeicao: "",
        alimentos_consumidos: "",
        frequencia: FrequenciaEnum.enum.Diário,
        observacao: "",
        grupos_alimentares_ids: [],
    },
    lanche: {
        tipo_refeicao: TipoRefeicaoEnum.enum.Lanche,
        dia_semana: DiaSemanaEnum.enum["Segunda-feira"],
        horario_refeicao: "",
        alimentos_consumidos: "",
        frequencia: FrequenciaEnum.enum.Diário,
        observacao: "",
        grupos_alimentares_ids: [],
    },
    jantar: {
        tipo_refeicao: TipoRefeicaoEnum.enum.Jantar,
        dia_semana: DiaSemanaEnum.enum["Segunda-feira"],
        horario_refeicao: "",
        alimentos_consumidos: "",
        frequencia: FrequenciaEnum.enum.Diário,
        observacao: "",
        grupos_alimentares_ids: [],
    },
    ceia: {
        tipo_refeicao: TipoRefeicaoEnum.enum.Ceia,
        dia_semana: DiaSemanaEnum.enum["Segunda-feira"],
        horario_refeicao: "",
        alimentos_consumidos: "",
        frequencia: FrequenciaEnum.enum.Diário,
        observacao: "",
        grupos_alimentares_ids: [],
    },
};

const parametroNomes = {
    peso_atual: "Peso Atual",
    peso_habitual: "Peso Habitual",
    estatura: "Estatura",
    imc_atual: "IMC Atual",
    cb: "Circ. Braço (CB)",
    cc: "Circ. Cintura (CC)",
    cq: "Circ. Quadril (CQ)",
    c_pescoco: "Circ. Pescoço",
    dct: "Dobra Tricipital (DCT)",
    dcb: "Dobra Bicipital (DCB)",
    dcse: "Dobra Subescapular (DCSE)",
    dcsi: "Dobra Supra-ilíaca (DCSI)",
    dcx: "Dobra da Coxa (DCX)",
    dca: "Dobra Abdominal (DCA)",
    ambc: "Área Muscular Braço Corrigida (AMBC)",
    cmb: "Circ. Muscular Braço (CMB)",
    somatorio_dobras: "Somatório das Dobras",
    percentual_gc: "% Gordura Corporal (%GC)",
};





const diagnosticoDefault = {
    diagnostico_nutricional: "",
    diagnostico_dietoterapia: "",
    conduta_nutricional: "",
};

export const RecordatorioItemSchema = z.object({
    tipo_refeicao: TipoRefeicaoEnum,
    dia_semana: DiaSemanaEnum,
    horario_refeicao: z.string(),
    alimentos_consumidos: z.string(),
    frequencia: FrequenciaEnum,
    observacao: z.string(),
    grupos_alimentares_ids: z.array(z.string()),
});

export type RecordatorioItem = z.infer<typeof RecordatorioItemSchema>;


export default function CadastroConsulta() {
    const [step, setStep] = useState(1)

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            historicoFamiliar: {
                historico_hipertensao: false,
                historico_diabetes: false,
                historico_dislipidemia: false,
                historico_cancer: false,
                historico_cardiacas: false,
                historico_tireoide: false,
                historico_excesso_peso: false,
                historico_outras_condicoes: "",
                antecedentes_familiares: "",
            },
            estiloVida: {
                tipo_exercicio: "",
                frequencia_exercicio_semana: "",
                duracao_exercicio_minutos: "",
                orientacao_dieta: "",
                tabagista_status: "",
                etilista: false,
                duracao_etilismo_anos: "",
                frequencia_etilismo: "",
                problema_denticao: false,
                tempo_sono_horas: "",
                medicamentos: "",
                suplementos: "",
                restricao_sal: false,
                restricao_acucar: false,
                outras_restricoes: "",
                local_refeicoes: "",
                quem_prepara_refeicoes: "",
            },
            consultaBase: {
                eliminacao_intestinal: "",
                frequencia_evacuatoria: "",
                peso_atual: 0,
                peso_habitual: 0,
                estatura: 0,
                imc_atual: 0,
                cb: 0,           // Circunferência do Braço
                cc: 0,           // Circunferência da Cintura
                cq: 0,           // Circunferência do Quadril
                c_pescoco: 0,    // Circunferência do Pescoço
                dct: 0,          // Dobra Cutânea Tricipital
                dcb: 0,          // Dobra Cutânea Bicipital
                dcse: 0,         // Dobra Cutânea Subescapular
                dcsi: 0,         // Dobra Cutânea Supra-Ilíaca
                dcx: 0,          // Dobra Cutânea da Coxa
                dca: 0,          // Dobra Cutânea Abdominal
                ambc: 0,         // Área Muscular do Braço Corrigida
                cmb: 0,          // Circunferência Muscular do Braço
                somatorio_dobras: 0,
                id_nutricionista: 0,
                id_paciente: 0,
            },
            recordatorio: recordatorioDefault,
            dadosDieteticos: {
                aversao_alimentos: "",
                preferencia_alimentos: "",
                alergia_alimentos: "",
            },
            dados_bioquimicos: dadosBioquimicosDefault,
            diagnostico: diagnosticoDefault,
            classificacao: classificacoesDefaultArray

        }


    })

    const params = useParams();
    const pacienteId = params.id;
    const [pularColetaInicial, setPularColetaInicial] = useState(false);

    const defaultHistorico = {
        historico_hipertensao: false, historico_diabetes: false, historico_dislipidemia: false,
        historico_cancer: false, historico_cardiacas: false, historico_tireoide: false,
        historico_excesso_peso: false, historico_outras_condicoes: "", antecedentes_familiares: "",
    };

    useEffect(() => {
        async function fetchDadosPaciente() {
            try {
                const res = await obterDadosDieteticos(pacienteId as string)
                if (res.success || res.data) {
                    setPularColetaInicial(true);
                    setStep(4);
                } else {
                    setPularColetaInicial(false);
                    setStep(1);
                }
            } catch (err) {

                console.error("Erro ao buscar paciente", err);
            }
        }

        if (pacienteId) {
            fetchDadosPaciente();
        }
    }, [pacienteId]);

    const searchParams = useSearchParams();
    const consultaId = searchParams.get("consulta");

    useEffect(() => {
        async function carregarConsulta() {
            if (!consultaId) return;

            const response = await buscarConsultaPorId(consultaId);
            const data = response.data;

            // 1. Preparar Recordatório e Exames (mantém igual)
            const recordatorioObj = {
                desjejum: data.recordatorio.find((r: any) => r.tipo_refeicao === "Desjejum") ?? recordatorioDefault.desjejum,
                colacao: data.recordatorio.find((r: any) => r.tipo_refeicao === "Colação") ?? recordatorioDefault.colacao,
                almoco: data.recordatorio.find((r: any) => r.tipo_refeicao === "Almoço") ?? recordatorioDefault.almoco,
                lanche: data.recordatorio.find((r: any) => r.tipo_refeicao === "Lanche") ?? recordatorioDefault.lanche,
                jantar: data.recordatorio.find((r: any) => r.tipo_refeicao === "Jantar") ?? recordatorioDefault.jantar,
                ceia: data.recordatorio.find((r: any) => r.tipo_refeicao === "Ceia") ?? recordatorioDefault.ceia,
            };

            const dadosBioquimicosFormatados = data.dados_bioquimicos.map((exame: any) => ({
                ...exame,
                data_exame: exame.data_exame ? exame.data_exame.split('T')[0] : new Date().toISOString().split('T')[0]
            }));

            // 2. TRATAMENTO DE CHOQUE (Preencher dados faltantes para enganar o Zod)

            // Se a API não mandou historicoFamiliar, usamos o default (vazio/false) para o form não quebrar
            const historicoFamiliarSafe = data.historicoFamiliar || defaultHistorico;

            // Se a API não mandou dadosDieteticos, usamos o default
            const dadosDieteticosSafe = data.dadosDieteticos || {
                aversao_alimentos: "", preferencia_alimentos: "", alergia_alimentos: ""
            };

            // Se a API não mandou estiloVida, pegamos os valores atuais do form (que são os defaults)
            // ou um objeto vazio tratado
            const estiloVidaSafe = data.estiloVida ? {
                ...data.estiloVida,
                frequencia_exercicio_semana: String(data.estiloVida.frequencia_exercicio_semana ?? ""),
                duracao_exercicio_minutos: String(data.estiloVida.duracao_exercicio_minutos ?? ""),
                tempo_sono_horas: String(data.estiloVida.tempo_sono_horas ?? ""),
                duracao_etilismo_anos: String(data.estiloVida.duracao_etilismo_anos ?? ""),
            } : form.getValues().estiloVida; // Usa o default do form


            // 3. Montar o objeto FINAL
            const dadosParaForm = {
                historicoFamiliar: historicoFamiliarSafe,
                estiloVida: estiloVidaSafe,
                dadosDieteticos: dadosDieteticosSafe,

                consultaBase: {
                    ...data, // Pega o resto
                    // CORREÇÃO DO OBJETIVO (Null -> String Vazia)
                    objetivo_consulta: data.objetivo_consulta ?? "",
                    eliminacao_intestinal: data.eliminacao_intestinal ?? "",
                    frequencia_evacuatoria: data.frequencia_evacuatoria ?? "",
                    // Garante numéricos
                    peso_atual: data.peso_atual ?? 0,
                    peso_habitual: data.peso_habitual ?? 0,
                    estatura: data.estatura ?? 0,
                    imc_atual: data.imc_atual ?? 0,
                    // ... adicione outros campos numéricos aqui se necessário
                },

                classificacao: data.classificacoes,
                recordatorio: recordatorioObj,
                dados_bioquimicos: dadosBioquimicosFormatados,
                diagnostico: data.diagnostico,
            };

            console.log("Dados injetados no reset:", dadosParaForm); // Para debug
            form.reset(dadosParaForm);
        }

        carregarConsulta();
    }, [consultaId, form]);

    const firstStep = pularColetaInicial ? 4 : 1;
    const lastStep = 7;

    const totalStepsVisible = lastStep - firstStep + 1;

    const stepsToRender = Array.from({ length: totalStepsVisible }, (_, i) => firstStep + i);


    const { fields } = useFieldArray({
        control: form.control,
        name: "classificacao",
    });
    const router = useRouter()

    const onSubmit = async (values: any) => {
        console.log("chegou no botao");
        values.estiloVida.frequencia_exercicio_semana = Number(values.estiloVida.frequencia_exercicio_semana) || null;
        values.estiloVida.duracao_exercicio_minutos = Number(values.estiloVida.duracao_exercicio_minutos) || null;
        values.estiloVida.tempo_sono_horas = Number(values.estiloVida.tempo_sono_horas) || null;
        values.estiloVida.duracao_etilismo_anos = Number(values.estiloVida.duracao_etilismo_anos) || null;
        const recordatorioArray = Object.values(values.recordatorio);
        const payload = {
            ...values,
            recordatorio: recordatorioArray
        };
        console.log("chegou aqui")
        const result = await salvarConsulta(payload, pacienteId as string, consultaId as string)
        console.log("chegou aqui2")
        if (result.success) {
            toast.success(
                consultaId
                    ? "Consulta editada com sucesso!"
                    : "Consulta cadastrada com sucesso!"
            );
            router.push(`/paciente/${pacienteId}/consulta`);
        } else {
            toast.error("Falha ao cadastrar paciente.")
        }

    }

    const mockData = {
        historicoFamiliar: {
            historico_hipertensao: true,
            historico_diabetes: false,
            historico_dislipidemia: true,
            historico_cancer: false,
            historico_cardiacas: false,
            historico_tireoide: false,
            historico_excesso_peso: true,
            historico_outras_condicoes: "Avô com hipertensão",
            antecedentes_familiares: "Mãe com diabetes tipo 2"
        },
        estiloVida: {
            tipo_exercicio: "Caminhada",
            frequencia_exercicio_semana: "3",
            duracao_exercicio_minutos: "40",
            orientacao_dieta: "Reduzir açúcar",
            tabagista_status: "NAO_TABAGISTA",
            etilista: false,
            duracao_etilismo_anos: "",
            frequencia_etilismo: "",
            problema_denticao: false,
            tempo_sono_horas: "7",
            medicamentos: "Metformina",
            suplementos: "Whey Protein",
            restricao_sal: false,
            restricao_acucar: true,
            outras_restricoes: "",
            local_refeicoes: "Casa",
            quem_prepara_refeicoes: "Próprio paciente"
        },
        consultaBase: {
            objetivo_consulta: "Ganho de massa muscular e ficar forte!",
            eliminacao_intestinal: "Normal",
            frequencia_evacuatoria: "1x ao dia",
            peso_atual: 72,
            peso_habitual: 70,
            estatura: 1.75,
            imc_atual: 23.5,
            cb: 30,
            cc: 85,
            cq: 95,
            c_pescoco: 40,
            dct: 10,
            dcb: 8,
            dcse: 12,
            dcsi: 15,
            dcx: 20,
            dca: 18,
            ambc: 30,
            cmb: 28,
            somatorio_dobras: 83,
            id_nutricionista: 1,
            id_paciente: Number(pacienteId),
            percentual_gc: 18
        },
        recordatorio: recordatorioDefault, // Você já tem isso pronto
        dadosDieteticos: {
            aversao_alimentos: "Ovos",
            preferencia_alimentos: "Frutas",
            alergia_alimentos: ""
        },
        dados_bioquimicos: [
            {
                nome_exame: "Glicemia",
                valor: 92,
                unidade: UnidadeMedidaEnum.enum["mg/dL"],
                data_exame: new Date().toISOString().split("T")[0]
            },
            {
                nome_exame: "Melanina",
                valor: 92,
                unidade: UnidadeMedidaEnum.enum["mg/dL"],
                data_exame: new Date().toISOString().split("T")[0]
            }
        ],
        diagnostico: {
            diagnostico_nutricional: "Eutrofia",
            diagnostico_dietoterapia: "Manter dieta equilibrada",
            conduta_nutricional: "Aumentar fibras e manter hidratação"
        },
        classificacao: classificacoesDefaultArray.map(c => ({
            ...c,
            valor_classificacao: "Dentro da normalidade"
        }))
    };




    console.log("ERROS DE VALIDAÇÃO:", form.formState.errors);
    return (

        <div className="w-full h-full space-y-4">
            <SetBreadcrumbs items={[
                { label: 'Home', href: '/home' },
                { label: 'Paciente', href: '/paciente' },
                { label: 'Listar Consultas', href: `/paciente/${pacienteId}/consulta` },
                { label: consultaId ? "Editar Consulta" : "Nova Consulta" }
                ,
            ]} />

            {/* Barra de Progresso */}
            <div className="flex items-center justify-between mb-6">
                {stepsToRender.map((realStep, index) => {
                    const displayStep = index + 1; // <-- este número é o que aparece na tela
                    const isCompleted = realStep <= step;

                    return (
                        <div key={realStep} className="flex-1 flex flex-col items-center">
                            <div
                                className={`flex items-center justify-center w-8 h-8 rounded-full text-white font-semibold
            ${isCompleted ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"}`}
                            >
                                {displayStep}
                            </div>

                            {index < stepsToRender.length - 1 && (
                                <div
                                    className={`flex-1 h-1 w-full ${realStep < step ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"}`}
                                />
                            )}
                        </div>
                    );
                })}
            </div>





            <Card className="p-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {!pularColetaInicial && step === 1 && (
                            <>
                                <h2 className="text-xl font-semibold mb-4">Histórico Familiar</h2>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                                    <FormField
                                        control={form.control} name="historicoFamiliar.historico_hipertensao" render={({ field }) => (
                                            <FormItem className="flex items-center space-x-2">
                                                <FormControl>
                                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                                <FormLabel>Hipertensão</FormLabel>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control} name="historicoFamiliar.historico_diabetes" render={({ field }) => (
                                            <FormItem className="flex items-center space-x-2">
                                                <FormControl>
                                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                                <FormLabel>Diabetes</FormLabel>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control} name="historicoFamiliar.historico_dislipidemia" render={({ field }) => (
                                            <FormItem className="flex items-center space-x-2">
                                                <FormControl>
                                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                                <FormLabel>Dislipidemia</FormLabel>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control} name="historicoFamiliar.historico_cancer" render={({ field }) => (
                                            <FormItem className="flex items-center space-x-2">
                                                <FormControl>
                                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                                <FormLabel>Câncer</FormLabel>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control} name="historicoFamiliar.historico_cardiacas" render={({ field }) => (
                                            <FormItem className="flex items-center space-x-2">
                                                <FormControl>
                                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                                <FormLabel>Cardíaca</FormLabel>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control} name="historicoFamiliar.historico_tireoide" render={({ field }) => (
                                            <FormItem className="flex items-center space-x-2">
                                                <FormControl>
                                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                                <FormLabel>Tireoide</FormLabel>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control} name="historicoFamiliar.historico_excesso_peso" render={({ field }) => (
                                            <FormItem className="flex items-center space-x-2">
                                                <FormControl>
                                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                                <FormLabel>Obesidade</FormLabel>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField control={form.control} name="historicoFamiliar.historico_outras_condicoes" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Outras Condições</FormLabel>
                                            <FormControl><Input placeholder="Ex: Asma, alergias..." {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <FormField control={form.control} name="historicoFamiliar.antecedentes_familiares" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Antecedentes Familiares</FormLabel>
                                            <FormControl><Input placeholder="Ex: Histórico de infarto, AVC..." {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </div>
                            </>
                        )}

                        {!pularColetaInicial && step === 2 && (
                            <>
                                <h2 className="text-xl font-semibold mb-4">Estilo de Vida</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField control={form.control} name="estiloVida.tipo_exercicio" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tipo de Exercício</FormLabel>
                                            <FormControl><Input placeholder="Ex: Caminhada leve" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <FormField control={form.control} name="estiloVida.frequencia_exercicio_semana" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Frequência (vezes por semana)</FormLabel>
                                            <FormControl><Input
                                                {...field}
                                                type="text"
                                                onChange={(e) => {
                                                    const value = e.target.value
                                                    if (/^\d*$/.test(value)) {
                                                        field.onChange(value)
                                                    }
                                                }}
                                            /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <FormField control={form.control} name="estiloVida.duracao_exercicio_minutos" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Duração (minutos)</FormLabel>
                                            <FormControl><Input
                                                {...field}
                                                type="text"
                                                onChange={(e) => {
                                                    const value = e.target.value
                                                    if (/^\d*$/.test(value)) {
                                                        field.onChange(value)
                                                    }
                                                }}
                                            /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="estiloVida.tempo_sono_horas" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tempo de Sono (horas)</FormLabel>
                                            <FormControl><Input
                                                {...field}
                                                type="text"
                                                onChange={(e) => {
                                                    const value = e.target.value
                                                    if (/^\d*$/.test(value)) {
                                                        field.onChange(value)
                                                    }
                                                }}
                                            /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />


                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField control={form.control} name="estiloVida.orientacao_dieta" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Orientação Dieta</FormLabel>
                                            <FormControl><Input placeholder="Ex: Dieta balanceada" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <FormField control={form.control} name="estiloVida.suplementos" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Suplementos</FormLabel>
                                            <FormControl><Input {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />





                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{
                                    marginBottom: "2px",
                                }}>
                                    <FormField control={form.control} name="estiloVida.quem_prepara_refeicoes" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Quem Prepara as Refeições</FormLabel>
                                            <FormControl><Input {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <FormField control={form.control} name="estiloVida.local_refeicoes" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Local das Refeições</FormLabel>
                                            <FormControl><Input {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />






                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                                    <FormField control={form.control} name="estiloVida.restricao_sal" render={({ field }) => (
                                        <FormItem className="flex items-center gap-2 mt-6">
                                            <FormControl>
                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                            <FormLabel>Restrição de sal</FormLabel>
                                        </FormItem>
                                    )} />

                                    <FormField control={form.control} name="estiloVida.restricao_acucar" render={({ field }) => (
                                        <FormItem className="flex items-center gap-2 mt-6">
                                            <FormControl>
                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                            <FormLabel>Restrição de açúcar</FormLabel>
                                        </FormItem>
                                    )} />

                                    <FormField control={form.control} name="estiloVida.problema_denticao" render={({ field }) => (
                                        <FormItem className="flex items-center gap-2 mt-6">
                                            <FormControl>
                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                            <FormLabel>Problema de dentição</FormLabel>
                                        </FormItem>
                                    )} />

                                    <FormField control={form.control} name="estiloVida.etilista" render={({ field }) => (
                                        <FormItem className="flex items-center gap-2 mt-6">
                                            <FormControl>
                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                            <FormLabel>Étilista</FormLabel>
                                        </FormItem>
                                    )} />


                                </div>





                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                    <FormField control={form.control} name="estiloVida.duracao_etilismo_anos" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Duração do Etílismo (anos)</FormLabel>
                                            <FormControl><Input
                                                {...field}
                                                type="text"
                                                onChange={(e) => {
                                                    const value = e.target.value
                                                    if (/^\d*$/.test(value)) {
                                                        field.onChange(value)
                                                    }
                                                }}
                                            /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <FormField control={form.control} name="estiloVida.frequencia_etilismo" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Frequência do Consumo de Álcool</FormLabel>
                                            <FormControl><Input placeholder="Ex: Social, fins de semana" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="estiloVida.outras_restricoes" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Outras Restrições</FormLabel>
                                            <FormControl><Input {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />


                                    <FormField control={form.control} name="estiloVida.medicamentos" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Medicamentos</FormLabel>
                                            <FormControl><Input {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <FormField control={form.control} name="estiloVida.tabagista_status" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tabagista</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione o status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="NAO_TABAGISTA">Não tabagista</SelectItem>
                                                    <SelectItem value="TABAGISTA">Tabagista</SelectItem>
                                                    <SelectItem value="EX_TABAGISTA">Ex-tabagista</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </div>
                            </>
                        )}




                        {!pularColetaInicial && step === 3 && (
                            <>
                                <h2 className="text-xl font-semibold mb-4">Dados Dietéticos  </h2>
                                <FormField
                                    control={form.control}
                                    name="dadosDieteticos.aversao_alimentos"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Aversão a Alimentos</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ex: Frutas cítricas, peixes..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="dadosDieteticos.preferencia_alimentos"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Preferência por Alimentos</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ex: Massas, carnes brancas..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="dadosDieteticos.alergia_alimentos"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Alergias Alimentares</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ex: Amendoim, lactose..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                            </>
                        )}

                        {step === 4 && (
                            <>
                                <section>
                                    <h2 className="text-xl font-semibold mb-4">Recordatório</h2>
                                    <p className="text-sm text-muted-foreground">
                                        Informe os alimentos consumidos em cada refeição do dia, o horário e a frequência de consumo.
                                    </p>

                                    {(Object.keys(recordatorioSchema.shape) as Array<keyof typeof recordatorioSchema.shape>).map(key => (
                                        <div style={{ marginBottom: "12px" }}
                                            key={key}
                                            className="border rounded-xl p-4 shadow-sm space-y-4"
                                        >
                                            <h3 className="font-semibold text-base capitalize border-b pb-2">
                                                {key}
                                            </h3>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" >
                                                {/* Dia da Semana */}
                                                <FormField
                                                    control={form.control}
                                                    name={`recordatorio.${key}.dia_semana`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Dia da Semana</FormLabel>
                                                            <FormControl>
                                                                <Select value={field.value} onValueChange={field.onChange}>
                                                                    <SelectTrigger className="w-full">
                                                                        <SelectValue placeholder="Selecione..." />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {[
                                                                            "Domingo",
                                                                            "Segunda-feira",
                                                                            "Terça-feira",
                                                                            "Quarta-feira",
                                                                            "Quinta-feira",
                                                                            "Sexta-feira",
                                                                            "Sábado",
                                                                        ].map((dia) => (
                                                                            <SelectItem key={dia} value={dia}>
                                                                                {dia}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                {/* Horário */}
                                                <FormField
                                                    control={form.control}
                                                    name={`recordatorio.${key}.horario_refeicao`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Horário</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="Ex: 07:30" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                {/* Frequência */}
                                                <FormField
                                                    control={form.control}
                                                    name={`recordatorio.${key}.frequencia`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Frequência</FormLabel>
                                                            <FormControl>
                                                                <Select value={field.value} onValueChange={field.onChange}>
                                                                    <SelectTrigger className="w-full">
                                                                        <SelectValue placeholder="Selecione..." />
                                                                    </SelectTrigger>

                                                                    <SelectContent>
                                                                        <SelectItem value="Diário">Diário</SelectItem>
                                                                        <SelectItem value="Semanal">Semanal</SelectItem>
                                                                        <SelectItem value="Quinzenal">Quinzenal</SelectItem>
                                                                        <SelectItem value="Mensal">Mensal</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            {/* Alimentos e observações */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name={`recordatorio.${key}.alimentos_consumidos`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Alimentos Consumidos</FormLabel>
                                                            <FormControl>
                                                                <Textarea
                                                                    placeholder="Descreva os alimentos e porções consumidas..."
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name={`recordatorio.${key}.observacao`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Observações</FormLabel>
                                                            <FormControl>
                                                                <Textarea
                                                                    placeholder="Ex: refeição fora de casa, pulou refeição..."
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            {/* Grupos alimentares (multi-select ou checkboxes) */}
                                            <FormLabel>Grupos Alimentares</FormLabel>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                {[
                                                    "Carnes, Frango, Ovos e Peixes",
                                                    "Leite e Derivados",
                                                    "Frutas",
                                                    "Hortaliças e Vegetais",
                                                    "Cereais e Grãos",
                                                    "Doces e Industrializados",
                                                    "Óleos e Gorduras",
                                                ].map((grupo, i) => (
                                                    <FormField
                                                        key={i}
                                                        control={form.control}
                                                        name={`recordatorio.${key}.grupos_alimentares_ids`}
                                                        render={({ field }) => {
                                                            const checked = field.value.includes(i + 1);
                                                            return (
                                                                <FormItem className="flex items-center space-x-2">
                                                                    <FormControl>
                                                                        <Checkbox
                                                                            checked={checked}
                                                                            onCheckedChange={(checked) => {
                                                                                if (checked) field.onChange([...field.value, i + 1]);
                                                                                else
                                                                                    field.onChange(
                                                                                        field.value.filter((v: number) => v !== i + 1)
                                                                                    );
                                                                            }}
                                                                        />
                                                                    </FormControl>
                                                                    <FormLabel>{grupo}</FormLabel>
                                                                </FormItem>
                                                            );
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </section>

                            </>
                        )}

                        {step === 5 && (
                            <>
                                <h2 className="text-xl font-semibold mb-4">Avaliação Antropométrica</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                                    <FormField control={form.control} name="consultaBase.objetivo_consulta" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Objetivo da consulta</FormLabel>
                                            <FormControl><Input placeholder="Ex: Normal, constipada..." {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="consultaBase.eliminacao_intestinal" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Eliminação Intestinal</FormLabel>
                                            <FormControl><Input placeholder="Ex: Normal, constipada..." {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <FormField control={form.control} name="consultaBase.frequencia_evacuatoria" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Frequência Evacuatória</FormLabel>
                                            <FormControl><Input placeholder="Ex: 1x ao dia" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </div>


                                {/* Classificações */}
                                <div className="mt-8 border-t pt-6">
                                    <h3 className="text-lg font-semibold mb-4">Classificações Antropométricas</h3>

                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[150px]">Parâmetro</TableHead>
                                                <TableHead>Valor</TableHead>
                                                <TableHead>Classificação</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {/* Iteramos sobre 'fields' do useFieldArray */}
                                            {fields.map((field, index) => {

                                                // 'field.parametro' é a chave, ex: "peso_atual"
                                                // Precisamos garantir que o 'name' do FormField seja tipado corretamente
                                                const parametroKey = field.parametro as keyof typeof parametroNomes;

                                                return (
                                                    <TableRow key={field.id}>
                                                        {/* Coluna 1: Nome Amigável */}
                                                        <TableCell className="font-medium">
                                                            {parametroNomes[parametroKey] || parametroKey}
                                                        </TableCell>

                                                        {/* Coluna 2: Input para o Valor (ligado a 'consultaBase') */}
                                                        <TableCell>
                                                            <FormField
                                                                control={form.control}
                                                                // O 'name' aqui aponta para o objeto 'consultaBase'
                                                                name={`consultaBase.${parametroKey}`}
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormControl>
                                                                            <Input
                                                                                type="number"
                                                                                step="any"
                                                                                {...field}
                                                                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </TableCell>

                                                        {/* Coluna 3: Input para a Classificação (ligado a 'classificacoes') */}
                                                        <TableCell>
                                                            <FormField
                                                                control={form.control}
                                                                // O 'name' aqui aponta para o item do array 'classificacoes'
                                                                name={`classificacao.${index}.valor_classificacao`}
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormControl>
                                                                            <Input placeholder="Ex: Eutrófico, Adequado..." {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>





                            </>



                        )}


                        {step === 6 && (
                            <section>
                                <p className="text-xl font-semibold mb-4">
                                    Dados Bioquímicos
                                </p>

                                <div className="space-y-4">
                                    {form.watch("dados_bioquimicos").map((_, index) => (
                                        <div
                                            key={index}
                                            className="border rounded-xl p-4 shadow-sm space-y-3"
                                        >
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name={`dados_bioquimicos.${index}.nome_exame`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Nome do Exame</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="Ex: Hemoglobina, Glicose..." {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name={`dados_bioquimicos.${index}.valor`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Valor</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    step="any"
                                                                    placeholder="Ex: 13.5"
                                                                    {...field}
                                                                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name={`dados_bioquimicos.${index}.unidade`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Unidade de Medida</FormLabel>
                                                                <FormControl>
                                                                <Select value={field.value} onValueChange={field.onChange}>
                                                                        <SelectTrigger className="w-full">
                                                                            <SelectValue placeholder="Selecione..." />
                                                                        </SelectTrigger>

                                                                        <SelectContent>
                                                                            {Object.values(UnidadeMedidaEnum.enum).map((u) => (
                                                                            <SelectItem key={u} value={u}>
                                                                                {u}
                                                                            </SelectItem>
                                                                            ))}
                                                                        </SelectContent>
                                                                    </Select>
                                                                </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name={`dados_bioquimicos.${index}.data_exame`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Data do Exame</FormLabel>
                                                            <FormControl>
                                                                <Input type="date" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <div className="flex justify-end">
                                                <Button
                                                    variant="destructive"
                                                    type="button"
                                                    onClick={() => {
                                                        const list = form.getValues("dados_bioquimicos");
                                                        form.setValue("dados_bioquimicos", list.filter((_, i) => i !== index));
                                                    }}
                                                >
                                                    Remover
                                                </Button>
                                            </div>
                                        </div>
                                    ))}

                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => {
                                            const list = form.getValues("dados_bioquimicos");
                                            form.setValue("dados_bioquimicos", [
                                                ...list,
                                                {
                                                    nome_exame: "",
                                                    valor: 0,
                                                    unidade: "mg/dL",
                                                    data_exame: new Date().toISOString().split("T")[0],
                                                },
                                            ]);
                                        }}
                                    >
                                        + Adicionar Exame
                                    </Button>
                                </div>
                            </section>
                        )}



                        {step === 7 && (
                            <section>
                                <h2 className="text-xl font-semibold mb-4">Diagnóstico Final</h2>
                                <p className="text-sm text-muted-foreground">
                                    Descreva o diagnóstico, a dietoterapia proposta e as condutas nutricionais recomendadas.
                                </p>

                                <div className="space-y-4 mt-4">
                                    <FormField
                                        control={form.control}
                                        name="diagnostico.diagnostico_nutricional"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Diagnóstico Nutricional</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="Descreva o diagnóstico..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="diagnostico.diagnostico_dietoterapia"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Dietoterapia</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="Informe a dietoterapia aplicada..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="diagnostico.conduta_nutricional"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Conduta Nutricional</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="Descreva as condutas e recomendações..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </section>
                        )}








                        <div className="flex justify-between pt-6 border-t">

                            {/* BOTÃO VOLTAR */}
                            {step > firstStep ? (
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={() => setStep(step - 1)}
                                >
                                    <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
                                </Button>
                            ) : (
                                <div /> // só um placeholder para alinhar layout
                            )}

                            {/* BOTÃO AVANÇAR OU SALVAR */}
                            {step < lastStep ? (
                                <Button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setStep(step + 1);
                                    }}
                                >
                                    Avançar <ArrowRight className="h-4 w-4 ml-1" />
                                </Button>
                            ) : (
                                <Button type="submit" className="gap-2">
                                    <Save className="h-4 w-4" /> Salvar Consulta
                                </Button>
                            )}

                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => form.reset(mockData)}
                            >
                                Preencher automaticamente
                            </Button>

                        </div>

                    </form>
                </Form>
            </Card>
        </div >
    )
}
