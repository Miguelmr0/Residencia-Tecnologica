import { differenceInCalendarDays, format, parseISO } from "date-fns";
import type { TaskStatus } from "@/types";
import type { TaskItem, TaskPriority } from "./types";

// ---------- Constantes ----------
// Usuário logado do Figma. Quando existir login de verdade, troque por quem estiver logado.
export const CURRENT_USER = "Mariana Silva";
export const TASKS_PAGE_SIZE = 7; // "Exibindo 1–7 de 95 tarefas"
export const COMPLETION_GOAL = 80; // meta (%) de conclusão

// ---------- Tipos ----------
export type TasksView = "lista" | "kanban";
export type QuickFilter = "minhas" | "equipe" | "urgentes" | "bloqueados";
export type PriorityFilter = "todas" | TaskPriority;

// Todos os filtros da tela num único objeto (estado de interface, vai em useState).
export type TaskFilters = {
  priority: PriorityFilter;
  category: string; // "todos" ou o nome da categoria
  assignee: string; // "todos" ou o nome do responsável
  quick: QuickFilter | null; // atalho ligado (ou nenhum)
};

export const EMPTY_FILTERS: TaskFilters = {
  priority: "todas",
  category: "todos",
  assignee: "todos",
  quick: null,
};

export type TaskStats = {
  ativas: number; // pendentes + em andamento
  pendentes: number;
  emAndamento: number;
  concluidas: number;
  pendentesAltaPrioridade: number;
  atrasadas: number;
  taxaConclusao: number; // % de concluídas sobre o total
};

export type WorkloadRow = { name: string; ativas: number; criticas: number };

// ---------- Textos exibidos ----------
export const PRIORITY_LABEL: Record<TaskPriority, string> = {
  critica: "CRÍTICA",
  alta: "ALTA",
  media: "MÉDIA",
  normal: "NORMAL",
};

export const STATUS_LABEL: Record<TaskStatus, string> = {
  pendente: "Pendente",
  em_andamento: "Em andamento",
  concluida: "Concluída",
};

// ---------- Regras de prazo ----------
// "today" é parâmetro para os testes poderem fixar a data.

export function isActive(task: TaskItem): boolean {
  return task.status !== "concluida";
}

export function getDaysLeft(dueDate: string, today: Date = new Date()): number {
  return differenceInCalendarDays(parseISO(dueDate), today);
}

export function isOverdue(task: TaskItem, today: Date = new Date()): boolean {
  return isActive(task) && getDaysLeft(task.dueDate, today) < 0;
}

// Urgente = crítica ou atrasada (e ainda não concluída).
export function isUrgent(task: TaskItem, today: Date = new Date()): boolean {
  return isActive(task) && (task.priority === "critica" || isOverdue(task, today));
}

export type DeadlineTone = "danger" | "warning" | "neutral";

// Texto do prazo, como no Figma: "Em 5 dias (22/09/2026)", "Prazo: 25/09/2026"...
export function formatDeadline(task: TaskItem, today: Date = new Date()): { text: string; tone: DeadlineTone } {
  const date = format(parseISO(task.dueDate), "dd/MM/yyyy");
  const days = getDaysLeft(task.dueDate, today);

  if (!isActive(task)) return { text: `Prazo: ${date}`, tone: "neutral" };
  if (days < 0) return { text: `Atrasada há ${-days} ${-days === 1 ? "dia" : "dias"} (${date})`, tone: "danger" };
  if (days === 0) return { text: "PRAZO: IMEDIATO (Hoje)", tone: "danger" };
  if (days <= 7) return { text: `Em ${days} ${days === 1 ? "dia" : "dias"} (${date})`, tone: "warning" };
  return { text: `Prazo: ${date}`, tone: "neutral" };
}

// ---------- Filtros e ordenação ----------
function matchesQuick(task: TaskItem, quick: QuickFilter, today: Date): boolean {
  switch (quick) {
    case "minhas":
      return task.assignee === CURRENT_USER;
    case "equipe":
      return task.assignee !== CURRENT_USER;
    case "urgentes":
      return isUrgent(task, today);
    case "bloqueados":
      return task.supplierBlocked;
  }
}

