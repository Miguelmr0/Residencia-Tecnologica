import { describe, expect, it } from "vitest";
import { fetchTasks, updateTaskStatus, createTask } from "./db";

console.log("createTask:", createTask);
console.log("Tipo:", typeof createTask);

// Usam as tarefas-base do mock: t1 (unidade ativa), t2 (em homologação) e
// t4 (unidade inativa). Se alguém mudar essas tarefas ou unidades no db.ts,
// os testes precisam ser revistos.

describe("updateTaskStatus", () => {
  it("conclui a tarefa de uma unidade ativa", async () => {
    const updated = await updateTaskStatus("t1", "concluida");
    expect(updated.id).toBe("t1");
    expect(updated.status).toBe("concluida");
  });

  // Só "inativa" bloqueia: unidade em homologação ainda pode alterar tarefas
  it("permite alterar a tarefa de uma unidade em homologação", async () => {
    const updated = await updateTaskStatus("t2", "concluida");
    expect(updated.status).toBe("concluida");
  });

  // "rejects.toThrow" = a chamada deve falhar com essa mensagem de erro
  it("recusa alterar a tarefa de uma unidade inativa", async () => {
    await expect(updateTaskStatus("t4", "concluida")).rejects.toThrow(
      "Unidade inativa: a tarefa é somente leitura",
    );
  });

  // O bloqueio não pode alterar a tarefa pela metade: o status continua o mesmo
  it("não altera o status da tarefa recusada", async () => {
    await expect(updateTaskStatus("t4", "concluida")).rejects.toThrow();
    const tasks = await fetchTasks();
    expect(tasks.find((t) => t.id === "t4")?.status).toBe("pendente");
  });

  it("dá erro quando a tarefa não existe", async () => {
    await expect(updateTaskStatus("t999", "concluida")).rejects.toThrow("Tarefa não encontrada");
  });
});

describe("createTask", () => {
  // Verifica se uma tarefa pode ser criada normalmente para uma unidade ativa.
  it("deve criar uma tarefa para uma unidade ativa", async () => {
    const newTask = await createTask({
      unitId: "u1",
      title: "Testar criação",
      status: "pendente",
      dueDate: "2026-12-15",
    });

    // Confirma se a tarefa recebeu um ID e manteve os dados informados.
    expect(newTask.id).toBeDefined();
    expect(newTask.title).toBe("Testar criação");
    expect(newTask.unitId).toBe("u1");
  });

  // Verifica se unidades em homologação também podem receber novas tarefas.
  it("deve permitir criar tarefa para unidade em homologação", async () => {
    const newTask = await createTask({
      unitId: "u2",
      title: "Testar homologação",
      status: "pendente",
      dueDate: "2026-12-15",
    });

    // Confirma se a tarefa foi associada à unidade correta.
    expect(newTask.unitId).toBe("u2");
  });

  // Verifica se o sistema bloqueia a criação de tarefas para unidades inativas.
  it("não deve criar tarefa para unidade inativa", async () => {
    await expect(
      createTask({
        unitId: "u3",
        title: "Tarefa bloqueada",
        status: "pendente",
        dueDate: "2026-12-15",
      })
    ).rejects.toThrow("Unidade inativa: não é possível criar tarefas");
  });

  // Verifica se o sistema rejeita tentativas de criar tarefas para unidades inexistentes.
  it("não deve criar tarefa para unidade inexistente", async () => {
    await expect(
      createTask({
        unitId: "u999",
        title: "Tarefa inválida",
        status: "pendente",
        dueDate: "2026-12-15",
      })
    ).rejects.toThrow("Unidade não encontrada");
  });
});