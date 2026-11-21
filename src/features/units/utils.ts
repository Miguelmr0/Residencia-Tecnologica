import type { Supplier } from "./types";

// ---------- Tipos ----------
export type SupplierStatus = Supplier["status"];
export type StatusFilter = "todos" | SupplierStatus;
export type RiskLevel = "baixo" | "medio" | "alto";
export type RiskFilter = "todos" | RiskLevel;
export type SuppliersView = "tabela" | "cards";

// Todos os filtros da tela num único objeto (estado de interface, vai em useState).
export type SupplierFilters = {
  search: string;
  status: StatusFilter;
  category: string; // "todos" ou o nome da categoria
  risk: RiskFilter;
  uf: string; // "todos" ou a sigla
};

export const EMPTY_FILTERS: SupplierFilters = {
  search: "",
  status: "todos",
  category: "todos",
  risk: "todos",
  uf: "todos",
};

export type SupplierStats = {
  total: number;
  ativas: number;
  emHomologacao: number;
  inativas: number;
  taxaConformidade: number; // % de fornecedores ativos
  aguardandoDocs: number; // em homologação com documento pendente
};

// ---------- Textos exibidos ----------
// No código o status é "ativa" etc.; na interface mostramos o texto do Figma.
export const STATUS_LABEL: Record<SupplierStatus, string> = {
  ativa: "Ativo",
  em_homologacao: "Em Homologação",
  inativa: "Inativo",
};

export const RISK_LABEL: Record<RiskLevel, string> = {
  baixo: "Baixo Risco",
  medio: "Médio Risco",
  alto: "Alto Risco",
};

// ---------- Regras ----------

// Nível de risco calculado pelo score (nunca guardado).
export function getRiskLevel(score: number): RiskLevel {
  if (score >= 85) return "baixo";
  if (score >= 60) return "medio";
  return "alto";
}

// "Alpha Tecnologia Ltda." -> "AT" (avatar da empresa).
export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

// Aplica todos os filtros de uma vez.
export function filterSuppliers(suppliers: Supplier[], filters: SupplierFilters): Supplier[] {
  const term = filters.search.trim().toLowerCase();
  const digits = term.replace(/\D/g, ""); // permite buscar CNPJ sem pontuação
  // Só procura no CNPJ se o texto tiver apenas números e pontuação
  const looksLikeCnpj = /^[\d.\s/-]+$/.test(term);

  return suppliers.filter((s) => {

    const matchSearch =
      term === "" ||
      s.name.toLowerCase().includes(term) ||
      (looksLikeCnpj && digits !== "" && s.cnpj.replace(/\D/g, "").includes(digits));
    const matchStatus = filters.status === "todos" || s.status === filters.status;
    const matchCategory = filters.category === "todos" || s.category === filters.category;
    const matchRisk = filters.risk === "todos" || getRiskLevel(s.score) === filters.risk;
    const matchUf = filters.uf === "todos" || s.uf === filters.uf;
    return matchSearch && matchStatus && matchCategory && matchRisk && matchUf;
  });
}

// Números dos 4 cards do topo. Sempre derivados da lista, nunca fixos.
export function getSupplierStats(suppliers: Supplier[]): SupplierStats {
  const ativas = suppliers.filter((s) => s.status === "ativa").length;
  const emHomologacao = suppliers.filter((s) => s.status === "em_homologacao");
  const inativas = suppliers.filter((s) => s.status === "inativa").length;

  return {
    total: suppliers.length,
    ativas,
    emHomologacao: emHomologacao.length,
    inativas,
    taxaConformidade: suppliers.length === 0 ? 0 : Math.round((ativas / suppliers.length) * 1000) / 10,
    aguardandoDocs: emHomologacao.filter((s) => s.docsOk < s.docsTotal).length,
  };
}

// Lista sem repetição e em ordem alfabética (usada nos selects de filtro).
export function uniqueSorted(values: string[]): string[] {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b, "pt-BR"));
}

// Baixa um CSV no navegador (botões "Exportar").
export function exportSuppliersToCsv(suppliers: Supplier[], filename = "fornecedores.csv"): void {
  const header = ["Razão social", "CNPJ", "Categoria", "Contato", "E-mail", "Score", "Status"];
  const rows = suppliers.map((s) => [
    s.name, s.cnpj, s.category, s.contactName, s.contactEmail, String(s.score), STATUS_LABEL[s.status],
  ]);
  const csv = [header, ...rows]
    .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(";"))
    .join("\n");

  // \uFEFF faz o Excel abrir os acentos corretamente.
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}