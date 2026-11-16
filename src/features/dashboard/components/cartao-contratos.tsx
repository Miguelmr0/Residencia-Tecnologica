import Link from "next/link";
import { differenceInCalendarDays, parseISO } from "date-fns";
import { AlertTriangle, FileText, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge, type BadgeVariant } from "@/components/ui/badge";
import type { Contract } from "@/types";

const LIMITE_CONTRATOS = 3;

const situacaoContrato = (c: Contract): { variant: BadgeVariant; texto: string } => {
  if (c.status === "a_renovar") return { variant: "warning", texto: "A renovar" };

  const dias = differenceInCalendarDays(parseISO(c.endDate), new Date());
  const quantidade = Math.abs(dias);
  const unidade = quantidade === 1 ? "dia" : "dias";

  if (dias < 0) return { variant: "danger", texto: `Vencido há ${quantidade} ${unidade}` };
  return { variant: "info", texto: `Vence em ${quantidade} ${unidade}` };
};

const valorMensal = (valor: number) =>
  `${valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })}/mês`;

// minicartão de contratos
function MiniCartao({ valor, texto, alerta = false }: { valor: number; texto: string; alerta?: boolean }) {
  return (
    <div className={`w-full h-[130px] rounded-lg border p-5 shadow-sm ${alerta ? "border-red-100 bg-red-100" : "border-gray-100 bg-white"}`}>

      <h2 className="mt-0 text-3xl font-bold text-black">
        {valor}
      </h2>

      <div className={`mt-9 flex items-center gap-2 text-[12px] ${alerta ? "text-red-600" : "text-gray-600"}`}>
       ● {texto}
      </div>

    </div>
  );
}

// skeleton
export function EsqueletoContratos() {
  return (
    <div className="min-h-[620px] rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="mt-8 h-100 w-full" />
    </div>
  );
}

// quinta coluna, cartão 1: contratos
export function CartaoContratos({ contracts }: { contracts: Contract[] }) {
  const contratosVigentes = contracts.filter((c) => c.status === "vigente").length;
  const proximos60Dias = contracts.filter((c) => {
    const dias = differenceInCalendarDays(parseISO(c.endDate), new Date());
    return dias >= 0 && dias <= 60;
  }).length;
  const pendenciasVencidos = contracts.filter((c) => c.status === "vencido").length;

  const contratosAtencao = [...contracts]
    .sort((a, b) => a.endDate.localeCompare(b.endDate))
    .slice(0, LIMITE_CONTRATOS);

  const valorSobGestao = contracts.reduce((total, c) => total + c.annualValue, 0);

  return (
    <div className="w-full h-auto rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap items-center gap-3 text-[21px] font-bold">
          Contratos
        </div>
        <p className="text-sm text-gray-600">
          Gestão de vigência e riscos contratuais
        </p>
      </div>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MiniCartao valor={contratosVigentes} texto="Contratos vingentes" />
        <MiniCartao valor={proximos60Dias} texto="Renovações nos proximos 60 dias" />
        <MiniCartao valor={pendenciasVencidos} texto="Pendencias/Vencidos" alerta />
      </div>

      <h3 className="mt-6 text-[16px] font-bold">
        Contratos que requer atenção
      </h3>

      <ul className="mt-3 flex flex-col gap-3">
        {contratosAtencao.map((c) => {
          const situacao = situacaoContrato(c);

          return (
            <li key={c.id} className="flex items-center gap-3 rounded-lg border border-gray-100 bg-[#F8FAFF] p-3">

              <Badge variant={situacao.variant} className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-lg">
                {situacao.variant === "danger" ? (
                  <AlertTriangle size={16} />
                ) : situacao.variant === "warning" ? (
                  <RefreshCw size={16} />
                ) : (
                  <FileText size={16} />
                )}
              </Badge>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-black">{c.object}</p>
                <p className="truncate text-sm text-gray-600">
                  {c.supplierName} • {valorMensal(c.monthlyValue)}
                </p>
              </div>

              <Badge variant={situacao.variant} className="shrink-0 whitespace-nowrap">
                {situacao.texto}
              </Badge>

            </li>
          );
        })}

        {contratosAtencao.length === 0 && (
          <li className="py-6 text-center text-sm text-gray-600">
            Nenhum contrato requer atenção.
          </li>
        )}
      </ul>

      <div className="mt-18 flex items-center justify-between gap-3">

        <p className="text-sm text-gray-600">
          valor total sob gestão: R$ {(valorSobGestao / 1_000_000).toFixed(1)} Mi/ano
        </p>

        <Link href="/contratos" className="text-sm font-medium text-blue-700 hover:underline">
          Gerenciar todos os contratos -&gt;
        </Link>

      </div>
    </div>
  );
}
