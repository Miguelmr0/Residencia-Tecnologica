import type { DocumentStatus, Task, UnitDocument } from "@/types";
import { getDocumentStatus } from "../../lib/document-status";

export type DocumentWithStatus = UnitDocument & { status: DocumentStatus };

// Documentos do fornecedor, com o status calculado pela data e ordenados pelo vencimento
export function getSupplierDocuments(
  documents: UnitDocument[],
  unitId: string,
  today: Date = new Date(),
): DocumentWithStatus[] {
  return documents
    .filter((doc) => doc.unitId === unitId)
    .map((doc) => ({ ...doc, status: getDocumentStatus(doc.expiresAt, today) }))
    .sort((a, b) => a.expiresAt.localeCompare(b.expiresAt));
}

// Pendência de documento = próximo do vencimento ou expirado (regra do projeto)
export function countDocumentsNeedingAttention(documents: DocumentWithStatus[]): number {
  return documents.filter((doc) => doc.status !== "valido").length;
}

// Tarefas do fornecedor, ordenadas pelo prazo
export function getSupplierTasks(tasks: Task[], unitId: string): Task[] {
  return tasks
    .filter((task) => task.unitId === unitId)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
}

// Pendência de tarefa = status "pendente" (regra do projeto)
export function countPendingTasks(tasks: Task[]): number {
  return tasks.filter((task) => task.status === "pendente").length;
}