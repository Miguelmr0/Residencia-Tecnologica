import { useQuery } from "@tanstack/react-query";
import { fetchSuppliers } from "./suppliers-mock";

// Dados do servidor (mockados) ficam no TanStack Query.
// A chave de cache é própria, para não mexer no src/lib/query-keys.ts da squad.
export function useSuppliers() {
  return useQuery({ queryKey: ["suppliers"], queryFn: fetchSuppliers });
}