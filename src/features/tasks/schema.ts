import { z } from "zod";

export const TASK_PRIORITIES = [
  { value: "normal", label: "Normal" },
  { value: "media", label: "Média" },
  { value: "alta", label: "Alta" },
  { value: "critica", label: "Crítica" },
] as const;

export const TASK_CATEGORIES = [
  "Compliance Fiscal",
  "Jurídico & Contratos",
  "Cadastro",
  "Risco Financeiro",
  "Onboarding Cadastral",
  "Vistoria Técnica",
  "Ambiental & Licenciamento",
  "Rotina Operacional",
] as const;

export const newTaskSchema = z.object({
  title: z.string().trim().min(3, "Informe o título da tarefa (mínimo 3 letras)."),
  unitId: z.string().min(1, "Selecione o fornecedor."),
  category: z.string().min(1, "Selecione a categoria."),
  priority: z.enum(["normal", "media", "alta", "critica"], {
    message: "Selecione a prioridade.",
  }),
  assignee: z.string().min(1, "Selecione o responsável."),
  dueDate: z.string().min(1, "Informe o prazo de vencimento."),
  description: z.string().trim().min(5, "Descreva a tarefa (mínimo 5 letras)."),
});

export type NewTaskFormValues = z.infer<typeof newTaskSchema>;