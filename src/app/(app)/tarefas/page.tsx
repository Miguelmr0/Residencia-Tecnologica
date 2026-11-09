"use client"; // roda no navegador (usa hooks e estado)

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Cards } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { TaskDetailsDialog } from "@/features/tasks/components/task-details-dialog";
import { TasksAutomations } from "@/features/tasks/components/tasks-automations";
import { TasksHeader } from "@/features/tasks/components/tasks-header";
import { TasksKanban } from "@/features/tasks/components/tasks-kanban";
import { TasksList } from "@/features/tasks/components/tasks-list";
import { TasksListSkeleton } from "@/features/tasks/components/tasks-list-skeleton";
import { TasksStats } from "@/features/tasks/components/tasks-stats";
import { TasksToolbar } from "@/features/tasks/components/tasks-toolbar";
import { TasksWorkload } from "@/features/tasks/components/tasks-workload";
import { useUpdateTaskStatus } from "@/features/tasks/hooks";
import { useTaskItems } from "@/features/tasks/items-hooks";
import type { TaskItem } from "@/features/tasks/types";
import {
  EMPTY_FILTERS,
  TASKS_PAGE_SIZE,
  exportTasksToCsv,
  filterTasks,
  getQuickCounts,
  getSla,
  getTaskStats,
  getWorkload,
  isActive,
  sortByDeadline,
  uniqueSorted,
  type TaskFilters,
  type TasksView,
} from "@/features/tasks/utils";

