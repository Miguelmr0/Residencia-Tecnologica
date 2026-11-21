import { Cards } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Mostrado enquanto useSuppliers() está carregando (o mock demora 0,5 s).
export function UnitsTableSkeleton() {
  return (
    <Cards aria-busy="true">
      <p className="sr-only">Carregando fornecedores...</p>
      <div className="space-y-4">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="flex items-center gap-4">
            <Skeleton className="size-9" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
    </Cards>
  );
}