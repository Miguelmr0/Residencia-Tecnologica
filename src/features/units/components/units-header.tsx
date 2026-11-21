import { Download, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type UnitsHeaderProps = {
  total?: number; // fica indefinido enquanto carrega, para não mostrar "0 registros"
  onExport: () => void;
  onNew: () => void;
};

export function UnitsHeader({ total, onExport, onNew }: UnitsHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-ink">Fornecedores</h1>
          {total !== undefined && <Badge variant="brand">{total} registros</Badge>}
        </div>
        <p className="mt-1 max-w-md text-sm text-slate-500">
          Base centralizada de parceiros comerciais, homologações e conformidade cadastral.
        </p>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" size="lg" onClick={onExport}>
          <Download aria-hidden="true" /> Exportar Relatório
        </Button>
        <Button size="lg" onClick={onNew}>
          <Plus aria-hidden="true" /> Novo Fornecedor
        </Button>
      </div>
    </header>
  );
}