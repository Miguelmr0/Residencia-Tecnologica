import { describe, expect, it } from "vitest";
import { loginSchema } from "./schema";

const valid = { email: "admin@vendedorhub.com.br", password: "hubadmin", remember: false };

function firstMessage(input: Record<string, unknown>, field: string): string | null {
  const result = loginSchema.safeParse(input);
  if (result.success) return null;
  return result.error.issues.find((issue) => issue.path[0] === field)?.message ?? null;
}

describe("loginSchema", () => {
  it("aceita e-mail e senha válidos", () => {
    expect(loginSchema.safeParse(valid).success).toBe(true);
  });

  it("pede o e-mail quando está vazio ou só com espaços", () => {
    expect(firstMessage({ ...valid, email: "" }, "email")).toBe("Informe seu e-mail corporativo.");
    expect(firstMessage({ ...valid, email: "   " }, "email")).toBe("Informe seu e-mail corporativo.");
  });

  it("rejeita e-mail em formato inválido", () => {
    expect(firstMessage({ ...valid, email: "admin@" }, "email")).toBe(
      "Digite um e-mail válido, como nome@empresa.com.br."
    );
  });

  it("pede a senha quando está vazia", () => {
    expect(firstMessage({ ...valid, password: "" }, "password")).toBe("Informe sua senha.");
  });

  it("rejeita senha com menos de 8 caracteres", () => {
    expect(firstMessage({ ...valid, password: "1234567" }, "password")).toBe(
      "A senha deve ter pelo menos 8 caracteres."
    );
  });

    it("remove espaços nas pontas do e-mail", () => {
    const result = loginSchema.safeParse({ ...valid, email: `  ${valid.email}  ` });
    expect(result.success && result.data.email).toBe(valid.email);
  });
});