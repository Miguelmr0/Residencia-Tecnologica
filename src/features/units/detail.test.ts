import { describe, expect, it } from "vitest";
import type { Task, UnitDocument } from "@/types";
import {
  countDocumentsNeedingAttention,
  countPendingTasks,
  getSupplierDocuments,
  getSupplierTasks,
} from "./detail";

// Data fixa, para o resultado não depender do dia em que o teste roda
const today = new Date(2026, 9, 3); // 03/10/2026

const documents: UnitDocument[] = [
  { id: "d1", unitId: "u1", title: "Certidão", expiresAt: "2027-03-10" }, // válido
  { id: "d2", unitId: "u1", title: "ISO 9001", expiresAt: "2026-10-10" }, // 7 dias: próximo
  { id: "d3", unitId: "u3", title: "Alvará", expiresAt: "2026-09-02" }, // outro fornecedor
  { id: "d4", unitId: "u1", title: "Seguro", expiresAt: "2026-09-30" }, // expirado
];

const tasks: Task[] = [
  { id: "t1", unitId: "u1", title: "A", status: "pendente", dueDate: "2026-10-12" },
  { id: "t2", unitId: "u2", title: "B", status: "pendente", dueDate: "2026-10-01" },
  { id: "t3", unitId: "u1", title: "C", status: "concluida", dueDate: "2026-09-30" },
  { id: "t4", unitId: "u1", title: "D", status: "em_andamento", dueDate: "2026-10-05" },
];

describe("documentos do fornecedor", () => {
  it("devolve só os documentos dele, ordenados pelo vencimento", () => {
    const result = getSupplierDocuments(documents, "u1", today);
    expect(result.map((d) => d.id)).toEqual(["d4", "d2", "d1"]);
  });

  it("calcula o status pela data", () => {
    const result = getSupplierDocuments(documents, "u1", today);
    expect(result.map((d) => d.status)).toEqual(["expirado", "proximo_vencimento", "valido"]);
  });

  it("conta os documentos que exigem atenção", () => {
    const result = getSupplierDocuments(documents, "u1", today);
    expect(countDocumentsNeedingAttention(result)).toBe(2);
  });

  it("fornecedor sem documentos devolve lista vazia", () => {
    const result = getSupplierDocuments(documents, "u99", today);
    expect(result).toEqual([]);
    expect(countDocumentsNeedingAttention(result)).toBe(0);
  });
});

describe("tarefas do fornecedor", () => {
  it("devolve só as tarefas dele, ordenadas pelo prazo", () => {
    expect(getSupplierTasks(tasks, "u1").map((t) => t.id)).toEqual(["t3", "t4", "t1"]);
  });

  it("conta só as pendentes", () => {
    expect(countPendingTasks(getSupplierTasks(tasks, "u1"))).toBe(1);
  });
});