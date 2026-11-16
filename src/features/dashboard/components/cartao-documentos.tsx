import { useState } from "react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge, type BadgeVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDocumentStatus, type FiltroDoc } from "@/lib/document-status";
import type { Unit, UnitDocument } from "@/types";

const LIMITE_DOCS = 5;

const statusDoc: Record<"expirado" | "proximo", { variant: BadgeVariant; texto: string }> = {
  expirado: { variant: "danger", texto: "Expirado" },
  proximo: { variant: "warning", texto: "Próximo do vencimento" },
};

const COLUNAS_DOCS = ["DOCUMENTO", "FORNECEDOR", "VENCIMENTO", "STATUS", "AÇÕES"];

// skeleton
export function EsqueletoDocumentos() {
  return (
    <div className="flex w-full flex-col md:col-span-2 h-[460px] sm:min-h-[358px] rounded-lg border border-[#F3F4F6] bg-[#FFFFFF] p-5 shadow-sm">
      <Skeleton className="h-6 w-64" />
      <Skeleton className="mt-3 h-4 w-80" />
      <Skeleton className="mt-8 h-64 w-full" />
    </div>
  );
}

// quarta coluna, cartão 1: documentos que exigem atenção
export function CartaoDocumentos({ docs, units }: { docs: UnitDocument[]; units: Unit[] }) {
  const [filtroDoc, setFiltroDoc] = useState<FiltroDoc>("todos");
  const nomeFornecedor = (unitId: string) => units.find((u) => u.id === unitId)?.name;

  const documentosAVencer = docs.filter((d) => getDocumentStatus(d.expiresAt) === "proximo_vencimento").length;
  const documentosExpirado = docs.filter((d) => getDocumentStatus(d.expiresAt) === "expirado").length;
  const docAlertas = documentosAVencer + documentosExpirado;
  const docsFiltrados = docs.filter((d) => {
    const status = getDocumentStatus(d.expiresAt);
    if (filtroDoc === "expirados") return status === "expirado";
    if (filtroDoc === "proximos") return status === "proximo_vencimento";
    return status === "expirado" || status === "proximo_vencimento";
  }).sort((a, b) => a.expiresAt.localeCompare(b.expiresAt)); //ordenação das datas

  const docsVisiveis = docsFiltrados.slice(0, LIMITE_DOCS);
  const abasDocs: { id: FiltroDoc; nome: string; qtd: number }[] = [
    { id: "todos", nome: "Todos", qtd: docAlertas },
    { id: "expirados", nome: "Expirados", qtd: documentosExpirado },
    { id: "proximos", nome: "Próximos", qtd: documentosAVencer },
  ];

  return (
    <div className="flex w-full flex-col md:col-span-2 h-[460px] sm:min-h-[358px] rounded-lg border border-[#F3F4F6] bg-[#FFFFFF] p-5 shadow-sm">

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold">
              Documentos que exigem atenção
            </h1>

            <Badge variant="danger">
              {docAlertas} alertas
            </Badge>
          </div>

          <p className="mt-1 text-sm text-[#4A5565]">
            Certidões e licenças vencidas ou expirando nos próximos 15 dias
          </p>
        </div>

        <div className="inline-flex shrink-0 rounded-lg bg-[#EFF4FF] p-1">
          {abasDocs.map((aba) => {
            const ativa = filtroDoc === aba.id;

            return (
              <Button
                key={aba.id}
                type="button"
                variant="ghost"
                onClick={() => setFiltroDoc(aba.id)}
                aria-pressed={ativa}
                className={`h-auto rounded-md px-3 py-1.5 text-center text-xs font-semibold shadow-none transition-colors ${
                  ativa ? "bg-[#FFFFFF] text-[#0037B0] shadow-sm hover:bg-[#FFFFFF]" : "bg-transparent text-[#4A5565] hover:bg-[#FFFFFF]/60 hover:text-[#101828]"
                }`}
              >
                <span className="flex flex-col items-center gap-0">
                  <span>{aba.nome}</span>
                  <span>({aba.qtd})</span>
                </span>
              </Button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 w-full overflow-x-auto rounded-lg">
        <table className="w-full min-w-[650px] border-collapse text-left">
          <thead className="bg-[#EFF4FF]">
            <tr>
              {COLUNAS_DOCS.map((coluna) => (
                <th key={coluna} className="px-4 py-3 text-[11px] font-semibold text-[#4A5565]">
                  {coluna}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {docsVisiveis.map((d) => {
              const expirado = getDocumentStatus(d.expiresAt) === "expirado";
              const status = statusDoc[expirado ? "expirado" : "proximo"];

              return (
                <tr key={d.id} className="border-b border-[#F3F4F6] last:border-0 overflow-y-auto">
                  {/* Documento */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-[#000000]">
                        {d.title}
                      </span>
                    </div>
                  </td>

                  {/* Fornecedor */}
                  <td className="px-4 py-3 text-sm text-[#434655]">
                    {nomeFornecedor(d.unitId)}
                  </td>

                  {/* Data */}
                  <td className={`px-4 py-3 text-sm font-medium ${expirado ? "text-[#BA1A1A]" : "text-slate-900"}`}>
                    {format(parseISO(d.expiresAt), "dd/MM/yyyy")}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Badge variant={status.variant} className="gap-1.5">
                      ● {status.texto}
                    </Badge>
                  </td>

                  {/* botão ver doc */}
                  <td className="px-4 py-3">
                    <Button variant="outline" size="sm" className="gap-1.5">
                      Ver
                      <Eye size={14} aria-hidden />
                    </Button>
                  </td>
                </tr>
              );
            })}

            {docsVisiveis.length === 0 && (
              <tr>
                <td colSpan={COLUNAS_DOCS.length} className="px-4 py-6 text-center text-sm text-gray-600">
                  Nenhum documento nesta categoria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3">

        <p className="text-sm text-[#4A5565]">
          Exibindo {Math.min(docAlertas, 5)} de {docAlertas} documentos
        </p>

        <Link href="/documentos" className="text-sm font-medium text-blue-700 hover:underline">
          Ver todos os documentos -&gt;
        </Link>

      </div>
    </div>
  );
}
