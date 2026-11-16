import Link from "next/link";
import { differenceInCalendarDays, format, parseISO } from "date-fns";
import { AlertTriangle, ArrowRight, Building2, Check, Clock, FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import type { Historico } from "@/types";

const LIMITE_ATIVIDADES = 7;

const iconeAtividade = (tipo: string) => {
  if (tipo === "Tarefa") return <Check size={14} />;
  if (tipo === "Cadastro") return <Building2 size={14} />;
  if (tipo === "Alerta" || tipo === "Bloqueio") return <AlertTriangle size={14} />;
  return <FileText size={14} />;
};

const quandoAtividade = (timestamp: string) => {
  const data = parseISO(timestamp);
  const dias = differenceInCalendarDays(new Date(), data);
  const hora = format(data, "HH:mm");

  if (dias === 0) return `Hoje, ${hora}`;
  if (dias === 1) return `Ontem, ${hora}`;
  return `${format(data, "dd/MM/yyyy")}, ${hora}`;
};

// skeleton
export function EsqueletoAtividades() {
  return (
    <div className="min-h-[620px] rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="mt-8 h-100 w-full" />
    </div>
  );
}

// quinta coluna, cartão 2: atividade recente
export function CartaoAtividades({ historico }: { historico: Historico[] }) {
  const atividadesRecentes = [...historico].sort((a, b) => parseISO(b.timestamp).getTime() - parseISO(a.timestamp).getTime())
    .slice(0, LIMITE_ATIVIDADES);

  return (
    <div className="flex w-full h-auto flex-col rounded-lg border border-gray-100 bg-white p-5 shadow-sm">

      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-[21px] font-bold">
            Atividade recente
          </p>

          <Badge variant="info" className="flex ml-auto h-[44px] w-[44px] shrink-0 items-center justify-center rounded-lg">
            <Clock size={21} />
          </Badge>
        </div>
        <p className="text-sm text-gray-600">
          Trilha de auditoria das ações operacionais
        </p>
      </div>

      <ul className="mb-6 mt-6 flex flex-col">
        {atividadesRecentes.map((log) => {
          const critico = log.level === "critico";

          return (
            <li key={log.id} className="relative flex gap-3 pb-6 last:pb-0">

              <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white ${
                critico ? "bg-red-600" : "bg-blue-700"}`}>
                {iconeAtividade(log.type)}
              </span>

              <div className="min-w-0 flex-1">
                <p className="text-sm text-[#101828]">
                  <strong className="font-semibold">{log.actorName}</strong> registrou{" "}
                  <span className={`font-semibold ${critico ? "text-red-700" : "text-blue-700"}`}>
                    {log.action}
                  </span>{" "}
                  para {log.supplierName}.
                </p>

                <p className="mt-1 flex items-center gap-1 text-xs text-gray-600">
                  <Clock size={12} aria-hidden />
                  {quandoAtividade(log.timestamp)}
                </p>
              </div>

            </li>
          );
        })}

        {atividadesRecentes.length === 0 && (
          <li className="py-6 text-center text-sm text-gray-600">
            Nenhuma atividade registrada.
          </li>
        )}
      </ul>

      <div className="mt-auto flex items-center justify-between gap-3 border-gray-100 pt-4">

        <Link href="/historico" className="flex ml-auto items-center gap-2 text-sm font-medium text-blue-700 hover:underline">
          Ver histórico completo de auditoria
          <ArrowRight size={16} aria-hidden />
        </Link>
      </div>
    </div>
  );
}
