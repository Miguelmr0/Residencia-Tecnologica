"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import StatusFornecedores from "@/components/layout/statusfor";
import StatusTarefas from "@/components/layout/statustask";
import { useUnits } from "@/features/units/hooks";
import { useDocuments } from "@/features/documents/hooks";
import { useTasks } from "@/features/tasks/hooks";
import { getDocumentStatus } from "@/lib/document-status";
import { differenceInCalendarDays, parseISO, format } from "date-fns";
import { 
  Download, 
  Plus,
  Building2,
  BadgeCheck,
  Eye,
  Clock,
  ListChecks,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

type FiltroDoc = "todos" | "expirados" | "proximos";

export default function DashboardPage() {

  const [filtroDoc, setFiltroDoc] = useState<FiltroDoc>("todos");
  
  {/* puxando do banco de dados falso */}
  const { data: units = [], isLoading: loadUnits, isError: errorUnits, refetch: refetchUnits } = useUnits();
  const { data: docs = [], isLoading: loadDocs, isError: errorDocs, refetch: refetchDocs } = useDocuments();
  const { data: tasks = [], isLoading: loadTasks, isError: errorTasks, refetch: refetchTasks } = useTasks();

  {/* se precisar no futuro*/}
  //const temErro = errorUnits || errorDocs || errorTasks;
  //const tentarNovamente = () => {
  //  if (errorUnits) refetchUnits();
  //  if (errorDocs) refetchDocs();
  //  if (errorTasks) refetchTasks();
  //};

  const fornecedores = units.length;
  const fornecedoresEmHomologacao = units.filter((u) => u.status === "em_homologacao").length;
  const fornecedoresAtivos = units.filter((u) => u.status === "ativa").length;
  const percentualAtivos = fornecedores > 0 ? ((fornecedoresAtivos / fornecedores) * 100).toFixed(1) : "0.0";
  
  const documentosAVencer = docs.filter( (d) => getDocumentStatus(d.expiresAt) === "proximo_vencimento").length;
  const documentosExpirado = docs.filter( (d) => getDocumentStatus(d.expiresAt) === "expirado").length;
  const docAlertas = documentosAVencer + documentosExpirado;
  
  {/* usado na quarta coluna cartão 1 */}
  const nomeFornecedor = (unitId: string) => units.find((u) => u.id === unitId)?.name;

  const docsFiltrados = docs.filter((d) => {
      const status = getDocumentStatus(d.expiresAt);
      if (filtroDoc === "expirados") return status === "expirado";
      if (filtroDoc === "proximos") return status === "proximo_vencimento";
      return status === "expirado" || status === "proximo_vencimento";
    }).sort((a, b) => a.expiresAt.localeCompare(b.expiresAt)); //ordenação cronologica
  
  const LIMITE_DOCS = 5;
  const docsVisiveis = docsFiltrados.slice(0, LIMITE_DOCS);

  const abasDocs: { id: FiltroDoc; nome: string; qtd: number }[] = [
    { id: "todos", nome: "Todos", qtd: docAlertas },
    { id: "expirados", nome: "Expirados", qtd: documentosExpirado },
    { id: "proximos", nome: "Próximos", qtd: documentosAVencer },
  ];
  {/*------------------------------------------------------------*/}

  const diasPUrgente = 3;
  const tarefas = tasks.length;
  const tarefasPendentes = tasks.filter((t) => t.status === "pendente").length;
  const tarefasUrgentes = tasks.filter((t) => t.status == "pendente" && differenceInCalendarDays(parseISO(t.dueDate), new Date()) <= diasPUrgente).length;

  return (
    <div className="space-y-6">

      {/* primeira coluna */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold">
              Olá, Mariana
            </h1>

            <span className="rounded-full bg-[#DBEAFE] px-3 py-1 text-sm text-[#1D4ED8]">
              ● Atualizado hoje
            </span>
          </div>

          <p className="text-sm text-[#4A5565]">
            Aqui está o resumo operacional dos seus fornecedores e obrigações pendentes.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          
          <Button variant="outline" className="w-full sm:w-[168px] h-[40px] bg-[#FFFFFF] text-[#000000] hover:bg-[#D5D5D5]">
            <Download aria-hidden />
            Exportar Relatório
          </Button>

          <Button className="w-full sm:w-[168px] h-[40px] bg-[#1D4ED8] text-[#FFFFFF] hover:bg-[#0E3BBA]">
            <Plus aria-hidden />
            Novo Fornecedor
          </Button>
          

        </div>

      </div>

      {/* segunda coluna */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* cartão 1 */}
        <div className="w-full h-[158px] rounded-lg border border-[#F3F4F6] bg-[#FFFFFF] p-5 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <p className="text-[11px] font-semibold tracking-wider text-[#4A5565]">
              FORNECEDORES
            </p>
            
            <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-lg bg-[#E5EEFF] text-[#0037B0]">
              <Building2 size={21} />
            </div>
          </div>
          
          <h2 className="mt-0 text-3xl font-bold text-[#000000]">
            {fornecedores}
          </h2>
          
          <div className="mt-5 flex items-center gap-2 text-xs text-[#4A5565]">
            <span className="flex items-center gap-1 rounded-full bg-[#E5EEFF] px-2 py-1 text-[#0037B0]">
              <TrendingUp size={12} />
              {fornecedoresEmHomologacao}
            </span>
            cadastrados recentemente
          </div>

        </div>

        {/*cartão 2*/}
        <div className="w-full h-[158px] rounded-lg border border-[#F3F4F6] bg-[#FFFFFF] p-5 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <p className="text-[11px] font-semibold tracking-wider text-[#4A5565]">
              FORNECEDORES ATIVOS
            </p>
            
            <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-lg bg-[#E5EEFF] text-[#0037B0]">
              <BadgeCheck size={21} />
            </div>
          </div>
          
          <h2 className="mt-0 text-3xl font-bold text-[#000000]">
            {fornecedoresAtivos}
          </h2>
          
          <div className="mt-5 flex items-center gap-2 text-xs text-[#4A5565]">
            <span className="flex items-center gap-1 rounded-full px-2 py-1 text-[#0037B0]">
              ● 
            </span>
            {percentualAtivos}% da base homologada
          </div>

        </div>

        {/*cartão 3*/}
        <div className="w-full h-[158px] rounded-lg border border-[#F3F4F6] bg-[#FFFFFF] p-5 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <p className="text-[11px] font-semibold tracking-wider text-[#4A5565]">
              DOCUMENTOS A VENCER
            </p>
            
            <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-lg bg-[#E5EEFF] text-[#0037B0]">
              <Clock size={21} />
            </div>
          </div>
          
          <h2 className="mt-0 text-3xl font-bold text-[#000000]">
            {documentosAVencer}
          </h2>
          
          <div className="mt-5 flex items-center gap-2 text-xs text-[#4A5565]">
            <span className="flex items-center gap-1 rounded-full bg-[#E5EEFF] px-2 py-1 text-[#0037B0]">
              <AlertTriangle size={12} />
              {documentosExpirado} novos
            </span>
            desde a última semana
          </div>

        </div>

        {/*cartão 4*/}
        <div className="w-full h-[158px] rounded-lg border border-[#F3F4F6] bg-[#FFFFFF] p-5 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <p className="text-[11px] font-semibold tracking-wider text-[#4A5565]">
              TAREFAS PENDENTES
            </p>
            
            <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-lg bg-[#E5EEFF] text-[#0037B0]">
              <ListChecks size={21} />
            </div>
          </div>
          
          <h2 className="mt-0 text-3xl font-bold text-[#000000]">
            {tarefasPendentes}
          </h2>
          
          <div className="mt-5 flex items-center gap-2 text-xs text-[#4A5565]">
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
        <div className="w-full h-auto sm:min-h-[358px] rounded-lg border border-[#F3F4F6] bg-[#FFFFFF] p-5 shadow-sm">
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-[21px] font-bold">
                Status dos fornecedores
              </p>

              <span className="ml-auto rounded-full bg-[#DBEAFE] px-3 py-1 text-sm text-[#1D4ED8]">
                ● Total: {fornecedores}
              </span>

            </div>
            <p className="text-sm text-[#4A5565]">
              Distribuição do ciclo de conformidade da base
            </p>
            
            <StatusFornecedores />
            
            
            <div className="mt-18 flex items-center justify-between gap-3">

              <p className="text-sm text-[#4A5565]">
                Homologação media: 4.2 dias
              </p>

              <Button variant="link" className="h-[40px] shrink-0 bg-transparent text-[#1D4ED8] hover:bg-transparent">
                Ver detalhes -&gt;
              </Button>

            </div>

          </div>
        </div>
        
        {/* cartão 2 */}
        <div className="w-full h-auto sm:min-h-[358px] rounded-lg border border-[#F3F4F6] bg-[#FFFFFF] p-5 shadow-sm">
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-[21px] font-bold">
                Status das tarefas
              </p>

              <span className="ml-auto rounded-full bg-[#DBEAFE] px-3 py-1 text-sm text-[#1D4ED8]">
                ● Total: {tarefas} tarefas
              </span>

            </div>
            <p className="text-sm text-[#4A5565]">
              Visão consolidada de pendências da equipe
            </p>
            
            <StatusTarefas />
            
            <div className="mt-7 flex items-center justify-between gap-3">

              <p className="text-sm text-[#4A5565]">
                Tempo médio de atendimento:1.8 dias
               </p>

              <Button variant="link" className="h-[40px] shrink-0 bg-transparent text-[#1D4ED8] hover:bg-transparent">
                Gerenciar tarefas -&gt;
              </Button>

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

                <span className="rounded-full bg-[#FFDAD6] px-2 py-1 text-sm text-[#93000A]">
                  {docAlertas} alertas
                </span>
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

                  return (
                    <tr key={d.id} className="border-b border-[#F3F4F6] last:border-0">

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
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                            expirado
                              ? "bg-[#FFDAD6] text-[#93000A]"
                              : "bg-[#DCE7FF] text-[#0037B0]"
                          }`}
                        >
                          <span/>
                          ● {expirado ? "Expirado" : "Próximo do vencimento"}
                        </span>
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

              <Button variant="link" className="h-[40px] shrink-0 bg-transparent text-[#1D4ED8] hover:bg-transparent">
                Ver todos os {docAlertas} documentos -&gt;
              </Button>

          </div>

        </div>

      </div>

    </div>
  );
}