// Aplica todos os filtros de uma vez.
export function filterTasks(tasks: TaskItem[], filters: TaskFilters, today: Date = new Date()): TaskItem[] {
  return tasks.filter((task) => {
    const matchPriority = filters.priority === "todas" || task.priority === filters.priority;
    const matchCategory = filters.category === "todos" || task.category === filters.category;
    const matchAssignee = filters.assignee === "todos" || task.assignee === filters.assignee;
    const matchQuickFilter = filters.quick === null || matchesQuick(task, filters.quick, today);
    return matchPriority && matchCategory && matchAssignee && matchQuickFilter;
  });
}

// Prazo mais próximo primeiro (as atrasadas aparecem no topo).
export function sortByDeadline(tasks: TaskItem[]): TaskItem[] {
  return [...tasks].sort((a, b) => a.dueDate.localeCompare(b.dueDate));
}

// ---------- Indicadores (sempre calculados da lista, nunca fixos) ----------
export function getTaskStats(tasks: TaskItem[], today: Date = new Date()): TaskStats {
  const pendentes = tasks.filter((t) => t.status === "pendente");
  const emAndamento = tasks.filter((t) => t.status === "em_andamento").length;
  const concluidas = tasks.filter((t) => t.status === "concluida").length;

  return {
    ativas: pendentes.length + emAndamento,
    pendentes: pendentes.length,
    emAndamento,
    concluidas,
    pendentesAltaPrioridade: pendentes.filter((t) => t.priority === "alta" || t.priority === "critica").length,
    atrasadas: tasks.filter((t) => isOverdue(t, today)).length,
    taxaConclusao: tasks.length === 0 ? 0 : Math.round((concluidas / tasks.length) * 1000) / 10,
  };
}

// Contador de cada atalho (só tarefas ativas).
export function getQuickCounts(tasks: TaskItem[], today: Date = new Date()): Record<QuickFilter, number> {
  const active = tasks.filter(isActive);
  return {
    minhas: active.filter((t) => matchesQuick(t, "minhas", today)).length,
    equipe: active.filter((t) => matchesQuick(t, "equipe", today)).length,
    urgentes: active.filter((t) => matchesQuick(t, "urgentes", today)).length,
    bloqueados: active.filter((t) => matchesQuick(t, "bloqueados", today)).length,
  };
}

// Carga de trabalho por analista (ativas e críticas), do mais carregado para o menos.
export function getWorkload(tasks: TaskItem[], today: Date = new Date()): WorkloadRow[] {
  const byName = new Map<string, WorkloadRow>();

  for (const task of tasks.filter(isActive)) {
    const row = byName.get(task.assignee) ?? { name: task.assignee, ativas: 0, criticas: 0 };
    row.ativas += 1;
    if (isUrgent(task, today)) row.criticas += 1;
    byName.set(task.assignee, row);
  }

  return Array.from(byName.values()).sort((a, b) => b.ativas - a.ativas);
}

// SLA = % das tarefas ativas que ainda estão dentro do prazo.
export function getSla(tasks: TaskItem[], today: Date = new Date()): number {
  const active = tasks.filter(isActive);
  if (active.length === 0) return 100;
  const onTime = active.filter((t) => !isOverdue(t, today)).length;
  return Math.round((onTime / active.length) * 1000) / 10;
}

// Lista sem repetição e em ordem alfabética (usada nos selects de filtro).
export function uniqueSorted(values: string[]): string[] {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b, "pt-BR"));
}

// ---------- Exportação ----------
// Baixa um CSV no navegador (botão de download do Checklist).
export function exportTasksToCsv(tasks: TaskItem[], filename = "tarefas.csv"): void {
  const header = ["Tarefa", "Fornecedor", "CNPJ", "Categoria", "Prioridade", "Responsável", "Prazo", "Status"];
  const rows = tasks.map((t) => [
    t.title,
    t.supplierName,
    t.supplierCnpj,
    t.category,
    PRIORITY_LABEL[t.priority],
    t.assignee,
    format(parseISO(t.dueDate), "dd/MM/yyyy"),
    STATUS_LABEL[t.status],
  ]);
  const csv = [header, ...rows]
    .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(";"))
    .join("\n");

  // \uFEFF faz o Excel abrir os acentos corretamente.
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}