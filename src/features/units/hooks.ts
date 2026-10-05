import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { fetchUnits } from "@/mocks/db";

export function useUnits() {
  return useQuery({ queryKey: queryKeys.units, queryFn: fetchUnits });
}