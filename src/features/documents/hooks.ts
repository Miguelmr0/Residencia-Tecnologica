import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { fetchDocuments } from "@/mocks/db";

export function useDocuments() {
  return useQuery({ queryKey: queryKeys.documents, queryFn: fetchDocuments });
}