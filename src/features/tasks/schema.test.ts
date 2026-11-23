import { describe, expect, it } from "vitest";
import { newTaskSchema } from "./schema";

const valid = {
  title: "Validar certidão negativa",
  unitId: "u1",
  category: "Compliance Fiscal",
  priority: "alta" as const,
  assignee: "Mariana Silva",
  dueDate: "2026-12-10",
  description: "Conferir regularidade fiscal no portal da Receita.",
};

describe("newTaskSchema", () => {
  it("aceita um cadastro completo e válido", () => {
    expect(newTaskSchema.safeParse(valid).success).toBe(true);
  });

  it("recusa título com menos de 3 letras", () => {
    const result = newTaskSchema.safeParse({ ...valid, title: "Oi" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Informe o título da tarefa (mínimo 3 letras).");
    }
  });

  it("recusa tarefa sem fornecedor selecionado", () => {
    expect(newTaskSchema.safeParse({ ...valid, unitId: "" }).success).toBe(false);
  });

  it("recusa tarefa sem prazo", () => {
    expect(newTaskSchema.safeParse({ ...valid, dueDate: "" }).success).toBe(false);
  });
});