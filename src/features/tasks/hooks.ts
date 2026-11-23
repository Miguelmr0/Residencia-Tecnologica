import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { createTask, fetchTasks, updateTaskStatus } from "@/mocks/db";
import type { Task, TaskStatus } from "@/types";
import { saveCreatedTaskDetails } from "./task-details";
import type { TaskDetails } from "./types";

export type NewTaskInput = Omit<Task, "id"> & TaskDetails;

export function useTasks() {
  return useQuery({ queryKey: queryKeys.tasks, queryFn: fetchTasks });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ priority, category, description, assignee, reference, ...taskData }: NewTaskInput) => {
      const created = await createTask(taskData);
      saveCreatedTaskDetails(created.id, { priority, category, description, assignee, reference });
      return created;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.tasks }),
  });
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
      updateTaskStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.tasks }),
  });
}