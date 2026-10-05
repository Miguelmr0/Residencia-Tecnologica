import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { fetchTasks, updateTaskStatus } from "@/mocks/db";
import type { TaskStatus } from "@/types";

export function useTasks() {
  return useQuery({ queryKey: queryKeys.tasks, queryFn: fetchTasks });
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
      updateTaskStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.tasks }),
  });
}