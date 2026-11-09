import { describe, expect, it } from "vitest";
import { fetchTasks, updateTaskStatus } from "./db";

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