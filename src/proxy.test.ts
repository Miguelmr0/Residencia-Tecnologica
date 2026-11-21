import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { proxy } from "./proxy";
import { SESSION_COOKIE, signSessionToken } from "@/features/auth/token";

async function requestTo(path: string, token?: string) {
  const headers = token ? { cookie: `${SESSION_COOKIE}=${token}` } : undefined;
  return proxy(new NextRequest(`http://localhost:3000${path}`, { headers }));
}

describe("proxy: proteção de rotas", () => {
  it("manda para o login quem não está logado", async () => {
    for (const path of ["/", "/dashboard", "/documentos", "/unidades/3"]) {
      const response = await requestTo(path);
      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toBe("http://localhost:3000/login");
    }
  });

  it("deixa passar quem tem sessão válida", async () => {
    const token = await signSessionToken("user-1", false);
    const response = await requestTo("/dashboard", token);
    expect(response.headers.get("location")).toBeNull();
    expect(response.headers.get("x-middleware-next")).toBe("1");
  });

  it("deixa o login aberto para quem não está logado", async () => {
    const response = await requestTo("/login");
    expect(response.headers.get("x-middleware-next")).toBe("1");
  });

  it("tira do login quem já está logado", async () => {
    const token = await signSessionToken("user-1", false);
    const response = await requestTo("/login", token);
    expect(response.headers.get("location")).toBe("http://localhost:3000/dashboard");
  });

  it("trata cookie adulterado como não logado e apaga o cookie", async () => {
    const response = await requestTo("/dashboard", "token.falso.aqui");
    expect(response.headers.get("location")).toBe("http://localhost:3000/login");
    expect(response.headers.getSetCookie().join(";")).toContain(`${SESSION_COOKIE}=;`);
  });
});