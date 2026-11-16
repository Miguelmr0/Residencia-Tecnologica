import Link from "next/link";
import { differenceInCalendarDays, format, parseISO } from "date-fns";
import { CalendarDays } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge, type BadgeVariant } from "@/components/ui/badge";
import { EXPIRING_THRESHOLD_DAYS } from "@/lib/document-status";
import type { Task, Unit } from "@/types";
import { diasPUrgente } from "./coluna-indicadores";

const LIMITE_TAREFAS = 3;

// skeleton
export function EsqueletoTarefas() {
  return (
    <div className="w-full  h-[460px] sm:min-h-[358px] rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
      <Skeleton className="h-6 w-64" />
      <Skeleton className="mt-3 h-4 w-80" />
      <Skeleton className="mt-4 h-75 w-full" />
      <Skeleton className="mt-3 h-10 w-full" />
    </div>
  );
}

// quarta coluna, cartão 2: tarefas pendentes
export function CartaoTarefas({ tasks, units }: { tasks: Task[]; units: Unit[] }) {
  const nomeFornecedor = (unitId: string) => units.find((u) => u.id === unitId)?.name;

  const tarefasPendentes = tasks.filter((t) => t.status === "pendente").length;
  const tarefasEmAndamento = tasks.filter((t) => t.status === "em_andamento").length;
  const tarefasAbertas = tarefasPendentes + tarefasEmAndamento;
  const tarefasFiltradas = tasks.filter((t) => t.status === "pendente" || t.status === "em_andamento")
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate)); //ordenação das datas

  const tarefasVisiveis = tarefasFiltradas.slice(0, LIMITE_TAREFAS);
  const prioridadeTarefa = (dueDate: string): { variant: BadgeVariant; texto: string } => {
    const dias = differenceInCalendarDays(parseISO(dueDate), new Date());
    if (dias <= diasPUrgente) return { variant: "danger", texto: "ALTA" };
    if (dias <= EXPIRING_THRESHOLD_DAYS) return { variant: "info", texto: "MÉDIA" };
    return { variant: "neutral", texto: "NORMAL" };
  };

  return (
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
          );
        })}

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
  );
}
