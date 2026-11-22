import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "vendorhub_session";

const DEFAULT_SESSION_SECONDS = 60 * 60 * 8; // 8 horas
export const REMEMBER_SESSION_SECONDS = 60 * 60 * 24 * 30; // 30 dias

// Só para desenvolvimento local: em produção a variável SESSION_SECRET é obrigatória.
const DEV_FALLBACK_SECRET = "vendorhub-dev-only-secret-change-me-0123456789";

function getKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;

  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("SESSION_SECRET não definida. Configure a variável de ambiente antes de publicar.");
    }
    return new TextEncoder().encode(DEV_FALLBACK_SECRET);
  }

  return new TextEncoder().encode(secret);
}

// O JWT leva só o id do usuário (sub). Nada de e-mail ou senha: o conteúdo é legível por qualquer um.
export async function signSessionToken(userId: string, remember: boolean, now: Date = new Date()): Promise<string> {
  const issuedAt = Math.floor(now.getTime() / 1000);
  const duration = remember ? REMEMBER_SESSION_SECONDS : DEFAULT_SESSION_SECONDS;

  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt(issuedAt)
    .setExpirationTime(issuedAt + duration)
    .sign(getKey());
}

// Devolve o id do usuário se o token for autêntico e não expirado; senão, null.
export async function verifySessionToken(token: string | undefined): Promise<string | null> {
  if (!token) return null;

  const key = getKey(); // fora do try: sem chave em produção o erro aparece, não vira "deslogado"

  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });
    return typeof payload.sub === "string" ? payload.sub : null;
  } catch {
    return null; // assinatura inválida, token adulterado, expirado ou malformado
  }
}