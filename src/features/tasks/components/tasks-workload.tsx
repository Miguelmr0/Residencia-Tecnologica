import { Users } from "lucide-react";
import { Cards } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { WorkloadRow } from "@/features/tasks/utils";
import { cn } from "@/lib/utils";
import { TaskAvatar } from "./task-cells";

type TasksWorkloadProps = {
  rows: WorkloadRow[]; // carga de cada analista (calculada da lista)
  sla: number; // % das tarefas ativas dentro do prazo
  loading: boolean;
};

// Cor da barra: os dois mais carregados em azul, os demais em cinza.
const barColors = ["bg-brand-600", "bg-brand-500", "bg-slate-600", "bg-slate-400"];

export function TasksWorkload({ rows, sla, loading }: TasksWorkloadProps) {
  const max = Math.max(1, ...rows.map((r) => r.ativas)); // evita dividir por zero

  // Anel do SLA: desenhado com um círculo SVG; strokeDashoffset "apaga" o que falta.
  const radius = 26;
  const circumference = 2 * Math.PI * radius;

  return (
    <Cards className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold text-ink">Carga de Trabalho</h2>
          <p className="text-xs text-slate-500">Distribuição de pendências por analista</p>
        </div>
        <Users size={18} className="text-slate-400" aria-hidden="true" />
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      ) : (
        <ul className="space-y-4">
          {rows.map((row, index) => (
            <li key={row.name} className="space-y-1.5">
              <div className="flex items-center justify-between gap-2 text-sm">
                <span className="flex items-center gap-2 font-medium text-ink">
                  <TaskAvatar name={row.name} /> {row.name}
                </span>
                <span className="text-xs text-slate-500">
                  {row.ativas} ativas / {row.criticas} {row.criticas === 1 ? "crítica" : "críticas"}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
                <div
                  className={cn("h-full rounded-full", barColors[Math.min(index, barColors.length - 1)])}
                  style={{ width: `${(row.ativas / max) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center justify-between rounded-xl bg-brand-50 p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">SLA de atendimento geral</p>
          <p className="mt-1 text-2xl font-bold text-ink">{loading ? "—" : `${sla.toLocaleString("pt-BR")}%`}</p>
          <p className="text-xs text-slate-500">das tarefas ativas dentro do prazo</p>
        </div>
        <div className="relative size-16" role="img" aria-label={`SLA de ${sla}%`}>
          <svg viewBox="0 0 64 64" className="size-full -rotate-90">
            <circle cx="32" cy="32" r={radius} fill="none" strokeWidth="6" className="stroke-brand-100" />
            <circle
              cx="32"
              cy="32"
              r={radius}
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              className="stroke-brand-600"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - (loading ? 0 : sla) / 100)}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-brand-700">
            {loading ? "" : `${Math.round(sla)}%`}
          </span>
        </div>
      </div>
    </Cards>
  );
}