import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type UnitsPaginationProps = {
  page: number;
  pageSize: number;
  total: number; // total de itens já filtrados
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
};

// Monta a lista de botões: 1 ... 4 5 6 ... 19
function getPageList(current: number, total: number): (number | "...")[] {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);

  const wanted = new Set([1, total, current - 1, current, current + 1]);
  const sorted = Array.from(wanted)
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);

  const result: (number | "...")[] = [];
  sorted.forEach((p, index) => {
    if (index > 0 && p - sorted[index - 1] > 1) result.push("...");
    result.push(p);
  });
  return result;
}

export function UnitsPagination({ page, pageSize, total, onPageChange, onPageSizeChange }: UnitsPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const first = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const last = Math.min(page * pageSize, total);

  return (
    <nav aria-label="Paginação" className="flex flex-col gap-3 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-4">
        <span>Mostrando {first} a {last} de {total} fornecedores</span>
        <label className="flex items-center gap-2">
          Linhas por página:
          <select
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            className="rounded-lg border border-input bg-background px-2 py-1"
          >
            {[5, 10, 20].map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="Página anterior"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-lg p-2 hover:bg-slate-100 disabled:opacity-40"
        >
          <ChevronLeft size={16} aria-hidden="true" />
        </button>

        {getPageList(page, totalPages).map((item, index) =>
          item === "..." ? (
            <span key={`gap-${index}`} className="px-2">…</span>
          ) : (
            <button
              key={item}
              type="button"
              aria-current={item === page ? "page" : undefined}
              onClick={() => onPageChange(item)}
              className={cn(
                "h-9 min-w-9 rounded-lg px-3 font-medium",
                item === page ? "bg-brand-600 text-white" : "hover:bg-slate-100",
              )}
            >
              {item}
            </button>
          ),
        )}

        <button
          type="button"
          aria-label="Próxima página"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-lg p-2 hover:bg-slate-100 disabled:opacity-40"
        >
          <ChevronRight size={16} aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}