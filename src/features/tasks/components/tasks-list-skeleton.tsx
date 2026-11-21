import { Cards } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Mostrado enquanto as tarefas estão carregando (o mock demora 0,5 s).
export function TasksListSkeleton() {
  return (
    <Cards aria-busy="true">
      <p className="sr-only">Carregando tarefas...</p>
      <div className="space-y-6">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    </Cards>
  );
}