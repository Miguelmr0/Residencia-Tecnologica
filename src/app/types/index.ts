export type UnitStatus = "ativa" | "inativa" | "em_homologacao";

export interface Unit {
  id: string;
  name: string;
  city: string;
  manager: string;
  status: UnitStatus;
}
export type DocumentStatus = "valido" | "proximo_vencimento" | "expirado";

export interface UnitDocument {
  id: string;
  unitId: string;
  title: string;
  expiresAt: string; 
}
export type TaskStatus = "pendente" | "em_andamento" | "concluida";

export interface Task {
  id: string;
  unitId: string;
  title: string;
  status: TaskStatus;
  dueDate: string; 
}
//NÃO MEXER//