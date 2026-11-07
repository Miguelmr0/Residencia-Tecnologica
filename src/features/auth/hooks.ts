import { useMutation } from "@tanstack/react-query";
import { loginRequest } from "@/mocks/auth";
import { createSession, saveSession } from "./session";
import type { LoginFormValues } from "./schema";

export function useLogin() {
  return useMutation({
    mutationFn: async (values: LoginFormValues) => {
      const user = await loginRequest({ email: values.email, password: values.password });
      return { user, remember: values.remember };
    },
    onSuccess: ({ user, remember }) => {
      saveSession(createSession(user, remember), remember);
    },
  });
}