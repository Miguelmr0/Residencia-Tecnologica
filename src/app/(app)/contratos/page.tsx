"use client";

import { useState } from "react";
import { useContracts } from "@/features/contracts/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { flexRender } from "@tanstack/react-table";
import {
  useLegacyTable,
  getCoreRowModel,
  legacyCreateColumnHelper,
} from "@tanstack/react-table/legacy";
import type { LegacyColumnDef } from "@tanstack/react-table/legacy";
import { Badge, type BadgeVariant } from "@/components/ui/badge";
import type { Contract, ContractStatus } from "@/types";
import { differenceInCalendarDays, parseISO } from "date-fns";
import { Landmark, BadgeCheck, Clock, AlertTriangle, Plus } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { ContractForm } from "@/features/contracts/contract-form";

const statusConfig: Record<ContractStatus, { label: string; variant: BadgeVariant }> = {
  vigente: { label: "Vigente", variant: "brand" },
  a_renovar: { label: "A Renovar", variant: "warning" },
  em_aditivo: { label: "Em Aditivo", variant: "info" },
  vencido: { label: "Vencido", variant: "danger" },
};

const columnHelper = legacyCreateColumnHelper<Contract>();

const columns: LegacyColumnDef<Contract, any>[] = [
  columnHelper.accessor("code", {
    header: "Código & Objeto",
    cell: (info) => (
      <div>
        <p className="font-medium text-blue-700">{info.getValue()}</p>
        <p className="text-sm text-muted-foreground">{info.row.original.object}</p>
      </div>
    ),
  }),
  columnHelper.accessor("supplierName", {
    header: "Fornecedor",
    cell: (info) => (
      <div>
        <p>{info.getValue()}</p>
        <p className="text-xs text-muted-foreground">{info.row.original.supplierCnpj}</p>
      </div>
    ),
  }),
  columnHelper.accessor("monthlyValue", {
    header: "Valor Mês / Ano",
    cell: (info) => (
      <div>
        <p>R$ {info.getValue().toLocaleString("pt-BR")}/mês</p>
        <p className="text-xs text-muted-foreground">
          R$ {info.row.original.annualValue.toLocaleString("pt-BR")}/ano
        </p>
      </div>
    ),
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => {
      const config = statusConfig[info.getValue() as ContractStatus];
      return <Badge variant={config.variant}>{config.label}</Badge>;
    },
  }),
];

