import { describe, expect, it } from "vitest";
import type { Supplier } from "./types";
import { EMPTY_FILTERS, filterSuppliers, getRiskLevel } from "./utils";

// Monta um fornecedor completo; cada teste só informa o que quer mudar
function makeSupplier(overrides: Partial<Supplier> = {}): Supplier {
  return {
    id: "u1",
    name: "Alpha Tecnologia Ltda.",
    city: "Recife",
    manager: "Ana Souza",
    status: "ativa",
    uf: "PE",
    cnpj: "04.281.932/0001-44",
    category: "TI & Infraestrutura",
    contactName: "Lucas Ferreira",
    contactEmail: "lucas@alphatec.com.br",
    score: 98,
    docsOk: 12,
    docsTotal: 12,
    ...overrides, // os campos informados sobrescrevem os padrões
  };
}

describe("getRiskLevel", () => {
  // Testamos as bordas, como nos testes do document-status
  it("85 ou mais é baixo risco", () => {
    expect(getRiskLevel(85)).toBe("baixo");
  });

  it("84 é médio risco", () => {
    expect(getRiskLevel(84)).toBe("medio");
  });

  it("60 é médio risco", () => {
    expect(getRiskLevel(60)).toBe("medio");
  });

  it("59 é alto risco", () => {
    expect(getRiskLevel(59)).toBe("alto");
  });
});

describe("filterSuppliers", () => {
  const alpha = makeSupplier();
  const delta = makeSupplier({
    id: "u3",
    name: "Delta Segurança Patrimonial",
    status: "inativa",
    cnpj: "09.311.554/0001-22",
    score: 54,
  });
  const lista = [alpha, delta];

  it("sem filtros devolve todos", () => {
    expect(filterSuppliers(lista, EMPTY_FILTERS)).toHaveLength(2);
  });

  it("busca pelo nome ignorando maiúsculas", () => {
    const result = filterSuppliers(lista, { ...EMPTY_FILTERS, search: "ALPHA" });
    expect(result).toEqual([alpha]);
  });

  it("busca pelo CNPJ sem pontuação", () => {
    const result = filterSuppliers(lista, { ...EMPTY_FILTERS, search: "09311554" });
    expect(result).toEqual([delta]);
  });

  it("filtra por status", () => {
    const result = filterSuppliers(lista, { ...EMPTY_FILTERS, status: "inativa" });
    expect(result).toEqual([delta]);
  });

  it("filtra por grau de risco calculado pelo score", () => {
    const result = filterSuppliers(lista, { ...EMPTY_FILTERS, risk: "alto" });
    expect(result).toEqual([delta]);
  });

  it("texto com letras e números não é tratado como CNPJ", () => {
    const result = filterSuppliers(lista, { ...EMPTY_FILTERS, search: "alpha 2" });
    expect(result).toEqual([]);
  });

  it("CNPJ com pontuação continua funcionando", () => {
    const result = filterSuppliers(lista, { ...EMPTY_FILTERS, search: "04.281.932/0001-44" });
    expect(result).toEqual([alpha]);
  });
});