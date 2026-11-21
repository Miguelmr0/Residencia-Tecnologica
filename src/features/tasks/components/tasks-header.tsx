import { Plus, Workflow, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

type TasksHeaderProps = {
  onAutomations: () => void;
  onNew: () => void;
};

export function TasksHeader({ onAutomations, onNew }: TasksHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-brand-600">
          <Workflow size={14} aria-hidden="true" /> Workflow operacional &amp; auditoria
        </p>
        <h1 className="mt-1 text-3xl font-bold text-ink">Tarefas &amp; Pendências</h1>
        <p className="mt-1 max-w-xl text-sm text-slate-500">
          Painel de controle de rotinas operacionais, auditorias periódicas e regularizações de fornecedores.
        </p>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" size="lg" onClick={onAutomations}>
          <Zap aria-hidden="true" /> Automações de Workflow
        </Button>
        <Button size="lg" onClick={onNew}>
          <Plus aria-hidden="true" /> Nova Tarefa
        </Button>
      </div>
    </header>
  );
}