import type { Unit } from "@/types";
import type { Supplier, SupplierDetails } from "./types";

// O Unit oficial só tem nome, cidade, gerente e status. O Figma mostra mais
// coisas (CNPJ, categoria, contato, score, documentos). Esses dados extras
// ficam aqui, ligados ao id da unidade, sem alterar o tipo da squad.

// Os 4 fornecedores que já existem no mock oficial, com os dados do Figma.
const figmaDetails: Record<string, SupplierDetails> = {
  u1: {
    uf: "PE", cnpj: "04.281.932/0001-44", category: "TI & Infraestrutura",
    contactName: "Lucas Ferreira", contactEmail: "lucas@alphatec.com.br",
    score: 98, docsOk: 12, docsTotal: 12,
  },
  u2: {
    uf: "PE", cnpj: "18.902.114/0001-08", category: "Facilities & Manutenção",
    contactName: "Camila Rocha", contactEmail: "camila@betaservicos.com.br",
    score: 82, docsOk: 10, docsTotal: 11,
  },
  u3: {
    uf: "PE", cnpj: "09.311.554/0001-22", category: "Segurança Física",
    contactName: "Roberto Mendes", contactEmail: "rmendes@deltaseg.com.br",
    score: 54, docsOk: 7, docsTotal: 10,
  },
  u4: {
    uf: "PE", cnpj: "33.109.845/0001-19", category: "Armazenagem & Cargas",
    contactName: "Marcos Silva", contactEmail: "msilva@gammalog.com.br",
    score: 92, docsOk: 14, docsTotal: 14,
  },
};

// Para as demais unidades, os dados são gerados de forma previsível a partir
// do id: sempre os mesmos a cada recarga (nada é aleatório).
const categories = [
  "TI & Infraestrutura", "Facilities & Manutenção", "Segurança Física",
  "Logística e Fretes", "Armazenagem & Cargas", "Consultoria em Cloud", "Obras & Engenharia",
];
const contacts = ["Camila Rocha", "Vanessa Prado", "Juliana Paes", "Carlos Nobre", "Rafael Dias", "Beatriz Lopes"];
const ufByCity: Record<string, string> = {
  Recife: "PE", Olinda: "PE", Caruaru: "PE", Jaboatão: "PE", "João Pessoa": "PB", Maceió: "AL",
};

function generateDetails(unit: Unit): SupplierDetails {
  const n = Number(unit.id.replace(/\D/g, "")) || 0; // "u12" -> 12
  const docsTotal = 6 + (n % 7);
  // Ativa quase sempre regular; em homologação e inativa têm pendências.
  const docsOk =
    unit.status === "ativa" ? docsTotal - (n % 2) : unit.status === "em_homologacao" ? docsTotal - 2 : docsTotal - 3;
  const score = unit.status === "inativa" ? 35 + (n % 25) : 60 + ((n * 7) % 40);
  const dd = String(10 + (n % 90));

  return {
    uf: ufByCity[unit.city] ?? "PE",
    cnpj: `${dd}.${100 + ((n * 13) % 900)}.${200 + ((n * 7) % 800)}/0001-${dd}`,
    category: categories[n % categories.length],
    contactName: contacts[n % contacts.length],
    contactEmail: `contato@fornecedor${n}.com.br`,
    score,
    docsOk,
    docsTotal,
  };
}

// Junta o Unit oficial com os dados extras.
export function toSupplier(unit: Unit): Supplier {
  return { ...unit, ...(figmaDetails[unit.id] ?? generateDetails(unit)) };
}

export function toSuppliers(units: Unit[]): Supplier[] {
  return units.map(toSupplier);
}