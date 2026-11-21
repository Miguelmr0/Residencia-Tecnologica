import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { LoginFormValues } from "./schema";
import type { AuthUser } from "./types";

async function loginRequest(values: LoginFormValues): Promise<AuthUser> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  }).catch(() => {
    throw new Error("Sem conexão com o servidor. Tente novamente.");
  });

  const data = (await response.json().catch(() => ({}))) as { user?: AuthUser; message?: string };

  if (!response.ok || !data.user) {
    throw new Error(data.message ?? "Não foi possível entrar agora. Tente novamente em instantes.");
  }

  return data.user;
}

async function logoutRequest(): Promise<void> {
  const response = await fetch("/api/auth/logout", { method: "POST" });
  if (!response.ok) throw new Error("Não foi possível sair agora. Tente novamente.");
}

export function useLogin() {
  return useMutation({ mutationFn: loginRequest });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: logoutRequest,
    onSuccess: () => {
      // Limpa os dados em memória da sessão que saiu e volta para o login.
      queryClient.clear();
      router.replace("/login");
      router.refresh();
    },
  });
}