"use client";

import { LayoutGrid, Search, Table2, X } from "lucide-react";
import { Cards } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  EMPTY_FILTERS,
  RISK_LABEL,
  STATUS_LABEL,
  type RiskFilter,
  type StatusFilter,
  type SupplierFilters,
  type SuppliersView,
} from "@/features/units/utils";
import { cn } from "@/lib/utils";

type UnitsFiltersProps = {
  filters: SupplierFilters;
  onChange: (filters: SupplierFilters) => void;
  categories: string[];
  ufs: string[];
  view: SuppliersView;
  onViewChange: (view: SuppliersView) => void;
};

export function UnitsFilters({ filters, onChange, categories, ufs, view, onViewChange }: UnitsFiltersProps) {
  // Opções dos selects. A primeira de cada um é "sem filtro".
  const statusOptions = [
    { value: "todos", label: "Status Geral" },
    ...Object.entries(STATUS_LABEL).map(([value, label]) => ({ value, label })),
  ];
  const riskOptions = [
    { value: "todos", label: "Grau de Risco" },
    ...Object.entries(RISK_LABEL).map(([value, label]) => ({ value, label })),
  ];
  const categoryOptions = [
    { value: "todos", label: "Todas Categorias" },
    ...categories.map((c) => ({ value: c, label: c })),
  ];
  const ufOptions = [{ value: "todos", label: "UF" }, ...ufs.map((u) => ({ value: u, label: u }))];

  // "Chips" dos filtros que estão ligados no momento.
  const chips: { key: keyof SupplierFilters; label: string }[] = [];
  if (filters.search.trim()) chips.push({ key: "search", label: `Busca: ${filters.search.trim()}` });
  if (filters.status !== "todos") chips.push({ key: "status", label: `Status: ${STATUS_LABEL[filters.status]}` });
  if (filters.category !== "todos") chips.push({ key: "category", label: `Categoria: ${filters.category}` });
  if (filters.risk !== "todos") chips.push({ key: "risk", label: `Risco: ${RISK_LABEL[filters.risk]}` });
  if (filters.uf !== "todos") chips.push({ key: "uf", label: `UF: ${filters.uf}` });

  return (
    <Cards className="p-4 sm:p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="lg:flex-1">
          <Input
            label="Buscar por razão social ou CNPJ"
            placeholder="Buscar por Razão Social ou CNPJ"
            icon={<Search size={16} aria-hidden="true" />}
            value={filters.search}
            onChange={(event) => onChange({ ...filters, search: event.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:flex-[2]">
          <Select
            label="Filtrar por categoria"
            value={filters.category}
            options={categoryOptions}
            onChange={(value) => onChange({ ...filters, category: value })}
          />
          <Select
            label="Filtrar por status"
            value={filters.status}
            options={statusOptions}
            onChange={(value) => onChange({ ...filters, status: value as StatusFilter })}
          />
          <Select
            label="Filtrar por grau de risco"
            value={filters.risk}
            options={riskOptions}
            onChange={(value) => onChange({ ...filters, risk: value as RiskFilter })}
          />
          <Select
            label="Filtrar por UF"
            value={filters.uf}
            options={ufOptions}
            onChange={(value) => onChange({ ...filters, uf: value })}
          />
        </div>

        {/* Alternância entre visão de tabela e de cards */}
        <div role="group" aria-label="Modo de visualização" className="flex rounded-lg bg-slate-100 p-1">
          {(["tabela", "cards"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              aria-pressed={view === mode}
              onClick={() => onViewChange(mode)}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium",
                view === mode ? "bg-white text-brand-600 shadow-sm" : "text-slate-500",
              )}
            >
              {mode === "tabela" ? <Table2 size={16} aria-hidden="true" /> : <LayoutGrid size={16} aria-hidden="true" />}
              {mode === "tabela" ? "Tabela" : "Cards"}
            </button>
          ))}
        </div>
      </div>

      {chips.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span>Filtros ativos:</span>
          {chips.map((chip) => (
            <span key={chip.key} className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-1 font-medium text-slate-700">
              {chip.label}
              <button
                type="button"
                aria-label={`Remover filtro ${chip.label}`}
                onClick={() => onChange({ ...filters, [chip.key]: EMPTY_FILTERS[chip.key] })}
              >
                <X size={12} aria-hidden="true" />
              </button>
            </span>
          ))}
          <button type="button" className="font-medium text-brand-600 hover:underline" onClick={() => onChange(EMPTY_FILTERS)}>
            Limpar todos os filtros
          </button>
        </div>
      )}
    </Cards>
  );
}