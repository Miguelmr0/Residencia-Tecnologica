import type { Unit } from "@/types";

// SupplierDetails = os dados extras do fornecedor que o Figma mostra.
// Esses dados complementam o tipo Unit oficial da squad,
// sem precisar alterar o tipo compartilhado.
export type SupplierDetails = {
  uf: string; // estado do fornecedor, ex.: "PE"
  cnpj: string; // CNPJ da empresa, ex.: "04.281.932/0001-44"
  category: string; // categoria de atuação, ex.: "TI & Infraestrutura"
  contactName: string; // nome do contato principal
  contactEmail: string; // e-mail do contato principal
  score: number; // pontuação de 0 a 100, usada para indicar o nível de risco
  docsOk: number; // quantidade de documentos regulares
  docsTotal: number; // quantidade total de documentos exigidos
};

// Supplier (fornecedor) = o Unit oficial da squad + os dados extras.
// O operador "&" combina os campos dos dois tipos.
// Assim, o fornecedor mantém os dados oficiais e recebe os campos do Figma.
export type Supplier = Unit & SupplierDetails;