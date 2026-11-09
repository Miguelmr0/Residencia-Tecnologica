import { useMemo } from "react";
import { useUnits } from "@/features/units/hooks";
import { buildTaskItems } from "./task-details";
import { useTasks } from "./hooks";

// Usa os MESMOS dados do Dashboard (useTasks e useUnits, mesmas chaves de cache):
// se uma tarefa for concluída aqui, o Dashboard atualiza junto, como o PDF pede.
// Este hook só junta as duas listas para a tela de Tarefas.
export function useTaskItems() {
  const tasksQuery = useTasks();
  const unitsQuery = useUnits();

  const data = useMemo(
    () => (tasksQuery.data && unitsQuery.data ? buildTaskItems(tasksQuery.data, unitsQuery.data) : undefined),
    [tasksQuery.data, unitsQuery.data],
  );

  return {
    data,
    isLoading: tasksQuery.isLoading || unitsQuery.isLoading,
    isError: tasksQuery.isError || unitsQuery.isError,
    isFetching: tasksQuery.isFetching || unitsQuery.isFetching,
    refetch: () => {
      void tasksQuery.refetch();
      void unitsQuery.refetch();
    },
  };
}