import { AlertCircle, CheckCircle2, ClipboardList, Clock, RefreshCw, TrendingUp } from "lucide-react";
import type { ReactNode } from "react";
import { Cards } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { COMPLETION_GOAL, type TaskStats } from "@/features/tasks/utils";
import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: number;
  unit: string; // texto ao lado do número, ex.: "tarefas ativas"
  icon: ReactNode;
  footer: ReactNode;
  tone: "brand" | "danger" | "success";
  loading: boolean;
};

const iconTone = {
  brand: "bg-brand-100 text-brand-700",
  danger: "bg-danger-50 text-danger-700",
  success: "bg-emerald-100 text-emerald-700",
} as const;

function StatCard({ label, value, unit, icon, footer, tone, loading }: StatCardProps) {
  return (
    <Cards>
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
        <span className={cn("rounded-lg p-2", iconTone[tone])}>{icon}</span>
      </div>
      {loading ? (
        <Skeleton className="mt-3 h-9 w-24" />
      ) : (
        <p className="mt-2 flex items-baseline gap-2">
          <span className="text-4xl font-bold text-ink">{value}</span>
          <span className="text-sm text-slate-500">{unit}</span>
        </p>
      )}
      <div className="mt-3 text-sm text-slate-500">{loading ? "Carregando..." : footer}</div>
    </Cards>
  );
}

export function TasksStats({ stats, loading }: { stats: TaskStats; loading: boolean }) {
  const goalReached = stats.taxaConclusao >= COMPLETION_GOAL;

  return (
    <section aria-label="Indicadores de tarefas" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Total de tarefas ativas"
        value={stats.ativas}
        unit="tarefas ativas"
        icon={<ClipboardList size={20} aria-hidden="true" />}
        footer={
          <span className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-brand-600" aria-hidden="true" /> Pendentes + em andamento
          </span>
        }
        tone="brand"
        loading={loading}
      />
      <StatCard
        label="Pendentes de início"
        value={stats.pendentes}
        unit="tarefas"
        icon={<Clock size={20} aria-hidden="true" />}
        footer={
          <span className="flex items-center gap-1 font-medium text-danger-700">
            <AlertCircle size={14} aria-hidden="true" /> {stats.pendentesAltaPrioridade} classificadas como Alta Prioridade
          </span>
        }
        tone="danger"
        loading={loading}
      />
      <StatCard
        label="Em andamento"
        value={stats.emAndamento}
        unit="em tratamento"
        icon={<RefreshCw size={20} aria-hidden="true" />}
        footer={`${stats.atrasadas} ${stats.atrasadas === 1 ? "tarefa atrasada" : "tarefas atrasadas"} no total`}
        tone="brand"
        loading={loading}
      />
      <StatCard
        label="Concluídas"
        value={stats.concluidas}
        unit="resolvidas"
        icon={<CheckCircle2 size={20} aria-hidden="true" />}
        footer={
          <span className={cn("flex items-center gap-1 font-medium", goalReached ? "text-emerald-700" : "text-danger-700")}>
            <TrendingUp size={14} aria-hidden="true" /> Taxa de conclusão: {stats.taxaConclusao.toLocaleString("pt-BR")}% (Meta{" "}
            {COMPLETION_GOAL}%)
          </span>
        }
        tone="success"
        loading={loading}
      />
    </section>
  );
}