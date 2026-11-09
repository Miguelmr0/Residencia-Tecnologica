import { Download, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Cards } from "@/components/ui/card";
import type { TaskItem } from "@/features/tasks/types";
import { TaskRow } from "./task-row";
import { TasksPagination } from "./tasks-pagination";

type TasksListProps = {
  tasks: TaskItem[]; // somente as tarefas da página atual
  totalVisible: number; // total já filtrado (todas as páginas)
  page: number;
  pageSize: number;
  selectedIds: string[];
  completingId: string | null;
  refreshing: boolean;
  onPageChange: (page: number) => void;
  onToggle: (id: string) => void;
  onToggleAll: () => void;
  onClearSelection: () => void;
  onCompleteSelected: () => void;
  onComplete: (id: string) => void;
  onAssign: (task: TaskItem) => void;
  onDetails: (id: string) => void;
  onExport: () => void;
  onRefresh: () => void;
};

export function TasksList(props: TasksListProps) {
  const { tasks, totalVisible, page, pageSize, selectedIds, completingId, refreshing } = props;
  const allSelected = tasks.length > 0 && tasks.every((t) => selectedIds.includes(t.id));

  return (
    <Cards className="overflow-hidden p-0 sm:p-0">
      {/* Cabeçalho do checklist */}
      <div className="flex items-center justify-between gap-3 bg-brand-50 px-5 py-4">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-lg font-semibold text-ink">Checklist Operacional</h2>
          <Badge variant="neutral">{totalVisible} tarefas visíveis</Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-sm" aria-label="Exportar tarefas em CSV" onClick={props.onExport}>
            <Download aria-hidden="true" />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Atualizar lista" disabled={refreshing} onClick={props.onRefresh}>
            <RefreshCw className={refreshing ? "animate-spin" : undefined} aria-hidden="true" />
          </Button>
        </div>
      </div>

      {/* Barra de seleção: marcar todas da página e ações em lote */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-2.5 text-xs text-slate-600">
        <label className="flex items-center gap-3">
          <input type="checkbox" className="size-4" checked={allSelected} onChange={props.onToggleAll} />
          Selecionar todas as {tasks.length} tarefas da página
        </label>
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2">
            <span>{selectedIds.length} selecionada(s)</span>
            <Button size="sm" onClick={props.onCompleteSelected}>
              Concluir selecionadas
            </Button>
            <Button variant="outline" size="sm" onClick={props.onClearSelection}>
              Limpar seleção
            </Button>
          </div>
        )}
      </div>

      <ul className="divide-y divide-slate-100">
        {tasks.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            selected={selectedIds.includes(task.id)}
            completing={completingId === task.id}
            onToggle={props.onToggle}
            onComplete={props.onComplete}
            onAssign={props.onAssign}
            onDetails={props.onDetails}
          />
        ))}
      </ul>

      <TasksPagination page={page} pageSize={pageSize} total={totalVisible} onPageChange={props.onPageChange} />
    </Cards>
  );
}