export default function TarefasPage() {
  // Dados do servidor (mockados) ficam no TanStack Query...
  const { data, isLoading, isError, isFetching, refetch } = useTaskItems();
  const updateTask = useUpdateTaskStatus();
  const tasks = useMemo(() => data ?? [], [data]);

  // ...e o estado de interface fica em useState (separação exigida pelo PDF).
  const [filters, setFilters] = useState<TaskFilters>(EMPTY_FILTERS);
  const [view, setView] = useState<TasksView>("lista");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [detailsId, setDetailsId] = useState<string | null>(null);
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // ---------- Valores derivados (nada é guardado, tudo é calculado) ----------
  const today = useMemo(() => new Date(), []); // a mesma data durante a visita à tela
  const stats = useMemo(() => getTaskStats(tasks, today), [tasks, today]);
  const counts = useMemo(() => getQuickCounts(tasks, today), [tasks, today]);
  const workload = useMemo(() => getWorkload(tasks, today), [tasks, today]);
  const sla = useMemo(() => getSla(tasks, today), [tasks, today]);
  const categories = useMemo(() => uniqueSorted(tasks.map((t) => t.category)), [tasks]);
  const assignees = useMemo(() => uniqueSorted(tasks.map((t) => t.assignee)), [tasks]);

  // A lista mostra só tarefas ativas (concluída some do checklist); o Kanban mostra as três colunas.
  const filtered = useMemo(() => filterTasks(tasks, filters, today), [tasks, filters, today]);
  const listTasks = useMemo(() => sortByDeadline(filtered.filter(isActive)), [filtered]);

  // Paginação: fatia da lista que aparece na tela.
  const totalPages = Math.max(1, Math.ceil(listTasks.length / TASKS_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages); // evita ficar numa página que deixou de existir
  const pageItems = listTasks.slice((currentPage - 1) * TASKS_PAGE_SIZE, currentPage * TASKS_PAGE_SIZE);

  const detailsTask: TaskItem | null = tasks.find((t) => t.id === detailsId) ?? null;

  // ---------- Ações ----------
  // Mudou qualquer filtro: volta para a página 1.
  function handleFiltersChange(next: TaskFilters) {
    setFilters(next);
    setPage(1);
  }

  function toggleOne(id: string) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  // Marca ou desmarca todas as tarefas da página atual.
  function toggleAllOnPage() {
    const ids = pageItems.map((t) => t.id);
    const allSelected = ids.every((id) => selectedIds.includes(id));
    setSelectedIds((prev) =>
      allSelected ? prev.filter((id) => !ids.includes(id)) : Array.from(new Set([...prev, ...ids])),
    );
  }

  // Conclui UMA tarefa. A regra "fornecedor bloqueado = somente leitura" vem do mock (erro).
  function handleComplete(id: string) {
    setFeedback(null);
    setCompletingId(id);
    updateTask.mutate(
      { id, status: "concluida" },
      {
        onSuccess: () => setDetailsId(null),
        onError: (error) => setFeedback(error.message),
        onSettled: () => setCompletingId(null),
      },
    );
  }

  // Conclui várias de uma vez e conta quantas deram certo.
  async function handleCompleteSelected() {
    setFeedback(null);
    const results = await Promise.allSettled(
      selectedIds.map((id) => updateTask.mutateAsync({ id, status: "concluida" })),
    );
    const failed = results.filter((r) => r.status === "rejected").length;
    setSelectedIds([]);
    if (failed > 0) {
      setFeedback(`${failed} tarefa(s) não puderam ser concluídas (fornecedor bloqueado).`);
    }
  }

  function handleNewTask() {
    // Ainda não existe formulário de tarefa. Quando existir (modal), abra-o aqui.
    window.alert("Cadastro de nova tarefa: em desenvolvimento.");
  }

  function handleAutomations() {
    window.alert("Automações de workflow: em desenvolvimento.");
  }

  function handleAssign(task: TaskItem) {
    // Mock: não há API real para trocar o responsável.
    window.alert(`Atribuição de responsável da tarefa "${task.title}": em desenvolvimento.`);
  }

  // ---------- Conteúdo principal: loading, erro, vazio, kanban ou lista ----------
  let content;
  if (isLoading) {
    content = <TasksListSkeleton />;
  } else if (isError) {
    content = (
      <Cards>
        <EmptyState
          title="Não foi possível carregar as tarefas"
          description="Houve um erro ao buscar os dados. Tente novamente."
          action={<Button onClick={refetch}>Tentar novamente</Button>}
        />
      </Cards>
    );
  } else if ((view === "lista" ? listTasks : filtered).length === 0) {
    content = (
      <Cards>
        <EmptyState
          title="Nenhuma tarefa encontrada"
          description="Nenhuma tarefa corresponde aos filtros aplicados."
          action={
            <Button variant="outline" onClick={() => handleFiltersChange(EMPTY_FILTERS)}>
              Limpar filtros
            </Button>
          }
        />
      </Cards>
    );
  } else if (view === "kanban") {
    content = <TasksKanban tasks={filtered} onDetails={setDetailsId} />;
  } else {
    content = (
      <TasksList
        tasks={pageItems}
        totalVisible={listTasks.length}
        page={currentPage}
        pageSize={TASKS_PAGE_SIZE}
        selectedIds={selectedIds}
        completingId={completingId}
        refreshing={isFetching}
        onPageChange={setPage}
        onToggle={toggleOne}
        onToggleAll={toggleAllOnPage}
        onClearSelection={() => setSelectedIds([])}
        onCompleteSelected={handleCompleteSelected}
        onComplete={handleComplete}
        onAssign={handleAssign}
        onDetails={setDetailsId}
        onExport={() => exportTasksToCsv(listTasks)}
        onRefresh={refetch}
      />
    );
  }

  return (
    // O espaçamento externo já vem do AppShell, por isso não há padding aqui.
    <div className="space-y-6">
      <TasksHeader onAutomations={handleAutomations} onNew={handleNewTask} />

      <TasksStats stats={stats} loading={isLoading} />

      {/* Duas colunas no desktop: lista à esquerda, painéis à direita */}
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-6">
          <TasksToolbar
            filters={filters}
            onChange={handleFiltersChange}
            categories={categories}
            assignees={assignees}
            counts={counts}
            view={view}
            onViewChange={setView}
          />

          {/* Aviso de erro da conclusão (ex.: fornecedor bloqueado) */}
          {feedback && (
            <p role="alert" className="flex items-start justify-between gap-3 rounded-lg bg-danger-50 p-3 text-sm text-danger-700">
              {feedback}
              <button type="button" className="font-semibold underline" onClick={() => setFeedback(null)}>
                Fechar
              </button>
            </p>
          )}

          {content}
        </div>

        <aside className="space-y-6">
          <TasksAutomations onConfigure={handleAutomations} />
          <TasksWorkload rows={workload} sla={sla} loading={isLoading} />
        </aside>
      </div>

      <TaskDetailsDialog
        task={detailsTask}
        completing={completingId === detailsId}
        onClose={() => setDetailsId(null)}
        onComplete={handleComplete}
      />
    </div>
  );
}