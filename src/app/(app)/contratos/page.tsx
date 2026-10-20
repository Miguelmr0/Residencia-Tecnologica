"use client";

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

  const table = useLegacyTable({
    data: contracts,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-3xl font-bold">Contratos</h1>
        <p className="text-sm text-muted-foreground">
          Administração do ciclo de vida contratual, SLA de serviços, valores sob gestão e vigências.
        </p>
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
    </div>
  );
}