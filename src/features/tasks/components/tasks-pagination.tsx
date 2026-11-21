import { cn } from "@/lib/utils";

type TasksPaginationProps = {
  page: number;
  pageSize: number;
  total: number; // total de tarefas já filtradas
  onPageChange: (page: number) => void;
};

// Monta a lista de botões: 1 2 3 ... 14
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

export function TasksPagination({ page, pageSize, total, onPageChange }: TasksPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const first = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const last = Math.min(page * pageSize, total);

  return (
    <nav
      aria-label="Paginação das tarefas"
      className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between"
    >
      <span>
        Exibindo {first}–{last} de {total} tarefas
      </span>

      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-lg px-3 py-1.5 hover:bg-slate-100 disabled:opacity-40"
        >
          Anterior
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
                "h-8 min-w-8 rounded-lg px-2 font-medium",
                item === page ? "bg-brand-600 text-white" : "hover:bg-slate-100",
              )}
            >
              {item}
            </button>
          ),
        )}

        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-lg px-3 py-1.5 hover:bg-slate-100 disabled:opacity-40"
        >
          Próxima
        </button>
      </div>
    </nav>
  );
}