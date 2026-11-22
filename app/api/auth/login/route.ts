import { NextResponse } from "next/server";
import { loginSchema } from "@/features/auth/schema";
import { REMEMBER_SESSION_SECONDS, SESSION_COOKIE, signSessionToken } from "@/features/auth/token";
import { findUserByCredentials } from "@/mocks/auth";

// Simula a demora de uma rede real, para a tela mostrar o estado "Entrando...".
async function simulateLatency() {
  if (process.env.NODE_ENV === "test") return;
  await new Promise((resolve) => setTimeout(resolve, 400 + Math.random() * 400));
}

export async function POST(request: Request) {
  await simulateLatency();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Requisição inválida." }, { status: 400 });
  }

  // O servidor nunca confia no navegador: valida de novo com o mesmo schema do formulário.
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Dados inválidos." }, { status: 400 });
  }

  const { email, password, remember } = parsed.data;
  const user = findUserByCredentials(email, password);

  if (!user) {
    return NextResponse.json({ message: "E-mail ou senha incorretos." }, { status: 401 });
  }

  const response = NextResponse.json({ user });

  response.cookies.set(SESSION_COOKIE, await signSessionToken(user.id, remember), {
    httpOnly: true, // o JavaScript do navegador não consegue ler: protege contra roubo por XSS
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // não envia o cookie em requisições vindas de outros sites
    path: "/",
    // Sem "lembrar": cookie de sessão (some ao fechar o navegador). Com "lembrar": 30 dias.
    ...(remember ? { maxAge: REMEMBER_SESSION_SECONDS } : {}),
  });

  return response;
}