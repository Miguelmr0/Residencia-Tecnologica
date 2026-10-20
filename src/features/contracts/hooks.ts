import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { fetchContracts } from "@/mocks/db";

export function useContracts() {
  return useQuery({ queryKey: queryKeys.contracts, queryFn: fetchContracts });
}