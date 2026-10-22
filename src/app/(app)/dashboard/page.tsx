"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import StatusFornecedores from "@/components/layout/statusfor";
import StatusTarefas from "@/components/layout/statustask";
import { useUnits } from "@/features/units/hooks";
import { useDocuments } from "@/features/documents/hooks";
import { useTasks } from "@/features/tasks/hooks";
import { getDocumentStatus } from "@/lib/document-status";
import { differenceInCalendarDays, parseISO } from "date-fns";
import { 
  Download, 
  Plus,
  Building2,
  BadgeCheck,
  Clock,
  ListChecks,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

export default function DashboardPage() {
  
  {/* puxando do banco de dados falso */}
  const { data: units = [], isLoading: loadUnits, isError: errorUnits, refetch: refetchUnits } = useUnits();
  const { data: docs = [], isLoading: loadDocs, isError: errorDocs, refetch: refetchDocs } = useDocuments();
  const { data: tasks = [], isLoading: loadTasks, isError: errorTasks, refetch: refetchTasks } = useTasks();

  const temErro = errorUnits || errorDocs || errorTasks;
  const carregando = loadUnits || loadDocs || loadTasks;
  const tentarNovamente = () => {
    refetchUnits();
    refetchDocs();
    refetchTasks();
  };

  const fornecedores = units.length;
  const fornecedoresEmHomologacao = units.filter((u) => u.status === "em_homologacao").length;
  const fornecedoresAtivos = units.filter((u) => u.status === "ativa").length;
  const percentualAtivos = fornecedores > 0 ? ((fornecedoresAtivos / fornecedores) * 100).toFixed(1) : "0.0";
  
  const documentosAVencer = docs.filter( (d) => getDocumentStatus(d.expiresAt) === "proximo_vencimento").length;
  const documentosExpirado = docs.filter( (d) => getDocumentStatus(d.expiresAt) === "expirado").length;
  
  const diasPUrgente = 3;
  const tarefas = tasks.length;
  const tarefasPendentes = tasks.filter((t) => t.status === "pendente").length;
  const tarefasUrgentes = tasks.filter((t) => t.status === "pendente" && differenceInCalendarDays(parseISO(t.dueDate), 
  new Date()) <= diasPUrgente).length;

    const handleExportarRelatorio = () => {
    const linhas: string[] = [];
    linhas.push("Relatorio VendorHub");
    linhas.push(`Gerado em;${new Date().toLocaleString("pt-BR")}`);
    linhas.push("");
    linhas.push("Indicador;Valor");
    linhas.push(`Fornecedores;${fornecedores}`);
    linhas.push(`Fornecedores ativos;${fornecedoresAtivos}`);
    linhas.push(`Documentos a vencer;${documentosAVencer}`);
    linhas.push(`Tarefas pendentes;${tarefasPendentes}`);
    linhas.push("");
    linhas.push("Fornecedor;Cidade;Responsavel;Status");
    units.forEach((u) => {
      linhas.push(`${u.name};${u.city};${u.manager};${u.status}`);
    });

    const csv = linhas.join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `relatorio-vendorhub-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
    
  return (
    <div className="space-y-6">

      {/* primeira coluna */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold">
              Olá, Mariana
            </h1>

            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
              ● Atualizado hoje
            </span>
          </div>

          <p className="text-sm text-gray-600">
            Aqui está o resumo operacional dos seus fornecedores e obrigações pendentes.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">

          <Button variant="outline" className="w-full sm:w-[168px] h-10" onClick={handleExportarRelatorio}>
            <Download aria-hidden />
            Exportar Relatório
          </Button>

          <Button variant="default" className="w-full sm:w-[168px] h-10">
            <Plus aria-hidden />
            Novo Fornecedor
          </Button>

        </div>

            </div>

      {temErro ? (
        <div role="alert" className="flex flex-col items-start gap-3 rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
          <p className="font-semibold">Não foi possível carregar os dados do dashboard.</p>
          <Button onClick={tentarNovamente}>Tentar novamente</Button>
        </div>
      ) : carregando ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-[158px] rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="mt-4 h-9 w-16" />
                <Skeleton className="mt-6 h-4 w-32" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[0, 1].map((i) => (
              <div key={i} className="min-h-[358px] rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="mt-8 h-44 w-full" />
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
      {/* segunda coluna */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* cartão 1 */}
        <div className="w-full h-[158px] rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <p className="text-[11px] font-semibold tracking-wider text-gray-600">
              FORNECEDORES
            </p>
            
            <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-lg bg-[#E5EEFF] text-[#0037B0]">
              <Building2 size={21} />
            </div>
          </div>
          
          <h2 className="mt-0 text-3xl font-bold text-black">
            {fornecedores}
          </h2>
          
          <div className="mt-5 flex items-center gap-2 text-xs text-gray-600">
            <span className="flex items-center gap-1 rounded-full bg-[#E5EEFF] px-2 py-1 text-[#0037B0]">
              <TrendingUp size={12} />
              {fornecedoresEmHomologacao}
            </span>
            cadastrados recentemente
          </div>

        </div>

        {/*cartão 2*/}
        <div className="w-full h-[158px] rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <p className="text-[11px] font-semibold tracking-wider text-gray-600">
              FORNECEDORES ATIVOS
            </p>
            
            <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-lg bg-[#E5EEFF] text-[#0037B0]">
              <BadgeCheck size={21} />
            </div>
          </div>
          
          <h2 className="mt-0 text-3xl font-bold text-black">
            {fornecedoresAtivos}
          </h2>
          
          <div className="mt-5 flex items-center gap-2 text-xs text-gray-600">
            <span className="flex items-center gap-1 rounded-full px-2 py-1 text-[#0037B0]">
              ● 
            </span>
            {percentualAtivos}% da base homologada
          </div>

        </div>

        {/*cartão 3*/}
        <div className="w-full h-[158px] rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <p className="text-[11px] font-semibold tracking-wider text-gray-600">
              DOCUMENTOS A VENCER
            </p>
            
            <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-lg bg-[#E5EEFF] text-[#0037B0]">
              <Clock size={21} />
            </div>
          </div>
          
          <h2 className="mt-0 text-3xl font-bold text-black">
            {documentosAVencer}
          </h2>
          
          <div className="mt-5 flex items-center gap-2 text-xs text-gray-600">
            <span className="flex items-center gap-1 rounded-full bg-[#E5EEFF] px-2 py-1 text-[#0037B0]">
              <AlertTriangle size={12} />
              {documentosExpirado} novos
            </span>
            desde a última semana
          </div>

        </div>

        {/*cartão 4*/}
        <div className="w-full h-[158px] rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <p className="text-[11px] font-semibold tracking-wider text-gray-600">
              TAREFAS PENDENTES
            </p>
            
            <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-lg bg-[#E5EEFF] text-[#0037B0]">
              <ListChecks size={21} />
            </div>
          </div>
          
          <h2 className="mt-0 text-3xl font-bold text-black">
            {tarefasPendentes}
          </h2>
          
          <div className="mt-5 flex items-center gap-2 text-xs text-gray-600">
            <span className="flex items-center gap-1 rounded-full bg-[#FFDAD6] px-2 py-1 text-[#93000A]">
              <AlertTriangle size={12} />
              {tarefasUrgentes} urgentes
            </span>
            com prazo para entrega
          </div>

        </div>
        
      </div>

      {/*terceira coluna*/}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* cartão 1 */}
        <div className="w-full h-auto sm:min-h-[358px] rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-[21px] font-bold">
                Status dos fornecedores
              </p>

              <span className="ml-auto rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                ● Total: {fornecedores}
              </span>

            </div>
            <p className="text-sm text-gray-600">
              Distribuição do ciclo de conformidade da base
            </p>
            
            <StatusFornecedores />
            
            
            <div className="mt-18 flex items-center justify-between gap-3">

              <p className="text-sm text-gray-600">
                Homologação media: 4.2 dias
              </p>

            <Link href="/unidades" className="text-sm font-medium text-blue-700 hover:underline">
                    Ver detalhes -&gt;
             </Link>

            </div>

          </div>
        </div>
        
        {/* cartão 2 */}
        <div className="w-full h-auto sm:min-h-[358px] rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-[21px] font-bold">
                Status das tarefas
              </p>

              <span className="ml-auto rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                ● Total: {tarefas} tarefas
              </span>

            </div>
            <p className="text-sm text-gray-600">
              Visão consolidada de pendências da equipe
            </p>
            
            <StatusTarefas />
            
            <div className="mt-7 flex items-center justify-between gap-3">

              <p className="text-sm text-gray-600">
                Tempo médio de atendimento:1.8 dias
               </p>

              <Link href="/tarefas" className="text-sm font-medium text-blue-700 hover:underline">
                    Gerenciar tarefas -&gt;
             </Link>

            </div>

          </div>
        </div>
            </div>
        </>
      )}

    </div>
  );
}
