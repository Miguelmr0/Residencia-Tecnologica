import { describe, expect, it } from "vitest";
import { SESSION_COOKIE, verifySessionToken } from "@/features/auth/token";
import { DEMO_CREDENTIALS } from "@/mocks/auth";
import { POST } from "./route";

function loginRequest(body: unknown) {
  return new Request("http://localhost/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

const validBody = { ...DEMO_CREDENTIALS, remember: false };

function getSessionCookie(response: Response): string | undefined {
  return response.headers.getSetCookie().find((cookie) => cookie.startsWith(`${SESSION_COOKIE}=`));
}

describe("POST /api/auth/login", () => {
  it("autentica e grava um cookie httpOnly com um JWT válido", async () => {
    const response = await POST(loginRequest(validBody));
    expect(response.status).toBe(200);

    const data = (await response.json()) as { user: Record<string, unknown> };
    expect(data.user.email).toBe(DEMO_CREDENTIALS.email);
    expect(data.user).not.toHaveProperty("password");

    const cookie = getSessionCookie(response);
    expect(cookie).toContain("HttpOnly");
    expect(cookie).toContain("SameSite=lax");
    expect(cookie).not.toContain("Max-Age"); // sem "lembrar": cookie de sessão

    const token = cookie!.split(";")[0].split("=")[1];
    expect(await verifySessionToken(token)).toBe("user-1");
  });

  it("com 'lembrar', o cookie dura 30 dias", async () => {
    const response = await POST(loginRequest({ ...validBody, remember: true }));
    expect(getSessionCookie(response)).toContain(`Max-Age=${30 * 24 * 60 * 60}`);
  });

  it("recusa credenciais erradas com 401 e sem cookie", async () => {
    const response = await POST(loginRequest({ ...validBody, password: "senha-errada-1" }));
    expect(response.status).toBe(401);
    expect(getSessionCookie(response)).toBeUndefined();
  });

  it("valida o corpo no servidor: 400 e sem cookie", async () => {
    const response = await POST(loginRequest({ email: "abc@", password: "123", remember: false }));
    expect(response.status).toBe(400);
    expect(getSessionCookie(response)).toBeUndefined();
  });

  it("recusa um corpo que não é JSON", async () => {
    const response = await POST(loginRequest("isso não é json"));
    expect(response.status).toBe(400);
  });
});