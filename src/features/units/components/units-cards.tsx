import Link from "next/link";
import { Cards } from "@/components/ui/card";
import type { Supplier } from "@/features/units/types";
import { UnitAvatar, UnitDocs, UnitScore, UnitStatusBadge } from "./unit-cells";

export function UnitsCards({ suppliers }: { suppliers: Supplier[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {suppliers.map((s) => (
        <Cards key={s.id} className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <UnitAvatar name={s.name} inactive={s.status === "inativa"} />
              <div>
                <Link href={`/unidades/${s.id}`} className="font-semibold text-ink hover:text-brand-600">
                  {s.name}
                </Link>
                <p className="font-mono text-xs text-slate-400">{s.cnpj}</p>
              </div>
            </div>
            <UnitStatusBadge status={s.status} />
          </div>

          <p className="text-xs text-slate-500">{s.category}</p>

          <div className="text-sm">
            <p className="font-medium text-ink">{s.contactName}</p>
            <p className="text-xs text-slate-500">{s.contactEmail}</p>
          </div>

          <div className="mt-auto flex items-center justify-between">
            <UnitScore score={s.score} />
            <UnitDocs supplier={s} />
          </div>
        </Cards>
      ))}
    </div>
  );
}