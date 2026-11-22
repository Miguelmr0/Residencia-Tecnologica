import { describe, expect, it, vi } from "vitest";
import { signSessionToken, verifySessionToken } from "./token";

const DAY_MS = 24 * 60 * 60 * 1000;

describe("token JWT da sessão", () => {
  it("assina e verifica um token válido, devolvendo o id do usuário", async () => {
    const token = await signSessionToken("user-1", false);
    expect(await verifySessionToken(token)).toBe("user-1");
  });

  it("devolve null quando não há token", async () => {
    expect(await verifySessionToken(undefined)).toBeNull();
    expect(await verifySessionToken("")).toBeNull();
  });

  it("rejeita um token adulterado", async () => {
    const token = await signSessionToken("user-1", false);
    const [header, , signature] = token.split(".");
    const forgedPayload = Buffer.from(JSON.stringify({ sub: "user-999", exp: 9999999999 })).toString("base64url");
    expect(await verifySessionToken(`${header}.${forgedPayload}.${signature}`)).toBeNull();
  });

  it("rejeita um token assinado com outra chave", async () => {
    vi.stubEnv("SESSION_SECRET", "outra-chave-secreta-com-mais-de-32-caracteres");
    const foreignToken = await signSessionToken("user-1", false);
    vi.unstubAllEnvs();
    expect(await verifySessionToken(foreignToken)).toBeNull();
  });

  it("rejeita um token expirado (8 horas, sem 'lembrar')", async () => {
    const expired = await signSessionToken("user-1", false, new Date(Date.now() - 2 * DAY_MS));
    expect(await verifySessionToken(expired)).toBeNull();
  });

  it("com 'lembrar', um token de 2 dias atrás ainda vale (30 dias)", async () => {
    const token = await signSessionToken("user-1", true, new Date(Date.now() - 2 * DAY_MS));
    expect(await verifySessionToken(token)).toBe("user-1");
  });

  it("rejeita um token sem assinatura (alg none)", async () => {
    const header = Buffer.from(JSON.stringify({ alg: "none", typ: "JWT" })).toString("base64url");
    const payload = Buffer.from(JSON.stringify({ sub: "user-1", exp: 9999999999 })).toString("base64url");
    expect(await verifySessionToken(`${header}.${payload}.`)).toBeNull();
  });
});