import type { Unit } from "@/types";

// Supplier (fornecedor) = o Unit oficial da squad + os campos extras que o Figma mostra.
// Assim o tipo da squad continua intacto, e você não mexe em nada compartilhado.
export type Supplier = Unit & {
  uf: string; // estado, ex.: "PE"
  cnpj: string; // ex.: "04.281.932/0001-44"
  category: string; // ex.: "TI & Infraestrutura"
  contactName: string; // nome do contato principal
  contactEmail: string; // e-mail do contato principal
  score: number; // de 0 a 100, define o nível de risco
  docsOk: number; // quantidade de documentos regulares
  docsTotal: number; // total de documentos exigidos
};