"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { useUnits } from "@/features/units/hooks";
import { useDocuments } from "@/features/documents/hooks";
import { useTasks } from "@/features/tasks/hooks";
import { useContracts } from "@/features/contracts/hooks";
import { useHistoric } from "@/features/historic/hooks";
import { BotaoExportarRelatorio } from "@/features/dashboard/components/botao-exportar-relatorio";
import { CartaoAtividades } from "@/features/dashboard/components/cartao-atividades-recentes";
import { CartaoContratos } from "@/features/dashboard/components/cartao-contratos";
import { CartaoDocumentos } from "@/features/dashboard/components/cartao-documentos";
import { CartaoStatusFornecedores } from "@/features/dashboard/components/cartao-status-fornecedores";
import { CartaoStatusTarefas } from "@/features/dashboard/components/cartao-status-tarefas";
import { CartaoTarefas } from "@/features/dashboard/components/cartao-tarefas-pendentes";
import { ColunaIndicadores } from "@/features/dashboard/components/coluna-indicadores";
import { EstadoCarregando, EstadoErro } from "@/features/dashboard/components/estados-pagina";

export default function DashboardPage() {

  const { data: units = [], isLoading: loadUnits, isError: errorUnits, refetch: refetchUnits } = useUnits();
  const { data: docs = [], isLoading: loadDocs, isError: errorDocs, refetch: refetchDocs } = useDocuments();
  const { data: tasks = [], isLoading: loadTasks, isError: errorTasks, refetch: refetchTasks } = useTasks();
  const { data: contracts = [], isLoading: loadCon, isError: errorCon, refetch: refetchCon } = useContracts();
  const { data: historico = [], isLoading: loadHist, isError: errorHist, refetch: refetchHist } = useHistoric();

  const temErro = errorUnits || errorDocs || errorTasks || errorCon || errorHist;
  const carregando = loadUnits || loadDocs || loadTasks || loadCon || loadHist;
  const tentarNovamente = () => {
    refetchUnits();
    refetchDocs();
    refetchTasks();
    refetchCon();
    refetchHist();
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

          <BotaoExportarRelatorio units={units} docs={docs} tasks={tasks} />

          <Link href="/unidades" className={buttonVariants({ variant: "default", className: "w-full sm:w-[168px] h-10" })}>
            <Plus aria-hidden />
            Novo Fornecedor
          </Link>

        </div>

      </div>

      {temErro ? (
        <EstadoErro tentarNovamente={tentarNovamente} />
      ) : carregando ? (
        <EstadoCarregando />
      ) : (
        <>
          {/* segunda coluna */}
          <ColunaIndicadores units={units} docs={docs} tasks={tasks} />

          {/* terceira coluna */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CartaoStatusFornecedores units={units} />
            <CartaoStatusTarefas tasks={tasks} />
          </div>

          {/* quarta coluna */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <CartaoDocumentos docs={docs} units={units} />
            <CartaoTarefas tasks={tasks} units={units} />
          </div>

          {/* quinta coluna */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CartaoContratos contracts={contracts} />
            <CartaoAtividades historico={historico} />
          </div>
        </>
      )}
    </div>
  );
}
