import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Badge, type BadgeVariant } from "@/components/ui/badge";
import { Cards } from "@/components/ui/card";
import { UnitAvatar, UnitDocs, UnitScore, UnitStatusBadge } from "@/features/units/components/unit-cells";
import {
  countDocumentsNeedingAttention,
  countPendingTasks,
  type DocumentWithStatus,
} from "@/features/units/detail";
import type { Supplier } from "@/features/units/types";
import type { DocumentStatus, Task, TaskStatus } from "@/types";

// Texto e cor de cada status
const documentBadge: Record<DocumentStatus, { label: string; variant: BadgeVariant }> = {
  valido: { label: "Válido", variant: "brand" },
  proximo_vencimento: { label: "Próximo do vencimento", variant: "warning" },
  expirado: { label: "Expirado", variant: "danger" },
};

const taskBadge: Record<TaskStatus, { label: string; variant: BadgeVariant }> = {
  pendente: { label: "Pendente", variant: "warning" },
  em_andamento: { label: "Em andamento", variant: "info" },
  concluida: { label: "Concluída", variant: "brand" },
};

// "2026-10-10" -> "10/10/2026"
function formatDate(value: string): string {
  return format(parseISO(value), "dd/MM/yyyy");
}

// Um dado da ficha: título pequeno e valor
function InfoItem({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm text-ink">{children}</dd>
    </div>
  );
}

type SupplierDetailViewProps = {
  supplier: Supplier;
  documents: DocumentWithStatus[];
  tasks: Task[];
};

export function SupplierDetailView({ supplier, documents, tasks }: SupplierDetailViewProps) {
  const inactive = supplier.status === "inativa";

  return (
    <div className="space-y-6">
      <Link
        href="/unidades"
        className="inline-flex items-center gap-2 text-sm font-medium text-brand-700 hover:underline"
      >
        <ArrowLeft className="size-4" aria-hidden="true" /> Fornecedores
      </Link>

      <header className="flex flex-wrap items-center gap-4">
        <UnitAvatar name={supplier.name} inactive={inactive} />
        <div>
          <h1 className="text-3xl font-bold text-ink">{supplier.name}</h1>
          <p className="font-mono text-sm text-slate-500">{supplier.cnpj}</p>
        </div>
        <UnitStatusBadge status={supplier.status} />
      </header>

      {/* Regra do PDF: unidade inativa é somente leitura */}
      {inactive && (
        <div role="status" className="flex items-start gap-3 rounded-xl bg-danger-50 p-4 text-sm text-danger-700">
          <Lock className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <p>
            <strong>Fornecedor inativo: somente leitura.</strong> Não é possível criar novos documentos ou tarefas
            para ele.
          </p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Cards>
          <h2 className="text-lg font-semibold text-ink">Dados cadastrais</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            <InfoItem label="Categoria">{supplier.category}</InfoItem>
            <InfoItem label="Cidade / UF">
              {supplier.city} / {supplier.uf}
            </InfoItem>
            <InfoItem label="Gerente">{supplier.manager}</InfoItem>
            <InfoItem label="Contato">{supplier.contactName}</InfoItem>
            <InfoItem label="E-mail">
              <a href={`mailto:${supplier.contactEmail}`} className="text-brand-700 hover:underline">
                {supplier.contactEmail}
              </a>
            </InfoItem>
          </dl>
        </Cards>

        <Cards>
          <h2 className="text-lg font-semibold text-ink">Indicadores</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            <InfoItem label="Score / risco">
              <UnitScore score={supplier.score} />
            </InfoItem>
            <InfoItem label="Documentos">
              <UnitDocs supplier={supplier} />
            </InfoItem>
            <InfoItem label="Documentos que exigem atenção">{countDocumentsNeedingAttention(documents)}</InfoItem>
            <InfoItem label="Tarefas pendentes">{countPendingTasks(tasks)}</InfoItem>
          </dl>
        </Cards>
      </div>

      <Cards role="region" aria-labelledby="supplier-docs-title">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h2 id="supplier-docs-title" className="text-lg font-semibold text-ink">
              Documentos
            </h2>
            {inactive && <Badge variant="neutral">Somente leitura</Badge>}
          </div>
          <Link href="/documentos" className="text-sm font-medium text-brand-700 hover:underline">
            Ver todos os documentos
          </Link>
        </div>

        {documents.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">Nenhum documento cadastrado para este fornecedor.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-slate-500">
                <tr>
                  <th scope="col" className="py-2 pr-4">Documento</th>
                  <th scope="col" className="py-2 pr-4">Vencimento</th>
                  <th scope="col" className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id} className="border-t border-slate-100">
                    <td className="py-3 pr-4 font-medium text-ink">{doc.title}</td>
                    <td className="py-3 pr-4">{formatDate(doc.expiresAt)}</td>
                    <td className="py-3">
                      <Badge variant={documentBadge[doc.status].variant}>{documentBadge[doc.status].label}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Cards>

      <Cards role="region" aria-labelledby="supplier-tasks-title">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h2 id="supplier-tasks-title" className="text-lg font-semibold text-ink">
              Tarefas
            </h2>
            {inactive && <Badge variant="neutral">Somente leitura</Badge>}
          </div>
          <Link href="/tarefas" className="text-sm font-medium text-brand-700 hover:underline">
            Ver todas as tarefas
          </Link>
        </div>

        {tasks.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">Nenhuma tarefa para este fornecedor.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-slate-500">
                <tr>
                  <th scope="col" className="py-2 pr-4">Tarefa</th>
                  <th scope="col" className="py-2 pr-4">Prazo</th>
                  <th scope="col" className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id} className="border-t border-slate-100">
                    <td className="py-3 pr-4 font-medium text-ink">{task.title}</td>
                    <td className="py-3 pr-4">{formatDate(task.dueDate)}</td>
                    <td className="py-3">
                      <Badge variant={taskBadge[task.status].variant}>{taskBadge[task.status].label}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Cards>
    </div>
  );
}
