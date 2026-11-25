"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Cards } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { useDocuments } from "@/features/documents/hooks";
import { SupplierDetailView } from "@/features/units/components/supplier-detail-view";
import { getSupplierDocuments, getSupplierTasks } from "@/features/units/detail";
import { useSuppliers } from "@/features/units/suppliers-hooks";
import { useTasks } from "@/features/tasks/hooks";

export default function FornecedorDetalhePage() {
  // O id vem da URL: /unidades/u1 -> "u1"
  const { id } = useParams<{ id: string }>();

  // Mesmos hooks (e chaves de cache) da lista: nada novo para buscar
  const suppliers = useSuppliers();
  const documents = useDocuments();
  const tasks = useTasks();

  const today = useMemo(() => new Date(), []);
  const supplierDocuments = useMemo(
    () => getSupplierDocuments(documents.data ?? [], id, today),
    [documents.data, id, today],
  );
  const supplierTasks = useMemo(() => getSupplierTasks(tasks.data ?? [], id), [tasks.data, id]);

  const supplier = suppliers.data?.find((s) => s.id === id);

  // Carregando
  if (suppliers.isLoading || documents.isLoading || tasks.isLoading) {
    return (
      <div className="space-y-4" aria-busy="true">
        <div className="h-10 w-64 animate-pulse rounded-lg bg-slate-200" />
        <div className="h-48 animate-pulse rounded-2xl bg-slate-200" />
        <div className="h-48 animate-pulse rounded-2xl bg-slate-200" />
      </div>
    );
  }

  // Erro
  if (suppliers.isError || documents.isError || tasks.isError) {
    return (
      <Cards>
        <EmptyState
          title="Não foi possível carregar o fornecedor"
          description="Houve um erro ao buscar os dados. Tente novamente."
          action={
            <Button
              onClick={() => {
                suppliers.refetch();
                documents.refetch();
                tasks.refetch();
              }}
            >
              Tentar novamente
            </Button>
          }
        />
      </Cards>
    );
  }

  // Id que não existe (ex.: /unidades/u999)
  if (!supplier) {
    return (
      <Cards>
        <EmptyState
          title="Fornecedor não encontrado"
          description="Não existe um fornecedor com este código."
          action={
            <Link
              href="/unidades"
              className="inline-flex h-8 items-center rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground"
            >
              Voltar para Fornecedores
            </Link>
          }
        />
      </Cards>
    );
  }

  return <SupplierDetailView supplier={supplier} documents={supplierDocuments} tasks={supplierTasks} />;
}