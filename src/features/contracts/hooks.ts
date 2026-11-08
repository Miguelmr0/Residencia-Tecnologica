import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { fetchContracts, createContract } from "@/mocks/db";
import type { Contract } from "@/types";

export function useContracts() {
  return useQuery({ queryKey: queryKeys.contracts, queryFn: fetchContracts });
}

export function useCreateContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Contract, "id">) => createContract(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.contracts }),
  });
}