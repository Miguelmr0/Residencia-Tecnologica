import type { Session, SessionUser } from "./types";

const STORAGE_KEY = "vendedorhub:session";
const REMEMBER_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 dias
const DEFAULT_DURATION_MS = 8 * 60 * 60 * 1000; // 8 horas

export function createSession(
  user: SessionUser,
  remember: boolean,
  now: number = Date.now()
): Session {
  const duration = remember ? REMEMBER_DURATION_MS : DEFAULT_DURATION_MS;
  return { user, expiresAt: now + duration };
}

export function isSessionActive(session: Session, now: number = Date.now()): boolean {
  return session.expiresAt > now;
}

function isSession(value: unknown): value is Session {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  const user = candidate.user as Record<string, unknown> | null | undefined;

  return (
    typeof candidate.expiresAt === "number" &&
    typeof user === "object" &&
    user !== null &&
    typeof user.id === "string" &&
    typeof user.name === "string" &&
    typeof user.email === "string" &&
    typeof user.role === "string"
  );
}

function readFrom(storage: Storage): Session | null {
  const raw = storage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (isSession(parsed) && isSessionActive(parsed)) return parsed;
  } catch {
    // JSON corrompido: cai no remove abaixo
  }

  storage.removeItem(STORAGE_KEY);
  return null;
}

export function loadSession(): Session | null {
  if (typeof window === "undefined") return null;
  return readFrom(window.localStorage) ?? readFrom(window.sessionStorage);
}

export function saveSession(session: Session, remember: boolean): void {
  clearSession();
  const storage = remember ? window.localStorage : window.sessionStorage;
  storage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.sessionStorage.removeItem(STORAGE_KEY);
}