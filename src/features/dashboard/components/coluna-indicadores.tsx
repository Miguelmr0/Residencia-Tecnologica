import type { ReactNode } from "react";
import { differenceInCalendarDays, parseISO } from "date-fns";
import { AlertTriangle, BadgeCheck, Building2, Clock, ListChecks, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getDocumentStatus } from "@/lib/document-status";
import type { Task, Unit, UnitDocument } from "@/types";

// Também usada na prioridade das tarefas (quarta coluna)
export const diasPUrgente = 3;

// Usada nos cartões e também no relatório exportado
export function calcularIndicadores(units: Unit[], docs: UnitDocument[], tasks: Task[]) {
  const fornecedores = units.length;
  const fornecedoresEmHomologacao = units.filter((u) => u.status === "em_homologacao").length;
  const fornecedoresAtivos = units.filter((u) => u.status === "ativa").length;
  const percentualAtivos = fornecedores > 0 ? ((fornecedoresAtivos / fornecedores) * 100).toFixed(1) : "0.0";

  const documentosAVencer = docs.filter((d) => getDocumentStatus(d.expiresAt) === "proximo_vencimento").length;
  const documentosExpirado = docs.filter((d) => getDocumentStatus(d.expiresAt) === "expirado").length;

  const tarefasPendentes = tasks.filter((t) => t.status === "pendente").length;
  const tarefasUrgentes = tasks.filter((t) => t.status === "pendente" && differenceInCalendarDays(parseISO(t.dueDate),
    new Date()) <= diasPUrgente).length;

  return {
    fornecedores, fornecedoresEmHomologacao, fornecedoresAtivos, percentualAtivos,
    documentosAVencer, documentosExpirado, tarefasPendentes, tarefasUrgentes,
  };
}

/* ---------- skeleton ---------- */

export function EsqueletoIndicadores() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="h-[158px] rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-4 h-9 w-16" />
          <Skeleton className="mt-6 h-4 w-32" />
        </div>
      ))}
    </div>
  );
}

type CartaoProps = {
  titulo: string;
  valor: number;
  icone: ReactNode;
  rodape: ReactNode;
};

function CartaoIndicador({ titulo, valor, icone, rodape }: CartaoProps) {
  return (
    <div className="w-full h-[158px] rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] font-semibold tracking-wider text-gray-600">
          {titulo}
        </p>

        <Badge variant="info" className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-lg">
          {icone}
        </Badge>
      </div>

      <h2 className="mt-0 text-3xl font-bold text-black">
        {valor}
      </h2>

      <div className="mt-5 flex items-center gap-2 text-xs text-gray-600">
        {rodape}
      </div>
    </div>
  );
}

/* ---------- segunda coluna: cartões de indicadores ---------- */

type Props = { units: Unit[]; docs: UnitDocument[]; tasks: Task[] };

export function ColunaIndicadores({ units, docs, tasks }: Props) {
  const {
    fornecedores,
    fornecedoresEmHomologacao,
    fornecedoresAtivos,
    percentualAtivos,
    documentosAVencer,
    documentosExpirado,
    tarefasPendentes,
    tarefasUrgentes,
  } = calcularIndicadores(units, docs, tasks);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

      {/* cartão 1 */}
      <CartaoIndicador
        titulo="FORNECEDORES"
        valor={fornecedores}
        icone={<Building2 size={21} />}
        rodape={
          <>
            <Badge variant="brand" className="gap-1">
              <TrendingUp size={12} />
              {fornecedoresEmHomologacao}
            </Badge>
            cadastrados recentemente
          </>
        }
      />

      {/* cartão 2 */}
      <CartaoIndicador
        titulo="FORNECEDORES ATIVOS"
        valor={fornecedoresAtivos}
        icone={<BadgeCheck size={21} />}
        rodape={
          <>
            <span className="flex items-center gap-1 rounded-full px-2 py-1 text-[#0037B0]">
              ●
            </span>
            {percentualAtivos}% da base homologada
          </>
        }
      />

      {/* cartão 3 */}
      <CartaoIndicador
        titulo="DOCUMENTOS A VENCER"
        valor={documentosAVencer}
        icone={<Clock size={21} />}
        rodape={
          <>
            <Badge variant="brand" className="gap-1 whitespace-nowrap">
              <AlertTriangle size={12} />
              {documentosExpirado} Expirados
            </Badge>
            desde a última semana
          </>
        }
      />

      {/* cartão 4 */}
      <CartaoIndicador
        titulo="TAREFAS PENDENTES"
        valor={tarefasPendentes}
        icone={<ListChecks size={21} />}
        rodape={
          <>
            <Badge variant="danger" className="gap-1 whitespace-nowrap">
              <AlertTriangle size={12} />
              {tarefasUrgentes} urgentes
            </Badge>
            com prazo para entrega
          </>
        }
      />
    </div>
  );
}
