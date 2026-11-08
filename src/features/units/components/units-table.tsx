import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Cards } from "@/components/ui/card";
import type { Supplier } from "@/features/units/types";
import { UnitAvatar, UnitDocs, UnitScore, UnitStatusBadge } from "./unit-cells";

type UnitsTableProps = {
  suppliers: Supplier[]; // somente os itens da página atual
  selectedIds: string[];
  onToggle: (id: string) => void;
  onToggleAll: () => void;
  onRequestDocs: () => void;
  onExportSelected: () => void;
};

export function UnitsTable({ suppliers, selectedIds, onToggle, onToggleAll, onRequestDocs, onExportSelected }: UnitsTableProps) {
  const allSelected = suppliers.length > 0 && suppliers.every((s) => selectedIds.includes(s.id));

  return (
    <Cards className="overflow-hidden p-0 sm:p-0">
      {/* Barra de seleção e ações em lote */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-brand-50 px-4 py-3 text-xs text-slate-600">
        <label className="flex items-center gap-3">
          <input type="checkbox" checked={allSelected} onChange={onToggleAll} className="size-4" />
          Selecionar todos os {suppliers.length} registros da página
        </label>
        <div className="flex items-center gap-2">
          <span>Ações em lote:</span>
          <Button variant="outline" size="sm" disabled={selectedIds.length === 0} onClick={onRequestDocs}>
            Solicitar Documentos
          </Button>
          <Button variant="outline" size="sm" disabled={selectedIds.length === 0} onClick={onExportSelected}>
            Exportar Selecionados
          </Button>
        </div>
      </div>

      {/* overflow-x-auto: no mobile a tabela rola para o lado em vez de quebrar o layout */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th scope="col" className="w-12 px-4 py-3"><span className="sr-only">Selecionar</span></th>
              <th scope="col" className="px-2 py-3">Empresa / Razão Social</th>
              <th scope="col" className="px-2 py-3">Categoria</th>
              <th scope="col" className="px-2 py-3">Contato Principal</th>
              <th scope="col" className="px-2 py-3">Score / Risco</th>
              <th scope="col" className="px-2 py-3">Documentos</th>
              <th scope="col" className="px-2 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {suppliers.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50">
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    className="size-4"
                    checked={selectedIds.includes(s.id)}
                    onChange={() => onToggle(s.id)}
                    aria-label={`Selecionar ${s.name}`}
                  />
                </td>
                <td className="px-2 py-4">
                  <div className="flex items-center gap-3">
                    <UnitAvatar name={s.name} inactive={s.status === "inativa"} />
                    <div>
                      {/* Leva ao detalhamento (outra tela do roteiro). Dá 404 até essa página existir. */}
                      <Link href={`/unidades/${s.id}`} className="font-semibold text-ink hover:text-brand-600">
                        {s.name}
                      </Link>
                      <p className="font-mono text-xs text-slate-400">{s.cnpj}</p>
                    </div>
                  </div>
                </td>
                <td className="px-2 py-4">
                  <span className="rounded bg-brand-50 px-2 py-1 text-xs text-slate-700">{s.category}</span>
                </td>
                <td className="px-2 py-4">
                  <p className="font-medium text-ink">{s.contactName}</p>
                  <p className="text-xs text-slate-500">{s.contactEmail}</p>
                </td>
                <td className="px-2 py-4"><UnitScore score={s.score} /></td>
                <td className="px-2 py-4"><UnitDocs supplier={s} /></td>
                <td className="px-2 py-4"><UnitStatusBadge status={s.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Cards>
  );
}