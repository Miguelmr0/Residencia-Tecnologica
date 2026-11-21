import { describe, expect, it } from "vitest";
import type { TaskItem } from "./types";
import {
  EMPTY_FILTERS,
  filterTasks,
  formatDeadline,
  getQuickCounts,
  getSla,
  getTaskStats,
  getWorkload,
  isUrgent,
} from "./utils";

// Data fixa: 20/10/2026 (mês 9 = outubro, porque o JavaScript conta os meses a partir de 0)
const TODAY = new Date(2026, 9, 20);

// Monta uma tarefa completa; cada teste só informa o que quer mudar
function makeTask(overrides: Partial<TaskItem> = {}): TaskItem {
  return {
    id: "t1",
    unitId: "u1",
    title: "Renovar certidão",
    status: "pendente",
    dueDate: "2026-10-25",
    priority: "normal",
    category: "Compliance Fiscal",
    description: "Descrição",
    assignee: "Mariana Silva",
    supplierName: "Alpha Tecnologia Ltda.",
    supplierCnpj: "04.281.932/0001-44",
    supplierBlocked: false,
    ...overrides, // os campos informados sobrescrevem os padrões
  };
}

describe("formatDeadline", () => {
  it("marca como atrasada quando o prazo já passou", () => {
    const result = formatDeadline(makeTask({ dueDate: "2026-10-18" }), TODAY);
    expect(result.tone).toBe("danger");
    expect(result.text).toBe("Atrasada há 2 dias (18/10/2026)");
  });

  it("mostra prazo imediato quando vence hoje", () => {
    expect(formatDeadline(makeTask({ dueDate: "2026-10-20" }), TODAY).text).toBe("PRAZO: IMEDIATO (Hoje)");
  });

  it("avisa quando faltam até 7 dias", () => {
    const result = formatDeadline(makeTask({ dueDate: "2026-10-25" }), TODAY);
    expect(result.tone).toBe("warning");
    expect(result.text).toBe("Em 5 dias (25/10/2026)");
  });

  it("mostra só a data quando falta mais de uma semana", () => {
    expect(formatDeadline(makeTask({ dueDate: "2026-11-30" }), TODAY).text).toBe("Prazo: 30/11/2026");
  });
});

describe("isUrgent", () => {
  it("considera crítica e atrasada, mas não tarefa concluída", () => {
    expect(isUrgent(makeTask({ priority: "critica" }), TODAY)).toBe(true);
    expect(isUrgent(makeTask({ dueDate: "2026-10-01" }), TODAY)).toBe(true);
    expect(isUrgent(makeTask({ priority: "critica", status: "concluida" }), TODAY)).toBe(false);
  });
});

describe("filterTasks", () => {
  const tasks = [
    makeTask({ id: "t1", assignee: "Mariana Silva" }),
    makeTask({ id: "t2", assignee: "Carlos Souza", priority: "alta" }),
    makeTask({ id: "t3", assignee: "Carlos Souza", supplierBlocked: true }),
  ];

  it("sem filtros devolve tudo", () => {
    expect(filterTasks(tasks, EMPTY_FILTERS, TODAY)).toHaveLength(3);
  });

  it("filtra por prioridade", () => {
    const result = filterTasks(tasks, { ...EMPTY_FILTERS, priority: "alta" }, TODAY);
    expect(result.map((t) => t.id)).toEqual(["t2"]);
  });

  it("atalho 'minhas' mostra só as do usuário logado", () => {
    const result = filterTasks(tasks, { ...EMPTY_FILTERS, quick: "minhas" }, TODAY);
    expect(result.map((t) => t.id)).toEqual(["t1"]);
  });

  it("atalho 'bloqueados' mostra só fornecedor bloqueado", () => {
    const result = filterTasks(tasks, { ...EMPTY_FILTERS, quick: "bloqueados" }, TODAY);
    expect(result.map((t) => t.id)).toEqual(["t3"]);
  });
});

describe("indicadores", () => {
  const tasks = [
    makeTask({ id: "t1", status: "pendente", priority: "alta" }),
    makeTask({ id: "t2", status: "em_andamento", dueDate: "2026-10-01" }), // atrasada
    makeTask({ id: "t3", status: "concluida" }),
    makeTask({ id: "t4", status: "pendente", assignee: "Carlos Souza" }),
  ];

  it("getTaskStats conta cada situação a partir da lista", () => {
    expect(getTaskStats(tasks, TODAY)).toEqual({
      ativas: 3,
      pendentes: 2,
      emAndamento: 1,
      concluidas: 1,
      pendentesAltaPrioridade: 1,
      atrasadas: 1,
      taxaConclusao: 25,
    });
  });

  it("getQuickCounts conta só tarefas ativas", () => {
    expect(getQuickCounts(tasks, TODAY)).toEqual({ minhas: 2, equipe: 1, urgentes: 1, bloqueados: 0 });
  });

  it("getWorkload ordena do mais carregado para o menos", () => {
    const result = getWorkload(tasks, TODAY);
    expect(result[0]).toEqual({ name: "Mariana Silva", ativas: 2, criticas: 1 });
    expect(result[1]).toEqual({ name: "Carlos Souza", ativas: 1, criticas: 0 });
  });

  it("getSla é a % de tarefas ativas dentro do prazo", () => {
    expect(getSla(tasks, TODAY)).toBe(66.7); // 2 de 3 ativas estão no prazo
    expect(getSla([], TODAY)).toBe(100);
  });
});