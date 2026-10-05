import type { Task, TaskStatus, Unit, UnitDocument } from "@/types";

const units: Unit[] = [
  { id: "u1", name: "Alpha Tecnologia Ltda.", city: "Recife", manager: "Ana Souza", status: "ativa" },
  { id: "u2", name: "Beta Serviços Corporativos", city: "Olinda", manager: "Carlos Lima", status: "em_homologacao" },
  { id: "u3", name: "Delta Segurança Patrimonial", city: "Caruaru", manager: "Marta Reis", status: "inativa" },
  { id: "u4", name: "Gamma Logística S.A.", city: "Jaboatão", manager: "Paulo Nunes", status: "ativa" },
];

const documents: UnitDocument[] = [
  { id: "d1", unitId: "u1", title: "Certidão Negativa (CND Federal)", expiresAt: "2027-03-10" },
  { id: "d2", unitId: "u1", title: "Certificado ISO 9001", expiresAt: "2026-10-10" },
  { id: "d3", unitId: "u3", title: "Alvará de Funcionamento", expiresAt: "2026-09-02" },
  { id: "d4", unitId: "u4", title: "Seguro de Responsabilidade Civil", expiresAt: "2026-12-30" },
];

let tasks: Task[] = [
  { id: "t1", unitId: "u1", title: "Renovar certidão", status: "pendente", dueDate: "2026-10-12" },
  { id: "t2", unitId: "u2", title: "Revisar aditivo contratual", status: "em_andamento", dueDate: "2026-10-20" },
  { id: "t3", unitId: "u4", title: "Atualizar cadastro bancário", status: "concluida", dueDate: "2026-09-30" },
  { id: "t4", unitId: "u3", title: "Encerrar pendências", status: "pendente", dueDate: "2026-11-05" },
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