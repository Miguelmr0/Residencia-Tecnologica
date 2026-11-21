import type { Task, TaskStatus, Unit, UnitDocument, Contract, Historico } from "@/types";

const baseUnits: Unit[] = [
  { id: "u1", name: "Alpha Tecnologia Ltda.", city: "Recife", manager: "Ana Souza", status: "ativa" },
  { id: "u2", name: "Beta Serviços Corporativos", city: "Olinda", manager: "Carlos Lima", status: "em_homologacao" },
  { id: "u3", name: "Delta Segurança Patrimonial", city: "Caruaru", manager: "Marta Reis", status: "inativa" },
  { id: "u4", name: "Gamma Logística S.A.", city: "Jaboatão", manager: "Paulo Nunes", status: "ativa" },
];

// Mais 26 unidades para testar a paginação (o PDF pede dezenas de unidades).
// Geradas de forma previsível: são sempre as mesmas a cada recarga.
const prefixes = ["Omega", "Sigma", "Lambda", "Kappa", "Atlas", "Vértice", "Horizonte", "Nova", "Prisma", "Aurora", "Titan", "Orion", "Zênite"];
const suffixes = ["Serviços Ltda.", "Comércio S.A."];
const cities = ["Recife", "Olinda", "Caruaru", "Jaboatão", "João Pessoa", "Maceió"];
const managers = ["Camila Rocha", "Vanessa Prado", "Juliana Paes", "Carlos Nobre", "Rafael Dias", "Beatriz Lopes"];
const statusCycle: Unit["status"][] = ["ativa", "ativa", "em_homologacao", "ativa", "inativa", "ativa", "em_homologacao"];

const generatedUnits: Unit[] = Array.from({ length: 26 }, (_, i) => ({
  id: `u${i + 5}`,
  name: `${prefixes[i % prefixes.length]} ${suffixes[Math.floor(i / prefixes.length)]}`,
  city: cities[i % cities.length],
  manager: managers[(i + 1) % managers.length],
  status: statusCycle[i % statusCycle.length],
}));

const units: Unit[] = [...baseUnits, ...generatedUnits];

const documents: UnitDocument[] = [
  { id: "d1", unitId: "u1", title: "Certidão Negativa (CND Federal)", expiresAt: "2027-03-10" },
  { id: "d2", unitId: "u1", title: "Certificado ISO 9001", expiresAt: "2026-10-16" },
  { id: "d3", unitId: "u3", title: "Alvará de Funcionamento", expiresAt: "2026-09-02" },
  { id: "d4", unitId: "u4", title: "Seguro de Responsabilidade Civil", expiresAt: "2026-12-30" },
];

const baseTasks: Task[] = [
  { id: "t1", unitId: "u1", title: "Renovar certidão", status: "pendente", dueDate: "2026-10-12" },
  { id: "t2", unitId: "u2", title: "Revisar aditivo contratual", status: "em_andamento", dueDate: "2026-10-20" },
  { id: "t3", unitId: "u4", title: "Atualizar cadastro bancário", status: "concluida", dueDate: "2026-09-30" },
  { id: "t4", unitId: "u3", title: "Encerrar pendências", status: "pendente", dueDate: "2026-11-05" },
];

// Mais 32 tarefas para testar a paginação e os filtros da tela de Tarefas.
// Os prazos são relativos a HOJE (de 3 dias atrás até 11 dias à frente), assim a
// demonstração sempre mostra tarefas atrasadas, de hoje e futuras.
const taskTitles = [
  "Solicitar novo balanço patrimonial",
  "Validar documentação de homologação",
  "Agendar auditoria presencial de segurança",
  "Notificar fornecedor sobre licença ambiental",
  "Conferir certidão FGTS",
  "Revisar cláusulas de privacidade (LGPD)",
  "Atualizar apólice de seguro",
  "Validar contrato social atualizado",
];
const taskStatusCycle: TaskStatus[] = [
  "pendente", "em_andamento", "pendente", "concluida", "em_andamento", "pendente", "pendente",
];

// Data de hoje + N dias, no formato "AAAA-MM-DD".
function isoDaysFromToday(days: number): string {
  return new Date(Date.now() + days * 86_400_000).toISOString().slice(0, 10);
}

const generatedTasks: Task[] = Array.from({ length: 32 }, (_, i) => ({
  id: `t${i + 5}`,
  unitId: `u${((i * 7) % 30) + 1}`, // u1 até u30, espalhadas entre os fornecedores
  title: taskTitles[i % taskTitles.length],
  status: taskStatusCycle[i % taskStatusCycle.length],
  dueDate: isoDaysFromToday((i % 15) - 3),
}));

let tasks: Task[] = [...baseTasks, ...generatedTasks];

let contracts: Contract[] = [
  { id: "c1", code: "CTR-2024-0104", object: "Prestação de Serviços de Suporte Cloud & Dev", supplierName: "Alpha Tecnologia Ltda", supplierCnpj: "18.234.901/0001-44", type: "Serviço", monthlyValue: 45000, annualValue: 540000, startDate: "2024-09-26", endDate: "2026-09-26", readjustmentIndex: "IPCA", nextReadjustmentDate: "2026-09-26", responsible: "Mariana Silva", status: "a_renovar" },
  { id: "c2", code: "CTR-2023-0078", object: "Serviços Integrados de Facilities e Manutenção Predial", supplierName: "Zeta Engenharia e Reformas", supplierCnpj: "04.551.789/0001-12", type: "Serviço", monthlyValue: 62000, annualValue: 744000, startDate: "2023-10-08", endDate: "2026-10-08", readjustmentIndex: "IGP-M", nextReadjustmentDate: "2026-10-08", responsible: "Carlos Souza", status: "a_renovar" },
  { id: "c3", code: "CTR-2022-0033", object: "Acordo de Nível de Serviço (SLA) de Segurança Patrimonial", supplierName: "Alfa Segurança Patrimonial", supplierCnpj: "31.902.115/0001-89", type: "SLA", monthlyValue: 28500, annualValue: 342000, startDate: "2022-09-09", endDate: "2026-09-09", readjustmentIndex: "IPCA", nextReadjustmentDate: "2026-09-09", responsible: "Carlos Souza", status: "vencido" },
];

