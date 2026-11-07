import { describe, expect, it } from "vitest";
import { DEMO_CREDENTIALS, InvalidCredentialsError, loginRequest } from "./auth";

describe("loginRequest", () => {
  it("devolve o usuário quando as credenciais estão corretas", async () => {
    const user = await loginRequest(DEMO_CREDENTIALS);
    expect(user.email).toBe(DEMO_CREDENTIALS.email);
    expect(user).not.toHaveProperty("password");
  });

  it("ignora maiúsculas e espaços nas pontas do e-mail", async () => {
    const user = await loginRequest({
      email: `  ${DEMO_CREDENTIALS.email.toUpperCase()}  `,
      password: DEMO_CREDENTIALS.password,
    });
    expect(user.email).toBe(DEMO_CREDENTIALS.email);
  });

  it("recusa senha incorreta", async () => {
    await expect(
      loginRequest({ email: DEMO_CREDENTIALS.email, password: "senha-errada-1" })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("recusa e-mail desconhecido", async () => {
    await expect(
      loginRequest({ email: "outra.pessoa@empresa.com.br", password: DEMO_CREDENTIALS.password })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});