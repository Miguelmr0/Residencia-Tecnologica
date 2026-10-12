import type { Supplier } from "./types";

// Mock só da tela de Fornecedores. Não mexe no src/mocks/db.ts da squad.

// As 4 unidades originais do repasse, com os campos extras.
const base: Supplier[] = [
  {
    id: "u1", name: "Alpha Tecnologia Ltda.", city: "Recife", uf: "PE", manager: "Ana Souza",
    status: "ativa", cnpj: "04.281.932/0001-44", category: "TI & Infraestrutura",
    contactName: "Lucas Ferreira", contactEmail: "lucas@alphatec.com.br",
    score: 98, docsOk: 12, docsTotal: 12,
  },
  {
    id: "u2", name: "Beta Serviços Corporativos", city: "Olinda", uf: "PE", manager: "Carlos Lima",
    status: "em_homologacao", cnpj: "18.902.114/0001-08", category: "Facilities & Manutenção",
    contactName: "Camila Rocha", contactEmail: "camila@betaservicos.com.br",
    score: 82, docsOk: 10, docsTotal: 11,
  },
  {
    id: "u3", name: "Delta Segurança Patrimonial", city: "Caruaru", uf: "PE", manager: "Marta Reis",
    status: "inativa", cnpj: "09.311.554/0001-22", category: "Segurança Física",
    contactName: "Roberto Mendes", contactEmail: "rmendes@deltaseg.com.br",
    score: 54, docsOk: 7, docsTotal: 10,
  },
  {
    id: "u4", name: "Gamma Logística S.A.", city: "Jaboatão", uf: "PE", manager: "Paulo Nunes",
    status: "ativa", cnpj: "33.109.845/0001-19", category: "Armazenagem & Cargas",
    contactName: "Marcos Silva", contactEmail: "msilva@gammalog.com.br",
    score: 92, docsOk: 14, docsTotal: 14,
  },
];

// Peças para gerar mais 26 fornecedores (a paginação precisa de dezenas).
const prefixos = ["Omega", "Sigma", "Lambda", "Kappa", "Atlas", "Vértice", "Horizonte", "Nova", "Prisma", "Aurora", "Titan", "Orion", "Zênite"];
const sufixos = ["Serviços Ltda.", "Comércio S.A."];
const categorias = ["TI & Infraestrutura", "Facilities & Manutenção", "Segurança Física", "Logística e Fretes", "Armazenagem & Cargas", "Consultoria em Cloud", "Obras & Engenharia"];
const cidades = [["Recife", "PE"], ["Olinda", "PE"], ["Caruaru", "PE"], ["Jaboatão", "PE"], ["João Pessoa", "PB"], ["Maceió", "AL"]] as const;
const contatos = ["Camila Rocha", "Vanessa Prado", "Juliana Paes", "Carlos Nobre", "Rafael Dias", "Beatriz Lopes"];
const statusCiclo: Supplier["status"][] = ["ativa", "ativa", "em_homologacao", "ativa", "inativa", "ativa", "em_homologacao"];

// Geração determinística: os mesmos dados a cada recarga.
const gerados: Supplier[] = Array.from({ length: 26 }, (_, i) => {
  const n = i + 5; // continua a numeração depois de u4
  const status = statusCiclo[i % statusCiclo.length];
  const [city, uf] = cidades[i % cidades.length];
  const docsTotal = 6 + (i % 7);
  // Ativa quase sempre regular; em homologação e inativa têm pendências.
  const docsOk =
    status === "ativa" ? docsTotal - (i % 2) : status === "em_homologacao" ? docsTotal - 2 : docsTotal - 3;
  const score = status === "inativa" ? 35 + (i % 25) : 60 + ((i * 7) % 40);

  return {
    id: `u${n}`,
    name: `${prefixos[i % prefixos.length]} ${sufixos[i % sufixos.length]}`,
    city,
    uf,
    manager: contatos[(i + 1) % contatos.length],
    status,
    cnpj: `${String(10 + i).padStart(2, "0")}.${100 + i * 13}.${200 + i * 7}/0001-${String(10 + i).padStart(2, "0")}`,
    category: categorias[i % categorias.length],
    contactName: contatos[i % contatos.length],
    contactEmail: `contato@fornecedor${n}.com.br`,
    score,
    docsOk,
    docsTotal,
  };
});

const suppliers: Supplier[] = [...base, ...gerados];

// Simula a API com meio segundo de atraso, para o loading aparecer.
export async function fetchSuppliers(): Promise<Supplier[]> {
  await new Promise<void>((resolve) => setTimeout(resolve, 500));
  return suppliers;
}