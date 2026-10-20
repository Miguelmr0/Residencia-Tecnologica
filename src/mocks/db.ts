import type { Task, TaskStatus, Unit, UnitDocument, Contract } from "@/types";

const units: Unit[] = [
  { id: "u1", name: "Alpha Tecnologia Ltda.", city: "Recife", manager: "Ana Souza", status: "ativa" },
  { id: "u2", name: "Beta Serviços Corporativos", city: "Olinda", manager: "Carlos Lima", status: "em_homologacao" },
  { id: "u3", name: "Delta Segurança Patrimonial", city: "Caruaru", manager: "Marta Reis", status: "inativa" },
  { id: "u4", name: "Gamma Logística S.A.", city: "Jaboatão", manager: "Paulo Nunes", status: "ativa" },
];

const documents: UnitDocument[] = [
  { id: "d1", unitId: "u1", title: "Certidão Negativa (CND Federal)", expiresAt: "2027-03-10" },
  { id: "d2", unitId: "u1", title: "Certificado ISO 9001", expiresAt: "2026-10-16" },
  { id: "d3", unitId: "u3", title: "Alvará de Funcionamento", expiresAt: "2026-09-02" },
  { id: "d4", unitId: "u4", title: "Seguro de Responsabilidade Civil", expiresAt: "2026-12-30" },
];

let tasks: Task[] = [
  { id: "t1", unitId: "u1", title: "Renovar certidão", status: "pendente", dueDate: "2026-10-12" },
  { id: "t2", unitId: "u2", title: "Revisar aditivo contratual", status: "em_andamento", dueDate: "2026-10-20" },
  { id: "t3", unitId: "u4", title: "Atualizar cadastro bancário", status: "concluida", dueDate: "2026-09-30" },
  { id: "t4", unitId: "u3", title: "Encerrar pendências", status: "pendente", dueDate: "2026-11-05" },
];

const contracts: Contract[] = [
  { id: "c1", code: "CTR-2024-0104", object: "Prestação de Serviços de Suporte Cloud & Dev", supplierName: "Alpha Tecnologia Ltda", supplierCnpj: "18.234.901/0001-44", type: "Serviço", monthlyValue: 45000, annualValue: 540000, startDate: "2024-09-26", endDate: "2026-09-26", readjustmentIndex: "IPCA", nextReadjustmentDate: "2026-09-26", responsible: "Mariana Silva", status: "a_renovar" },
  { id: "c2", code: "CTR-2023-0078", object: "Serviços Integrados de Facilities e Manutenção Predial", supplierName: "Zeta Engenharia e Reformas", supplierCnpj: "04.551.789/0001-12", type: "Serviço", monthlyValue: 62000, annualValue: 744000, startDate: "2023-10-08", endDate: "2026-10-08", readjustmentIndex: "IGP-M", nextReadjustmentDate: "2026-10-08", responsible: "Carlos Souza", status: "a_renovar" },
  { id: "c3", code: "CTR-2022-0033", object: "Acordo de Nível de Serviço (SLA) de Segurança Patrimonial", supplierName: "Alfa Segurança Patrimonial", supplierCnpj: "31.902.115/0001-89", type: "SLA", monthlyValue: 28500, annualValue: 342000, startDate: "2022-09-09", endDate: "2026-09-09", readjustmentIndex: "IPCA", nextReadjustmentDate: "2026-09-09", responsible: "Carlos Souza", status: "vencido" },
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

export async function fetchTasks(): Promise<Task[]> {
  await delay();
  return tasks;
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