export default function ContratosPage() {
  const { data: contracts = [], isLoading, isError, refetch } = useContracts();

  const [busca, setBusca] = useState("");
  const [statusFiltro, setStatusFiltro] = useState<ContractStatus | "todos">("todos");
  const [tipoFiltro, setTipoFiltro] = useState("todos");
  const [responsavelFiltro, setResponsavelFiltro] = useState("todos");
  const [valorMin, setValorMin] = useState("");
  const [valorMax, setValorMax] = useState("");
  const [modalAberto, setModalAberto] = useState(false);

  const tiposDisponiveis = Array.from(new Set(contracts.map((c) => c.type)));
  const responsaveisDisponiveis = Array.from(new Set(contracts.map((c) => c.responsible)));

  const contractsFiltrados = contracts.filter((c) => {
    const bateBusca =
      c.code.toLowerCase().includes(busca.toLowerCase()) ||
      c.object.toLowerCase().includes(busca.toLowerCase());
    const bateStatus = statusFiltro === "todos" || c.status === statusFiltro;
    const bateTipo = tipoFiltro === "todos" || c.type === tipoFiltro;
    const bateResponsavel = responsavelFiltro === "todos" || c.responsible === responsavelFiltro;
    const bateValorMin = valorMin === "" || c.monthlyValue >= Number(valorMin);
    const bateValorMax = valorMax === "" || c.monthlyValue <= Number(valorMax);
    return bateBusca && bateStatus && bateTipo && bateResponsavel && bateValorMin && bateValorMax;
  });

  const table = useLegacyTable({
    data: contractsFiltrados,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const valorSobGestao = contracts.reduce((total, c) => total + c.annualValue, 0);
  const contratosVigentes = contracts.filter((c) => c.status === "vigente").length;
  const proximos60Dias = contracts.filter((c) => {
    const dias = differenceInCalendarDays(parseISO(c.endDate), new Date());
    return dias >= 0 && dias <= 60;
  }).length;
  const pendenciasVencidos = contracts.filter((c) => c.status === "vencido").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-3xl font-bold">Contratos</h1>
          <p className="text-sm text-muted-foreground">
            Administração do ciclo de vida contratual, SLA de serviços, valores sob gestão e vigências.
          </p>
        </div>
        <div className="flex gap-2">
          <Button disabled title="Em definição com a squad">
            Relatório de Reajustes
          </Button>
          <Button onClick={() => setModalAberto(true)} className="shrink-0">
            <Plus size={16} aria-hidden />
            Novo Contrato
          </Button>
        </div>
      </div>

      {isLoading && (
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      )}

      {isError && !isLoading && (
        <div className="flex flex-col items-start gap-3 rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">
            Não foi possível carregar os contratos.
          </p>
          <Button onClick={() => refetch()}>Tentar novamente</Button>
        </div>
      )}

      {!isLoading && !isError && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <p className="text-[11px] font-semibold tracking-wider text-muted-foreground">
                VALOR SOB GESTÃO
              </p>
              <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
                <Landmark size={21} />
              </div>
            </div>
            <h2 className="mt-2 text-2xl font-bold">
              R$ {(valorSobGestao / 1_000_000).toFixed(1)} Mi/ano
            </h2>
          </div>

          <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <p className="text-[11px] font-semibold tracking-wider text-muted-foreground">
                CONTRATOS VIGENTES
              </p>
              <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
                <BadgeCheck size={21} />
              </div>
            </div>
            <h2 className="mt-2 text-2xl font-bold">{contratosVigentes} ativos</h2>
          </div>

          <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <p className="text-[11px] font-semibold tracking-wider text-muted-foreground">
                PRÓXIMOS 60 DIAS
              </p>
              <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
                <Clock size={21} />
              </div>
            </div>
            <h2 className="mt-2 text-2xl font-bold">{proximos60Dias} renovações</h2>
          </div>

          <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <p className="text-[11px] font-semibold tracking-wider text-muted-foreground">
                PENDÊNCIAS / VENCIDOS
              </p>
              <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-lg bg-danger-50 text-danger-700">
                <AlertTriangle size={21} />
              </div>
            </div>
            <h2 className="mt-2 text-2xl font-bold">{pendenciasVencidos} atenção imediata</h2>
          </div>
        </div>
      )}

      {!isLoading && !isError && contracts.length > 0 && (
        <div className="flex flex-col gap-3 rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por Objeto, Código (ex: CTR-20...)"
            aria-label="Buscar contratos"
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
          />
          <div className="flex flex-wrap gap-3">
            <select
              value={tipoFiltro}
              onChange={(e) => setTipoFiltro(e.target.value)}
              aria-label="Filtrar por tipo"
              className="rounded-md border border-gray-200 px-3 py-2 text-sm"
            >
              <option value="todos">Tipo: Todos</option>
              {tiposDisponiveis.map((tipo) => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>

            <div className="flex items-center gap-2">
              <label htmlFor="valorMin" className="sr-only">Valor mínimo</label>
              <input
                id="valorMin"
                type="number"
                value={valorMin}
                onChange={(e) => setValorMin(e.target.value)}
                placeholder="Valor mín."
                className="w-28 rounded-md border border-gray-200 px-3 py-2 text-sm"
              />
              <span className="text-sm text-muted-foreground">até</span>
              <label htmlFor="valorMax" className="sr-only">Valor máximo</label>
              <input
                id="valorMax"
                type="number"
                value={valorMax}
                onChange={(e) => setValorMax(e.target.value)}
                placeholder="Valor máx."
                className="w-28 rounded-md border border-gray-200 px-3 py-2 text-sm"
              />
            </div>

            <select
              value={statusFiltro}
              onChange={(e) => setStatusFiltro(e.target.value as ContractStatus | "todos")}
              aria-label="Filtrar por status"
              className="rounded-md border border-gray-200 px-3 py-2 text-sm"
            >
              <option value="todos">Status: Todos</option>
              <option value="vigente">Vigente</option>
              <option value="a_renovar">A Renovar</option>
              <option value="em_aditivo">Em Aditivo</option>
              <option value="vencido">Vencido</option>
            </select>

            <select
              value={responsavelFiltro}
              onChange={(e) => setResponsavelFiltro(e.target.value)}
              aria-label="Filtrar por responsável"
              className="rounded-md border border-gray-200 px-3 py-2 text-sm"
            >
              <option value="todos">Responsável: Todos</option>
              {responsaveisDisponiveis.map((resp) => (
                <option key={resp} value={resp}>{resp}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {!isLoading && !isError && contracts.length === 0 && (
        <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">
            Nenhum contrato encontrado.
          </p>
        </div>
      )}

      {!isLoading && !isError && contracts.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-gray-100 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 text-left text-xs text-muted-foreground">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-5 py-3 font-semibold">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b border-gray-50 last:border-0">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-5 py-4 align-top">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={modalAberto} onClose={() => setModalAberto(false)} title="Novo Contrato">
        <ContractForm onSuccess={() => setModalAberto(false)} />
      </Dialog>
    </div>
  );
}