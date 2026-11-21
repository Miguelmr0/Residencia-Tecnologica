"use client";

import { AlertCircle, Columns3, ListChecks, Lock } from "lucide-react";
import type { ReactNode } from "react";
import { Cards } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import type { TaskPriority } from "@/features/tasks/types";
import {
  PRIORITY_LABEL,
  type PriorityFilter,
  type QuickFilter,
  type TaskFilters,
  type TasksView,
} from "@/features/tasks/utils";
import { cn } from "@/lib/utils";

type TasksToolbarProps = {
  filters: TaskFilters;
  onChange: (filters: TaskFilters) => void;
  categories: string[];
  assignees: string[];
  counts: Record<QuickFilter, number>;
  view: TasksView;
  onViewChange: (view: TasksView) => void;
};

// Cada atalho: texto, ícone opcional e cor quando está ligado.
const quickChips: { key: QuickFilter; label: string; icon?: ReactNode; activeClass: string }[] = [
  { key: "minhas", label: "Minhas Tarefas", activeClass: "border-brand-600 bg-brand-600 text-white" },
  { key: "equipe", label: "Atribuídas à Equipe", activeClass: "border-brand-600 bg-brand-600 text-white" },
  {
    key: "urgentes",
    label: "Urgentes / Atrasadas",
    icon: <AlertCircle size={14} aria-hidden="true" />,
    activeClass: "border-danger-700 bg-danger-700 text-white",
  },
  {
    key: "bloqueados",
    label: "Com Fornecedor Bloqueado",
    icon: <Lock size={14} aria-hidden="true" />,
    activeClass: "border-amber-600 bg-amber-600 text-white",
  },
];

export function TasksToolbar({ filters, onChange, categories, assignees, counts, view, onViewChange }: TasksToolbarProps) {
  const priorityOptions = [
    { value: "todas", label: "Todas Prioridades" },
    ...(Object.keys(PRIORITY_LABEL) as TaskPriority[]).map((value) => ({ value, label: PRIORITY_LABEL[value] })),
  ];
  const categoryOptions = [{ value: "todos", label: "Todas Categorias" }, ...categories.map((c) => ({ value: c, label: c }))];
  const assigneeOptions = [{ value: "todos", label: "Responsável" }, ...assignees.map((a) => ({ value: a, label: a }))];

  return (
    <Cards className="space-y-4 p-4 sm:p-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Alternância entre Lista e Kanban */}
        <div role="group" aria-label="Modo de visualização" className="flex shrink-0 rounded-lg bg-slate-100 p-1">
          {(["lista", "kanban"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              aria-pressed={view === mode}
              onClick={() => onViewChange(mode)}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium",
                view === mode ? "bg-white text-brand-600 shadow-sm" : "text-slate-500",
              )}
            >
              {mode === "lista" ? <ListChecks size={16} aria-hidden="true" /> : <Columns3 size={16} aria-hidden="true" />}
              {mode === "lista" ? "Lista Acionável" : "Modo Kanban"}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <Select
            label="Filtrar por prioridade"
            className="w-full sm:w-48"
            value={filters.priority}
            options={priorityOptions}
            onChange={(value) => onChange({ ...filters, priority: value as PriorityFilter })}
          />
          <Select
            label="Filtrar por categoria"
            className="w-full sm:w-48"
            value={filters.category}
            options={categoryOptions}
            onChange={(value) => onChange({ ...filters, category: value })}
          />
          <Select
            label="Filtrar por responsável"
            className="w-full sm:w-48"
            value={filters.assignee}
            options={assigneeOptions}
            onChange={(value) => onChange({ ...filters, assignee: value })}
          />
        </div>
      </div>

      {/* Atalhos: clicar liga; clicar de novo desliga */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Atalhos de filtro">
        {quickChips.map((chip) => {
          const active = filters.quick === chip.key;
          return (
            <button
              key={chip.key}
              type="button"
              aria-pressed={active}
              onClick={() => onChange({ ...filters, quick: active ? null : chip.key })}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold",
                active ? chip.activeClass : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
              )}
            >
              {chip.icon}
              {chip.label}
              <span className={cn("rounded-full px-1.5 py-0.5 text-[11px]", active ? "bg-white/25" : "bg-slate-100")}>
                {counts[chip.key]}
              </span>
            </button>
          );
        })}
      </div>
    </Cards>
  );
}