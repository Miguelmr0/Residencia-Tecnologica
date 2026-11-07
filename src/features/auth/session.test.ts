import { describe, expect, it } from "vitest";
import { createSession, isSessionActive } from "./session";
import type { SessionUser } from "./types";

const user: SessionUser = {
  id: "user-1",
  name: "Mariana Silva",
  email: "admin@vendorhub.com.br",
  role: "Compras / Admin",
};

const now = 1_000_000;

describe("createSession", () => {
  it("dura 30 dias quando o usuário pede para lembrar o dispositivo", () => {
    expect(createSession(user, true, now).expiresAt).toBe(now + 30 * 24 * 60 * 60 * 1000);
  });

  it("dura 8 horas quando não pede para lembrar", () => {
    expect(createSession(user, false, now).expiresAt).toBe(now + 8 * 60 * 60 * 1000);
  });
});

describe("isSessionActive", () => {
  it("está ativa antes de expirar e inativa a partir do horário de expiração", () => {
    const session = createSession(user, false, now);
    expect(isSessionActive(session, session.expiresAt - 1)).toBe(true);
    expect(isSessionActive(session, session.expiresAt)).toBe(false);
  });
});