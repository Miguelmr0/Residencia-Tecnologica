import { BarChart3, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Cards } from "@/components/ui/card";
import type { Supplier } from "@/features/units/types";
import { getInitials } from "@/features/units/utils";

type UnitsInsightsProps = {
  pendingSuppliers: Supplier[]; // fornecedores com documento pendente (derivado da lista)
  onTriage: () => void;
  onExport: () => void;
  onGenerateLink: () => void;
};

export function UnitsInsights({ pendingSuppliers, onTriage, onExport, onGenerateLink }: UnitsInsightsProps) {
  return (
    <section aria-label="Atalhos" className="grid gap-4 lg:grid-cols-3">
      <Cards className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-ink">Auditorias Pendentes</h2>
          <Badge variant="brand">{pendingSuppliers.length} nesta semana</Badge>
        </div>
        <p className="text-sm text-slate-500">
          Empresas com documentos pendentes que exigem revalidação manual.
        </p>
        <div className="mt-auto flex items-center justify-between">
          <div className="flex -space-x-2">
            {pendingSuppliers.slice(0, 3).map((s) => (
              <span
                key={s.id}
                title={s.name}
                className="flex size-8 items-center justify-center rounded-full border-2 border-white bg-brand-100 text-xs font-bold text-brand-700"
              >
                {getInitials(s.name)}
              </span>
            ))}
          </div>
          <Button variant="ghost" onClick={onTriage}>Iniciar Triagem →</Button>
        </div>
      </Cards>

      <Cards className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-ink">Homologação Expressa</h2>
          <Zap size={18} className="text-brand-600" aria-hidden="true" />
        </div>
        <p className="text-sm text-slate-500">
          Envie um link seguro de autopreenchimento cadastral e validação automática via Receita Federal.
        </p>
        <div className="mt-auto flex items-center justify-between text-xs text-slate-500">
          <span>Tempo médio: 48h</span>
          <Button variant="ghost" className="bg-brand-50 text-brand-700" onClick={onGenerateLink}>Gerar Link do Portal</Button>
        </div>
      </Cards>

      <Cards className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-ink">Relatório de Risco Fiscal</h2>
          <BarChart3 size={18} className="text-brand-600" aria-hidden="true" />
        </div>
        <p className="text-sm text-slate-500">
          Exportação parametrizada para Auditoria Interna e Compliance com notas de risco CND e FGTS.
        </p>
        <div className="mt-auto flex items-center justify-between text-xs text-slate-500">
          <span>Exporta a lista atual</span>
          <Button variant="ghost" className="bg-brand-50 text-brand-700" onClick={onExport}>Exportar</Button>
        </div>
      </Cards>
    </section>
  );
}