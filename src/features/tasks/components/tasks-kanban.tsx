import { Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { TaskItem } from "@/features/tasks/types";
import { STATUS_LABEL } from "@/features/tasks/utils";
import type { TaskStatus } from "@/types";
import { PriorityBadge, TaskAvatar, TaskDeadline } from "./task-cells";

type TasksKanbanProps = {
  tasks: TaskItem[]; // todas as tarefas filtradas (sem paginação)
  onDetails: (id: string) => void;
};

const columns: TaskStatus[] = ["pendente", "em_andamento", "concluida"];

// Visão em colunas: uma coluna para cada situação da tarefa.
export function TasksKanban({ tasks, onDetails }: TasksKanbanProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {columns.map((status) => {
        const items = tasks.filter((t) => t.status === status);

        return (
          <section key={status} aria-label={STATUS_LABEL[status]} className="rounded-2xl bg-brand-50 p-3">
            <div className="mb-3 flex items-center justify-between px-1">
              <h2 className="font-semibold text-ink">{STATUS_LABEL[status]}</h2>
              <Badge variant="neutral">{items.length}</Badge>
            </div>

            <ul className="space-y-3">
              {items.length === 0 && <li className="px-1 py-6 text-center text-sm text-slate-400">Nenhuma tarefa</li>}
              {items.map((task) => (
                <li key={task.id}>
                  {/* O card inteiro é um botão: clicar abre os detalhes */}
                  <button
                    type="button"
                    onClick={() => onDetails(task.id)}
                    className="w-full space-y-2 rounded-xl bg-white p-4 text-left shadow-sm hover:shadow"
                  >
                    <PriorityBadge priority={task.priority} />
                    <p className="font-semibold text-ink">{task.title}</p>
                    <TaskDeadline task={task} />
                    <p className="flex items-center gap-1.5 text-xs font-medium text-brand-700">
                      <Building2 size={14} aria-hidden="true" /> {task.supplierName}
                    </p>
                    <p className="flex items-center gap-2 text-xs text-slate-600">
                      <TaskAvatar name={task.assignee} /> {task.assignee}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}