const historico: Historico[] = [
  { id: "a1", timestamp: "2026-01-16T10:32:04-03:00", actorName: "Mariana Silva", actorRole: "Compras / Admin", origin: "usuario", supplierName: "Alpha Tecnologia Ltda", supplierCnpj: "12.345.678/0001-90", type: "Documento", action: "Atualização de Documento", description: "Certidão Negativa (CND Federal) anexada e enviada para validação", ipAddress: "177.18.204.12", detail: "Status: Em Análise Compliance", level: "sucesso" },
  { id: "a2", timestamp: "2026-09-15T16:45:19-03:00", actorName: "Carlos Souza", actorRole: "Jurídico / Governança", origin: "usuario", supplierName: "Beta Serviços Corporativos", supplierCnpj: "98.765.432/0001-11", type: "Tarefa", action: "Conclusão de Tarefa Contratual", description: "Revisão e aprovação do Aditivo Contratual 02 (Cláusulas de SLA)", ipAddress: "189.22.45.101", detail: "Assinatura Digital ICP-Brasil", level: "sucesso" },
  { id: "a3", timestamp: "2026-09-15T09:00:00-03:00", actorName: "Robô de Vencimentos", actorRole: "Automação / Compliance", origin: "robo", supplierName: "Alpha Tecnologia Ltda", supplierCnpj: "12.345.678/0001-90", type: "Alerta", action: "Documento Próximo do Vencimento", description: "Certificado ISO 9001 vence em 31 dias", ipAddress: "10.12.0.8", detail: "Notificação enviada ao responsável", level: "alerta" },
  { id: "a4", timestamp: "2026-09-14T14:20:37-03:00", actorName: "Robô de Conformidade", actorRole: "Automação / Compliance", origin: "robo", supplierName: "Delta Segurança Patrimonial", supplierCnpj: "45.321.987/0001-60", type: "Bloqueio", action: "Bloqueio Preventivo Executado", description: "Alvará de Funcionamento expirado. Novas tarefas bloqueadas", ipAddress: "10.12.0.9", detail: "Status: Fornecedor inativo", level: "critico" },
  { id: "a5", timestamp: "2026-09-13T11:05:52-03:00", actorName: "Mariana Silva", actorRole: "Compras / Admin", origin: "usuario", supplierName: "Gamma Logística S.A.", supplierCnpj: "27.654.321/0001-05", type: "Cadastro", action: "Alteração Cadastral", description: "Dados bancários do fornecedor atualizados", ipAddress: "177.18.204.12", detail: "Status: Aguardando validação", level: "informativo" },
  { id: "a6", timestamp: "2026-09-12T08:15:00-03:00", actorName: "Motor de Regras", actorRole: "Sistema", origin: "sistema", supplierName: "Gamma Logística S.A.", supplierCnpj: "27.654.321/0001-05", type: "Documento", action: "Validação de Documento", description: "Seguro de Responsabilidade Civil validado automaticamente", ipAddress: "10.12.0.2", detail: "Carimbo de tempo RFC 3161", level: "sucesso" },
  { id: "a7", timestamp: "2026-09-10T17:40:11-03:00", actorName: "Carlos Souza", actorRole: "Jurídico / Governança", origin: "usuario", supplierName: "Beta Serviços Corporativos", supplierCnpj: "98.765.432/0001-11", type: "Cadastro", action: "Alteração de Status do Fornecedor", description: "Fornecedor movido para Em Homologação", ipAddress: "189.22.45.101", detail: "Status: Em Homologação", level: "informativo" },
];

const delay = (ms = 500) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export async function fetchUnits(): Promise<Unit[]> {
  await delay();
  return units;
}

export async function fetchDocuments(): Promise<UnitDocument[]> {
  await delay();
  return documents;
}

export async function fetchContracts(): Promise<Contract[]> {
  await delay();
  return contracts;
}

export async function createContract(data: Omit<Contract, "id">): Promise<Contract> {
  await delay(300);
  const newContract: Contract = { ...data, id: `c${contracts.length + 1}` };
  contracts = [...contracts, newContract];
  return newContract;
}

export async function fetchTasks(): Promise<Task[]> {
  await delay();
  return tasks;
}



export async function createTask(
  data: Omit<Task, "id">
): Promise<Task> {
  await delay(300);

  const unit = units.find((u) => u.id === data.unitId);

  if (!unit) {
    throw new Error("Unidade não encontrada");
  }

  if (unit.status === "inativa") {
    throw new Error("Unidade inativa: não é possível criar tarefas");
  }

  const newTask: Task = {
    id: `t${Math.max(0, ...tasks.map((t) => Number(t.id.slice(1)))) + 1}`,
    ...data,
  };

  tasks = [...tasks, newTask];

  return newTask;
}

export async function fetchHistorico(): Promise<Historico[]> {
  await delay();
  return historico;
}

export async function updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
  await delay(300);
  const task = tasks.find((t) => t.id === id);
  if (!task) throw new Error("Tarefa não encontrada");

  const unit = units.find((u) => u.id === task.unitId);
  if (unit?.status === "inativa") {
    throw new Error("Unidade inativa: a tarefa é somente leitura");
  }

  const updated: Task = { ...task, status };
  tasks = tasks.map((t) => (t.id === id ? updated : t));
  return updated;
}