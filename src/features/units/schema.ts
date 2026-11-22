import { z } from "zod";

export const BRAZIL_UFS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA",
  "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
] as const;

// Só os números: "04.281.932/0001-44" -> "04281932000144"
export function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

// "04281932000144" -> "04.281.932/0001-44"
export function formatCnpj(value: string): string {
  const d = onlyDigits(value).slice(0, 14);
  const [a, b, c, e, f] = [d.slice(0, 2), d.slice(2, 5), d.slice(5, 8), d.slice(8, 12), d.slice(12, 14)];
  let out = a;
  if (b) out += `.${b}`;
  if (c) out += `.${c}`;
  if (e) out += `/${e}`;
  if (f) out += `-${f}`;
  return out;
}

// Regras do formulário de novo fornecedor (mensagem de erro por campo)
export const newSupplierSchema = z.object({
  name: z.string().trim().min(3, "Informe a razão social (mínimo 3 letras)."),
  cnpj: z
    .string()
    .trim()
    .min(1, "Informe o CNPJ.")
    .refine((value) => onlyDigits(value).length === 14, "O CNPJ deve ter 14 números."),
  category: z.string().min(1, "Selecione a categoria."),
  uf: z.string().min(1, "Selecione o estado."),
  city: z.string().trim().min(2, "Informe a cidade."),
  manager: z.string().trim().min(2, "Informe o gerente responsável."),
  contactName: z.string().trim().min(2, "Informe o nome do contato."),
  contactEmail: z
    .string()
    .trim()
    .min(1, "Informe o e-mail do contato.")
    .email("Digite um e-mail válido, como nome@empresa.com.br."),
});

export type NewSupplierFormValues = z.infer<typeof newSupplierSchema>;