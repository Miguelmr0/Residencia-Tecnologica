"use client"; // roda no navegador (usa hooks e estado)

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Cards } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { UnitsCards } from "@/features/units/components/units-cards";
import { UnitsFilters } from "@/features/units/components/units-filters";
import { UnitsHeader } from "@/features/units/components/units-header";
import { UnitsInsights } from "@/features/units/components/units-insights";
import { UnitsPagination } from "@/features/units/components/units-pagination";
import { UnitsStats } from "@/features/units/components/units-stats";
import { UnitsTable } from "@/features/units/components/units-table";
import { UnitsTableSkeleton } from "@/features/units/components/units-table-skeleton";
import { useSuppliers } from "@/features/units/suppliers-hooks";
import {
  EMPTY_FILTERS,
  exportSuppliersToCsv,
  filterSuppliers,
  getSupplierStats,
  uniqueSorted,
  type SupplierFilters,
  type SuppliersView,
} from "@/features/units/utils";

export default function UnidadesPage() {
  // Dados do servidor (mockados) ficam no TanStack Query...
  const { data, isLoading, isError, refetch } = useSuppliers();
  const suppliers = useMemo(() => data ?? [], [data]);

  // ...e o estado de interface fica em useState (separação exigida pelo PDF).
  const [filters, setFilters] = useState<SupplierFilters>(EMPTY_FILTERS);
  const [view, setView] = useState<SuppliersView>("tabela");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // ---------- Valores derivados (nada é guardado, tudo é calculado) ----------
  const stats = useMemo(() => getSupplierStats(suppliers), [suppliers]);
  const categories = useMemo(() => uniqueSorted(suppliers.map((s) => s.category)), [suppliers]);
  const ufs = useMemo(() => uniqueSorted(suppliers.map((s) => s.uf)), [suppliers]);
  const filtered = useMemo(() => filterSuppliers(suppliers, filters), [suppliers, filters]);
  const pendingSuppliers = useMemo(() => suppliers.filter((s) => s.docsOk < s.docsTotal), [suppliers]);

  // Paginação: fatia da lista filtrada que aparece na tela.
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages); // evita ficar numa página que deixou de existir
  const pageItems = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // ---------- Ações ----------
  // Mudou qualquer filtro: volta para a página 1.
  function handleFiltersChange(next: SupplierFilters) {
    setFilters(next);
    setPage(1);
  }

  function handlePageSizeChange(size: number) {
    setPageSize(size);
    setPage(1);
  }

  function toggleOne(id: string) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  // Marca ou desmarca todos os itens da página atual.
  function toggleAllOnPage() {
    const ids = pageItems.map((s) => s.id);
    const allSelected = ids.every((id) => selectedIds.includes(id));
    setSelectedIds((prev) =>
      allSelected ? prev.filter((id) => !ids.includes(id)) : Array.from(new Set([...prev, ...ids])),
    );
  }

  const selectedSuppliers = suppliers.filter((s) => selectedIds.includes(s.id));

  function handleNewSupplier() {
    // Ainda não existe formulário de cadastro. Quando existir (modal), abra-o aqui.
    window.alert("Cadastro de novo fornecedor: em desenvolvimento.");
  }

  function handleRequestDocs() {
    // Mock: não há API real para solicitar documentos.
    window.alert(`Solicitação de documentos enviada para ${selectedSuppliers.length} fornecedor(es).`);
  }

  function handleGenerateLink() {
    window.alert("Link do portal gerado (mock).");
  }

  // "Iniciar Triagem" leva direto para os fornecedores de alto risco.
  function handleTriage() {
    handleFiltersChange({ ...EMPTY_FILTERS, risk: "alto" });
  }

  // ---------- Conteúdo principal: loading, erro, vazio ou lista ----------
  let content;
  if (isLoading) {
    content = <UnitsTableSkeleton />;
  } else if (isError) {
    content = (
      <Cards>
        <EmptyState
          title="Não foi possível carregar os fornecedores"
          description="Houve um erro ao buscar os dados. Tente novamente."
          action={<Button onClick={() => refetch()}>Tentar novamente</Button>}
        />
      </Cards>
    );
  } else if (filtered.length === 0) {
    content = (
      <Cards>
        <EmptyState
          title="Nenhum fornecedor encontrado"
          description="Nenhum registro corresponde aos filtros aplicados."
          action={<Button variant="outline" onClick={() => handleFiltersChange(EMPTY_FILTERS)}>Limpar filtros</Button>}
        />
      </Cards>
    );
  } else if (view === "cards") {
    content = <UnitsCards suppliers={pageItems} />;
  } else {
    content = (
      <UnitsTable
        suppliers={pageItems}
        selectedIds={selectedIds}
        onToggle={toggleOne}
        onToggleAll={toggleAllOnPage}
        onRequestDocs={handleRequestDocs}
        onExportSelected={() => exportSuppliersToCsv(selectedSuppliers, "fornecedores-selecionados.csv")}
      />
    );
  }

  return (
    // O espaçamento externo já vem do AppShell, por isso não há padding aqui.
    <div className="space-y-6">
      <UnitsHeader
        total={isLoading ? undefined : stats.total}
        onExport={() => exportSuppliersToCsv(filtered)}
        onNew={handleNewSupplier}
      />

      <UnitsStats stats={stats} loading={isLoading} />

      <UnitsFilters
        filters={filters}
        onChange={handleFiltersChange}
        categories={categories}
        ufs={ufs}
        view={view}
        onViewChange={setView}
      />

      {content}

      {/* Paginação só aparece quando há dados para paginar */}
      {!isLoading && !isError && filtered.length > 0 && (
        <UnitsPagination
          page={currentPage}
          pageSize={pageSize}
          total={filtered.length}
          onPageChange={setPage}
          onPageSizeChange={handlePageSizeChange}
        />
      )}

      <UnitsInsights
        pendingSuppliers={pendingSuppliers}
        onTriage={handleTriage}
        onExport={() => exportSuppliersToCsv(filtered)}
        onGenerateLink={handleGenerateLink}
      />
    </div>
  );
}