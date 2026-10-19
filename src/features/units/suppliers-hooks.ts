import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { fetchUnits } from "@/mocks/db";
import { toSuppliers } from "./supplier-details";

// Usa a MESMA chave de cache do useUnits (queryKeys.units): a lista e o
// Dashboard compartilham os mesmos dados e se atualizam juntos, como o PDF pede.
// O "select" só transforma o resultado (Unit -> Supplier) para esta tela.
export function useSuppliers() {
  return useQuery({
    queryKey: queryKeys.units,
    queryFn: fetchUnits,
    select: toSuppliers,
  });
}