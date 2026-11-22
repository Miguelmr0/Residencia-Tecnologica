import { describe, expect, it } from "vitest";
import { DEMO_CREDENTIALS, findUserByCredentials } from "./auth";

describe("findUserByCredentials", () => {
  it("devolve o usuário quando as credenciais estão corretas", () => {
    const user = findUserByCredentials(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password);
    expect(user?.email).toBe(DEMO_CREDENTIALS.email);
  });

  it("ignora maiúsculas e espaços nas pontas do e-mail", () => {
    const user = findUserByCredentials(`  ${DEMO_CREDENTIALS.email.toUpperCase()}  `, DEMO_CREDENTIALS.password);
    expect(user?.id).toBe("user-1");
  });

  it("recusa senha incorreta e e-mail desconhecido", () => {
    expect(findUserByCredentials(DEMO_CREDENTIALS.email, "senha-errada")).toBeNull();
    expect(findUserByCredentials("outra.pessoa@empresa.com.br", DEMO_CREDENTIALS.password)).toBeNull();
  });

  it("nunca devolve a senha", () => {
    const user = findUserByCredentials(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password);
    expect(user).not.toHaveProperty("password");
  });
});