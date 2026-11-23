import { describe, expect, it } from "vitest";
import { formatCnpj, newSupplierSchema, onlyDigits } from "./schema";

// Cadastro válido de base; cada teste muda só o campo que quer testar
const valid = {
  name: "Alpha Tecnologia Ltda.",
  cnpj: "04.281.932/0001-44",
  category: "TI & Infraestrutura",
  uf: "PE",
  city: "Recife",
  manager: "Ana Souza",
  contactName: "Lucas Ferreira",
  contactEmail: "lucas@alphatec.com.br",
};

describe("newSupplierSchema", () => {
  it("aceita um cadastro completo e válido", () => {
    expect(newSupplierSchema.safeParse(valid).success).toBe(true);
  });

  it("aceita o CNPJ sem pontuação", () => {
    expect(newSupplierSchema.safeParse({ ...valid, cnpj: "04281932000144" }).success).toBe(true);
  });

  it("recusa CNPJ com menos de 14 números", () => {
    const result = newSupplierSchema.safeParse({ ...valid, cnpj: "04.281.932/0001" });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0].message).toBe("O CNPJ deve ter 14 números.");
  });

  it("recusa e-mail inválido", () => {
    const result = newSupplierSchema.safeParse({ ...valid, contactEmail: "lucas@" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Digite um e-mail válido, como nome@empresa.com.br.");
    }
  });

  it("recusa razão social vazia", () => {
    expect(newSupplierSchema.safeParse({ ...valid, name: "" }).success).toBe(false);
  });
});

describe("CNPJ", () => {
  it("onlyDigits tira a pontuação", () => {
    expect(onlyDigits("04.281.932/0001-44")).toBe("04281932000144");
  });

  it("formatCnpj aplica a máscara", () => {
    expect(formatCnpj("04281932000144")).toBe("04.281.932/0001-44");
  });
});