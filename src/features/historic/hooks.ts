import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { fetchHistorico } from "@/mocks/db";

export function useHistoric() {
  return useQuery({ queryKey: queryKeys.historico, queryFn: fetchHistorico });
}