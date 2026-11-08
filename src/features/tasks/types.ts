import type { Task } from "@/types";

// Nível de prioridade que o Figma mostra (CRÍTICA, ALTA, MÉDIA, NORMAL).
export type TaskPriority = "critica" | "alta" | "media" | "normal";

// Dados extras que o Figma mostra e o Task oficial (src/types) não tem.
export type TaskDetails = {
  priority: TaskPriority;
  category: string; // ex.: "Compliance Fiscal"
  description: string; // texto curto sob o título
  assignee: string; // responsável pela tarefa
  reference?: string; // ex.: "Contrato #4492-B" (nem toda tarefa tem)
};

// Dados do fornecedor, vindos da lista oficial de unidades (ligados pelo unitId).
export type TaskSupplierInfo = {
  supplierName: string;
  supplierCnpj: string;
  supplierBlocked: boolean; // true quando a unidade está inativa
};

// TaskItem = o Task oficial + os dados extras + os dados do fornecedor.
// O tipo da squad continua intacto: só importamos, nunca alteramos.
export type TaskItem = Task & TaskDetails & TaskSupplierInfo;