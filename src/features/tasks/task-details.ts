import { toSupplier } from "@/features/units/supplier-details";
import type { Supplier } from "@/features/units/types";
import type { Task, Unit } from "@/types";
import type { TaskDetails, TaskItem } from "./types";

// O Task oficial só tem título, status, prazo e a unidade. O Figma mostra mais
// coisas (prioridade, categoria, descrição, responsável). Esses dados extras
// ficam aqui, ligados ao id da tarefa, sem alterar o tipo da squad.

// Equipe que recebe as tarefas geradas (nomes iguais aos do Figma).
export const ASSIGNEES = ["Mariana Silva", "Carlos Souza", "Amanda Costa", "Roberto Lima"];

// As 4 tarefas que já existem no mock oficial, com os dados do Figma.
const figmaDetails: Record<string, TaskDetails> = {
  t1: {
    priority: "alta",
    category: "Compliance Fiscal",
    description:
      "Certidão de Débitos Relativos a Créditos Tributários Federais expirando. Requer certidão atualizada no portal e-CAC.",
    assignee: "Mariana Silva",
  },
  t2: {
    priority: "media",
    category: "Jurídico & Contratos",
    description:
      "Ajuste de cláusula de SLA e reajuste inflacionário IPCA para prestação de serviços prediais no centro corporativo.",
    assignee: "Carlos Souza",
    reference: "Contrato #4492-B",
  },
  t3: {
    priority: "normal",
    category: "Cadastro",
    description:
      "Recebimento da 4ª alteração contratual consolidada e confirmação de chave PIX de titularidade do CNPJ ativo.",
    assignee: "Amanda Costa",
  },
  t4: {
    priority: "critica",
    category: "Cadastro",
    description:
      "Regularizar as pendências abertas antes do encerramento do cadastro. Ordens de compra do fornecedor estão travadas.",
    assignee: "Mariana Silva",
  },
};

// Modelos das tarefas geradas em src/mocks/db.ts. A chave é o TÍTULO da tarefa:
// precisa ser igual ao título usado lá. Se não achar, usa o modelo padrão abaixo.
type Template = Omit<TaskDetails, "assignee" | "reference">;

const templates: Record<string, Template> = {
  "Solicitar novo balanço patrimonial": {
    priority: "alta",
    category: "Risco Financeiro",
    description:
      "Atualização de capacidade financeira para contratos com valor global acima de R$ 1.2M. Parecer dos auditores independentes.",
  },
  "Validar documentação de homologação": {
    priority: "normal",
    category: "Onboarding Cadastral",
    description:
      "Conferência do Questionário de Compliance ESG e análise preventiva em listas restritivas (OFAC, CEIS, CNEP).",
  },
  "Agendar auditoria presencial de segurança": {
    priority: "alta",
    category: "Vistoria Técnica",
    description:
      "Inspeção técnica in loco dos EPIs, prontuário de instalações elétricas e ASO com aptidão para trabalho em altura.",
  },
  "Notificar fornecedor sobre licença ambiental": {
    priority: "critica",
    category: "Ambiental & Licenciamento",
    description:
      "Operação logística com produto controlado em rota interestadual. Risco iminente de embargo da frota em trânsito.",
  },
  "Conferir certidão FGTS": {
    priority: "media",
    category: "Compliance Fiscal",
    description: "Verificar a regularidade do FGTS no Conecte Social e anexar o certificado ao cadastro.",
  },
  "Revisar cláusulas de privacidade (LGPD)": {
    priority: "media",
    category: "Jurídico & Contratos",
    description: "Checar se o contrato prevê tratamento de dados pessoais conforme a LGPD e registrar ajustes.",
  },
  "Atualizar apólice de seguro": {
    priority: "normal",
    category: "Risco Financeiro",
    description: "Solicitar a apólice de responsabilidade civil vigente e conferir a cobertura mínima exigida.",
  },
  "Validar contrato social atualizado": {
    priority: "normal",
    category: "Cadastro",
    description: "Conferir a última alteração contratual na Junta Comercial e atualizar os sócios no cadastro.",
  },
};

const fallbackTemplate: Template = {
  priority: "normal",
  category: "Rotina Operacional",
  description: "Rotina operacional programada para este fornecedor.",
};

// Para as demais tarefas, os dados saem do título e do id: previsíveis (nada é aleatório).
function generateDetails(task: Task): TaskDetails {
  const n = Number(task.id.replace(/\D/g, "")) || 0; // "t12" -> 12
  return {
    ...(templates[task.title] ?? fallbackTemplate),
    assignee: ASSIGNEES[n % ASSIGNEES.length],
  };
}

// Junta: Task oficial + dados extras + dados do fornecedor (pelo unitId).
function toTaskItem(task: Task, suppliers: Map<string, Supplier>): TaskItem {
  const supplier = suppliers.get(task.unitId);

  return {
    ...task,
    ...(figmaDetails[task.id] ?? generateDetails(task)),
    supplierName: supplier?.name ?? "Fornecedor não encontrado",
    supplierCnpj: supplier?.cnpj ?? "—",
    // Unidade inativa = fornecedor bloqueado (a tarefa fica somente leitura no mock).
    supplierBlocked: supplier?.status === "inativa",
  };
}

export function buildTaskItems(tasks: Task[], units: Unit[]): TaskItem[] {
  // Reaproveita o toSupplier da tela de Fornecedores: o CNPJ é o mesmo nas duas telas.
  const suppliers = new Map(units.map((unit) => [unit.id, toSupplier(unit)]));
  return tasks.map((task) => toTaskItem(task, suppliers));
}