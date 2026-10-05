"use client";

import { useDocuments } from "@/features/documents/hooks";
import { useTasks } from "@/features/tasks/hooks";
import { useUnits } from "@/features/units/hooks";
import { getDocumentStatus } from "@/lib/document-status";

export default function CheckPage() {
  const units = useUnits();
  const documents = useDocuments();
  const tasks = useTasks();

  if (units.isLoading || documents.isLoading || tasks.isLoading) {
    return <p className="p-6">Carregando...</p>;
  }

  if (units.isError || documents.isError || tasks.isError) {
    return <p className="p-6">Erro ao carregar os dados.</p>;
  }

  return (
    <main className="space-y-6 p-6">
      <section>
        <h2 className="text-xl font-bold">Unidades</h2>
        <ul className="list-disc pl-6">
          {(units.data ?? []).map((u) => (
            <li key={u.id}>
              {u.name} - {u.status}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold">Documentos</h2>
        <ul className="list-disc pl-6">
          {(documents.data ?? []).map((d) => (
            <li key={d.id}>
              {d.title} - vence em {d.expiresAt} - {getDocumentStatus(d.expiresAt)}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold">Tarefas</h2>
        <ul className="list-disc pl-6">
          {(tasks.data ?? []).map((t) => (
            <li key={t.id}>
              {t.title} - {t.status}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}