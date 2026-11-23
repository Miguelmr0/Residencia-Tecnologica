import { describe, expect, it } from "vitest";
import { createSupplier, fetchUnits, getCreatedSupplierDetails } from "./db";

const input = {
  name: "Teste Fornecedor Ltda.",
  city: "Recife",
  manager: "Ana Souza",
  status: "em_homologacao",
  uf: "PE",
  cnpj: "11.222.333/0001-44",
  category: "TI & Infraestrutura",
  contactName: "Lucas Ferreira",
  contactEmail: "lucas@teste.com.br",
  score: 60,
  docsOk: 0,
  docsTotal: 10,
} as const;

describe("createSupplier", () => {
  it("cria a unidade com um id novo, em homologação", async () => {
    const before = (await fetchUnits()).map((u) => u.id);
    const created = await createSupplier(input);
    expect(before).not.toContain(created.id);
    expect(created.status).toBe("em_homologacao");
  });

  it("a unidade criada aparece na lista", async () => {
    const created = await createSupplier({ ...input, name: "Outro Fornecedor Ltda." });
    const list = await fetchUnits();
    expect(list.find((u) => u.id === created.id)?.name).toBe("Outro Fornecedor Ltda.");
  });

  it("guarda os dados extras ligados ao id", async () => {
    const created = await createSupplier(input);
    expect(getCreatedSupplierDetails(created.id)).toMatchObject({
      cnpj: "11.222.333/0001-44",
      category: "TI & Infraestrutura",
      contactEmail: "lucas@teste.com.br",
    });
  });
});