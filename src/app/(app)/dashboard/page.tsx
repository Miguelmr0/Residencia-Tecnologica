"use client";

import Link from "next/link";
import { Badge, type BadgeVariant } from "@/components/ui/badge";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import StatusFornecedores from "@/components/layout/statusfor";
import StatusTarefas from "@/components/layout/statustask";
import { useUnits } from "@/features/units/hooks";
import { useDocuments } from "@/features/documents/hooks";
import { useTasks } from "@/features/tasks/hooks";
import { EXPIRING_THRESHOLD_DAYS, getDocumentStatus, type FiltroDoc } from "@/lib/document-status";
import { differenceInCalendarDays, parseISO, format } from "date-fns";
import { 
  Download, 
  Plus,
  Building2,
  BadgeCheck,
  Clock,
  Eye,
  CalendarDays,
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
  const docAlertas = documentosAVencer + documentosExpirado;

  {/* usado na quarta coluna cartão 1 */}
  const [filtroDoc, setFiltroDoc] = useState<FiltroDoc>("todos");
  const nomeFornecedor = (unitId: string) => units.find((u) => u.id === unitId)?.name;

  const docsFiltrados = docs.filter((d) => {
      const status = getDocumentStatus(d.expiresAt);
      if (filtroDoc === "expirados") return status === "expirado";
      if (filtroDoc === "proximos") return status === "proximo_vencimento";
      return status === "expirado" || status === "proximo_vencimento";
    }).sort((a, b) => a.expiresAt.localeCompare(b.expiresAt)); //ordenação das datas
  
  const LIMITE_DOCS = 5;
  const docsVisiveis = docsFiltrados.slice(0, LIMITE_DOCS);

  const abasDocs: { id: FiltroDoc; nome: string; qtd: number }[] = [
    { id: "todos", nome: "Todos", qtd: docAlertas },
    { id: "expirados", nome: "Expirados", qtd: documentosExpirado },
    { id: "proximos", nome: "Próximos", qtd: documentosAVencer },
  ];
  
  const statusDoc: Record<"expirado" | "proximo", { variant: BadgeVariant; texto: string }> = {
    expirado: { variant: "danger", texto: "Expirado" },
    proximo: { variant: "warning", texto: "Próximo do vencimento" },
  };

  {/*------------------------------------------------------------*/}
  
  const diasPUrgente = 3;
  const tarefas = tasks.length;
  const tarefasPendentes = tasks.filter((t) => t.status === "pendente").length;
  const tarefasUrgentes = tasks.filter((t) => t.status === "pendente" && differenceInCalendarDays(parseISO(t.dueDate), 
  new Date()) <= diasPUrgente).length;

  {/* usado na quarta coluna cartão 2 */}
  const tarefasEmAndamento = tasks.filter((t) => t.status === "em_andamento").length;
  const tarefasAbertas = tarefasPendentes + tarefasEmAndamento;

  const tarefasFiltradas = tasks.filter((t) => t.status === "pendente" || t.status === "em_andamento")
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate)); //ordenação das datas

  const LIMITE_TAREFAS = 3;
  const tarefasVisiveis = tarefasFiltradas.slice(0, LIMITE_TAREFAS);

  const prioridadeTarefa = (dueDate: string): { variant: BadgeVariant; texto: string } => {
    const dias = differenceInCalendarDays(parseISO(dueDate), new Date());
    if (dias <= diasPUrgente) return { variant: "danger", texto: "ALTA" };
    if (dias <= EXPIRING_THRESHOLD_DAYS) return { variant: "info", texto: "MÉDIA" };
    return { variant: "neutral", texto: "NORMAL" };
  };


  {/*------------------------------------------------------------*/}
  


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

            <Badge variant="info">● Atualizado hoje</Badge>
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
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex w-full flex-col md:col-span-2 h-[460px] sm:min-h-[358px] rounded-lg border border-[#F3F4F6] bg-[#FFFFFF] p-5 shadow-sm">
              <Skeleton className="h-6 w-64" />
              <Skeleton className="mt-3 h-4 w-80" />
              <Skeleton className="mt-8 h-64 w-full" />
            </div>

            <div className="w-full  h-[460px] sm:min-h-[358px] rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
              <Skeleton className="h-6 w-64" />
              <Skeleton className="mt-3 h-4 w-80" />
              <Skeleton className="mt-4 h-75 w-full" />
              <Skeleton className="mt-3 h-10 w-full" />
            </div>
            
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
            <Badge variant="brand" className="gap-1">
              <TrendingUp size={12} />
              {fornecedoresEmHomologacao}
            </Badge>
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
            <Badge variant="brand" className="gap-1 whitespace-nowrap">
              <AlertTriangle size={12} />
              {documentosExpirado} Expirados
            </Badge>
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
            <Badge variant="danger" className="gap-1 whitespace-nowrap">
              <AlertTriangle size={12} />
              {tarefasUrgentes} urgentes
            </Badge>
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

              <Badge variant="info" className="ml-auto">
                ● Total: {fornecedores}
              </Badge>

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

              <Badge variant="info" className="ml-auto">
                ● Total: {tarefas} tarefas
              </Badge>

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
        
         {/*quarta coluna*/}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        
        {/* Cartão 1 */}
        <div className="flex w-full flex-col md:col-span-2 h-[460px] sm:min-h-[358px] rounded-lg border border-[#F3F4F6] bg-[#FFFFFF] p-5 shadow-sm">

          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold">
                  Documentos que exigem atenção
                </h1>

                <Badge variant="danger">
                  {docAlertas} alertas
                </Badge>
              </div>

              <p className="mt-1 text-sm text-[#4A5565]">
                Certidões e licenças vencidas ou expirando nos próximos 30 dias
              </p>
            </div>

            <div className="inline-flex shrink-0 rounded-lg bg-[#EFF4FF] p-1">
              {abasDocs.map((aba) => {
                const ativa = filtroDoc === aba.id;

                return (
                  <Button
                    key={aba.id}
                    type="button"
                    variant="ghost"
                    onClick={() => setFiltroDoc(aba.id)}
                    aria-pressed={ativa}
                    className={`h-auto rounded-md px-3 py-1.5 text-center text-xs font-semibold shadow-none transition-colors ${
                      ativa ? "bg-[#FFFFFF] text-[#0037B0] shadow-sm hover:bg-[#FFFFFF]" : "bg-transparent text-[#4A5565] hover:bg-[#FFFFFF]/60 hover:text-[#101828]"
                    }`}
                  >
                    <span className="flex flex-col items-center gap-0">
                      <span>{aba.nome}</span>
                      <span>({aba.qtd})</span>
                    </span>
                  </Button>
                );
              })}
            </div>

          </div>

          <div className="mt-5 w-full overflow-x-auto rounded-lg">
            <table className="w-full min-w-[650px] border-collapse text-left">
              <thead className="bg-[#EFF4FF]">
                <tr>
                  <th className="px-4 py-3 text-[11px] font-semibold text-[#4A5565]">
                    DOCUMENTO
                  </th>
                  <th className="px-4 py-3 text-[11px] font-semibold text-[#4A5565]">
                    FORNECEDOR
                  </th>
                  <th className="px-4 py-3 text-[11px] font-semibold text-[#4A5565]">
                    VENCIMENTO
                  </th>
                  <th className="px-4 py-3 text-[11px] font-semibold text-[#4A5565]">
                    STATUS
                  </th>
                  <th className="px-4 py-3 text-[11px] font-semibold text-[#4A5565]">
                    AÇÕES
                  </th>
                </tr>
              </thead>

              <tbody>
                {docsVisiveis.map((d) => {
                  const expirado = getDocumentStatus(d.expiresAt) === "expirado";
                  const status = statusDoc[expirado ? "expirado" : "proximo"];

                  return (
                    <tr key={d.id} className="border-b border-[#F3F4F6] last:border-0 overflow-y-auto">

                      {/* Documento */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-[#000000]">
                            {d.title}
                          </span>
                        </div>
                      </td>
                      
                      {/* Fornecedor */}
                      <td className="px-4 py-3 text-sm text-[#434655]">
                        {nomeFornecedor(d.unitId)}
                      </td>

                      {/* Data */}
                      <td
                        className={`px-4 py-3 text-sm font-medium ${
                          expirado ? "text-[#BA1A1A]" : "text-slate-900"
                        }`}
                      >
                        {format(parseISO(d.expiresAt), "dd/MM/yyyy")}
                      </td>
                        
                        {/* Status */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Badge variant={status.variant} className="gap-1.5">
                          ● {status.texto}
                        </Badge>
                      </td>

                          {/* botão ver doc */}
                      <td className="px-4 py-3">
                        <Button variant="outline" size="sm" className="gap-1.5">
                          Ver
                          <Eye size={14} aria-hidden />
                        </Button>
                      </td>

                    </tr>
                  );
                })}
                
                {docsVisiveis.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-sm text-gray-600">
                      Nenhum documento nesta categoria.
                    </td>
                  </tr>
                )}

              </tbody>
            </table>
          </div>

          <div className="mt-auto flex items-center justify-between gap-3">

              <p className="text-sm text-[#4A5565]">
                Exibindo {Math.min(docAlertas, 5)} de {docAlertas} documentos
              </p>

              <Link href="/documentos" className="text-sm font-medium text-blue-700 hover:underline">
                Ver todos os {docAlertas} documentos -&gt;
              </Link>

          </div>

        </div>
        
        {/* Cartão 2 */}
        <div className="flex w-full flex-col h-[460px] sm:min-h-[358px] rounded-lg border border-gray-100 bg-white p-5 shadow-sm">

          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 flex-col gap-1">
              <p className="text-[21px] font-bold">
                Tarefas pendentes
              </p>

              <span className="text-sm text-gray-600">
                Ações de regularização atribuídas a você
              </span>
            </div>
            
            <Link href="/tarefas" className="text-sm font-medium text-blue-700 hover:underline">
              + Nova tarefa -&gt;
            </Link>

          </div>
          
          <ul className="mt-4 flex flex-col gap-3 overflow-y-auto">
            {tarefasVisiveis.map((t) => {
              const prioridade = prioridadeTarefa(t.dueDate);

              return (
                <li key={t.id} className="flex items-start gap-3 rounded-lg border border-gray-100 p-3">

                  <input type="checkbox" className="mt-1 h-4 w-4 shrink-0 rounded border-gray-300" />

                  <div className="min-w-0 flex-1">

                    {/* título + prioridade */}
                    <div className="flex items-start justify-between gap-2">
                      <p className="truncate text-sm font-semibold text-black">
                        {t.title}
                      </p>
                      <Badge variant={prioridade.variant} className="shrink-0">
                        {prioridade.texto}
                      </Badge>
                    </div>

                    {/* fornecedor */}
                    <p className="truncate text-sm text-gray-600">
                      {nomeFornecedor(t.unitId)}
                    </p>

                    {/* data / status */}
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-600">
                      <CalendarDays size={12} aria-hidden />
                      {format(parseISO(t.dueDate), "dd/MM/yyyy")}
                      <span className={t.status === "em_andamento" ? "font-medium text-blue-700" : "font-medium"}>
                        • {t.status === "em_andamento" ? "Em andamento" : "Pendente"}
                      </span>
                    </div>

                  </div>

                </li>
                )}
              )}

              {tarefasVisiveis.length === 0 && (
                <li className="py-6 text-center text-sm text-gray-600">
                  Nenhuma tarefa pendente.
                </li>
            )}
  
          </ul>
                
            <Link href="/tarefas" 
              className="mt-auto flex h-10 items-center justify-center gap-2 rounded-lg bg-[#E5EEFF] text-sm font-semibold text-[#0037B0] hover:bg-[#DCE7FF]">
              Ver todas as {tarefasAbertas} tarefas -&gt;
            </Link>

        </div>

      </div>
      </>
      )}

    </div>
  );
}
