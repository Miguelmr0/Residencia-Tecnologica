import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import type { TaskItem } from "@/features/tasks/types";
import { STATUS_LABEL } from "@/features/tasks/utils";
import { PriorityBadge, TaskAvatar, TaskDeadline } from "./task-cells";

type TaskDetailsDialogProps = {
  task: TaskItem | null; // null = janela fechada
  completing: boolean;
  onClose: () => void;
  onComplete: (id: string) => void;
};

// Janela "Detalhes" (e também "Resolver Agora"): mostra a tarefa inteira.
export function TaskDetailsDialog({ task, completing, onClose, onComplete }: TaskDetailsDialogProps) {
  return (
    <Dialog open={task !== null} onClose={onClose} title={task?.title ?? "Detalhes da tarefa"}>
      {task && (
        <div className="space-y-4 text-sm">
          <div className="flex flex-wrap items-center gap-2">
            <PriorityBadge priority={task.priority} />
            <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{task.category}</span>
            <span className="rounded bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
              {STATUS_LABEL[task.status]}
            </span>
          </div>

          <TaskDeadline task={task} />
          <p className="text-slate-600">{task.description}</p>

          <dl className="grid grid-cols-2 gap-3 rounded-lg bg-slate-50 p-3">
            <div>
              <dt className="text-xs text-slate-500">Fornecedor</dt>
              <dd className="font-medium text-ink">{task.supplierName}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">CNPJ</dt>
              <dd className="font-mono text-ink">{task.supplierCnpj}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Responsável</dt>
              <dd className="flex items-center gap-2 font-medium text-ink">
                <TaskAvatar name={task.assignee} /> {task.assignee}
              </dd>
            </div>
            {task.reference && (
              <div>
                <dt className="text-xs text-slate-500">Referência</dt>
                <dd className="font-medium text-ink">{task.reference}</dd>
              </div>
            )}
          </dl>

          {/* Regra do mock: tarefa de fornecedor bloqueado (unidade inativa) é somente leitura */}
          {task.supplierBlocked && (
            <p className="rounded-lg bg-danger-50 p-3 text-danger-700" role="note">
              Fornecedor bloqueado: esta tarefa é somente leitura e não pode ser concluída até a regularização.
            </p>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
            <Button
              disabled={task.status === "concluida" || task.supplierBlocked || completing}
              onClick={() => onComplete(task.id)}
            >
              {task.status === "concluida" ? "Já concluída" : "Marcar como concluída"}
            </Button>
          </div>
        </div>
      )}
    </Dialog>
  );
}