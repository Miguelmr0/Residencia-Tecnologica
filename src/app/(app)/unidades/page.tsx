"use client";

import { useSuppliers } from "@/features/units/suppliers-hooks";

// Página TEMPORÁRIA só para conferir se mock e hook funcionam.
// Será substituída pela página completa no Passo 6.
export default function UnidadesPage() {
  const { data, isLoading, isError } = useSuppliers();

  if (isLoading) return <p className="p-6">Carregando...</p>;
  if (isError) return <p className="p-6">Erro ao carregar os dados.</p>;

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold">Fornecedores ({data?.length})</h1>
      <ul className="list-disc pl-6">
        {(data ?? []).map((s) => (
          <li key={s.id}>
            {s.name} - {s.status}
          </li>
        ))}
      </ul>
    </main>
  );
}