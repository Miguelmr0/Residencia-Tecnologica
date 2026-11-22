import type { AuthUser } from "@/features/auth/types";

// "Banco de dados" de mentira, usado só no servidor (rota /api/auth/login).
// Em um sistema real a senha seria um hash (bcrypt/argon2), nunca texto puro.
export const DEMO_CREDENTIALS = {
  email: "admin@vendorhub.com.br",
  password: "hubadmin",
} as const;

const DEMO_USER: AuthUser = {
  id: "user-1",
  name: "Admin",
  email: DEMO_CREDENTIALS.email,
};

export function findUserByCredentials(email: string, password: string): AuthUser | null {
  const isValid =
    email.trim().toLowerCase() === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password;
  return isValid ? DEMO_USER : null;
}