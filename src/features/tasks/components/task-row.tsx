import { Building2, Check, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TaskItem } from "@/features/tasks/types";
import { cn } from "@/lib/utils";
import { PriorityBadge, TaskAvatar, TaskDeadline } from "./task-cells";

type TaskRowProps = {
  task: TaskItem;
  selected: boolean;
  completing: boolean; // true enquanto a conclusão desta tarefa está sendo enviada
  onToggle: (id: string) => void;
  onComplete: (id: string) => void;
  onAssign: (task: TaskItem) => void;
  onDetails: (id: string) => void;
};

export function TaskRow({ task, selected, completing, onToggle, onComplete, onAssign, onDetails }: TaskRowProps) {
  const critical = task.priority === "critica";

  return (
    // Tarefa crítica ganha fundo avermelhado, como no Figma
    <li className={cn("flex flex-col gap-4 px-5 py-5 lg:flex-row lg:items-center", critical && "bg-danger-50/50")}>
      <div className="flex min-w-0 flex-1 gap-4">
        <input
          type="checkbox"
          className="mt-1 size-4 shrink-0"
          checked={selected}
          onChange={() => onToggle(task.id)}
          aria-label={`Selecionar tarefa ${task.title}`}
        />

        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <PriorityBadge priority={task.priority} />
            <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{task.category}</span>
          </div>

          <TaskDeadline task={task} />

          <h3 className={cn("text-base font-semibold", critical ? "text-danger-700" : "text-ink")}>{task.title}</h3>
          <p className="text-sm text-slate-500">{task.description}</p>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-xs">
            <span className="inline-flex items-center gap-1.5 font-semibold text-brand-700">
              <Building2 size={14} aria-hidden="true" /> {task.supplierName}
            </span>
            <span className="font-mono text-slate-400">CNPJ: {task.supplierCnpj}</span>
            {task.reference && <span className="text-slate-500">{task.reference}</span>}
            {task.supplierBlocked && (
              <span className="rounded bg-danger-50 px-2 py-0.5 font-bold uppercase text-danger-700">
                Fornecedor bloqueado
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-3 pl-8 lg:pl-0">
        <span className="flex items-center gap-2 text-sm font-medium text-ink">
          <TaskAvatar name={task.assignee} /> {task.assignee}
        </span>

        {critical ? (
          <Button
            size="sm"
            className="bg-danger-700 text-white hover:bg-danger-700/90"
            onClick={() => onDetails(task.id)}
          >
            Resolver Agora
          </Button>
        ) : (
          <Button variant="ghost" size="sm" className="text-brand-600" onClick={() => onDetails(task.id)}>
            Detalhes
          </Button>
        )}

        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Atribuir responsável da tarefa ${task.title}`}
          onClick={() => onAssign(task)}
        >
          <UserPlus aria-hidden="true" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Concluir tarefa ${task.title}`}
          disabled={completing}
          onClick={() => onComplete(task.id)}
        >
          <Check aria-hidden="true" />
        </Button>
      </div>
    </li>
  );
}