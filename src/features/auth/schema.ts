import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Informe seu e-mail corporativo.")
    .email("Digite um e-mail válido, como nome@empresa.com.br."),
  password: z
    .string()
    .min(1, "Informe sua senha.")
    .min(8, "A senha deve ter pelo menos 8 caracteres."),
  remember: z.boolean(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;