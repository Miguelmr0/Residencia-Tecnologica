import type { SessionUser } from "@/features/auth/types";

export const DEMO_CREDENTIALS = {
  email: "admin@vendorhub.com.br",
  password: "hubadmin",
} as const;

const DEMO_USER: SessionUser = {
  id: "user-1",
  name: "ADMIN",
  email: DEMO_CREDENTIALS.email,
  role: "Compras / Admin",
};

export class InvalidCredentialsError extends Error {
  constructor() {
    super("E-mail ou senha incorretos.");
    this.name = "InvalidCredentialsError";
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function loginRequest(credentials: {
  email: string;
  password: string;
}): Promise<SessionUser> {
  await delay(400 + Math.random() * 400);

  const email = credentials.email.trim().toLowerCase();
  const isValid =
    email === DEMO_CREDENTIALS.email && credentials.password === DEMO_CREDENTIALS.password;

  if (!isValid) throw new InvalidCredentialsError();

  return DEMO_USER;
}