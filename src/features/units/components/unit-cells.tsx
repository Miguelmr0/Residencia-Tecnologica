import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { Badge, type BadgeVariant } from "@/components/ui/badge";
import type { Supplier } from "@/features/units/types";
import {
  getInitials,
  getRiskLevel,
  RISK_LABEL,
  STATUS_LABEL,
  type RiskLevel,
  type SupplierStatus,
} from "@/features/units/utils";
import { cn } from "@/lib/utils";

// Quadradinho com as iniciais da empresa (vermelho se inativa).
export function UnitAvatar({ name, inactive }: { name: string; inactive: boolean }) {
  return (
    <span
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold",
        inactive ? "bg-danger-50 text-danger-700" : "bg-brand-100 text-brand-700",
      )}
    >
      {getInitials(name)}
    </span>
  );
}

// Badge de status, usando as variantes que a squad já criou:
// ativa = brand (azul), em homologação = neutral (cinza), inativa = danger (vermelho).
const statusVariant: Record<SupplierStatus, BadgeVariant> = {
  ativa: "brand",
  em_homologacao: "neutral",
  inativa: "danger",
};

export function UnitStatusBadge({ status }: { status: SupplierStatus }) {
  return <Badge variant={statusVariant[status]}>{STATUS_LABEL[status]}</Badge>;
}

// Barra de score + nível de risco.
const riskBar: Record<RiskLevel, string> = {
  baixo: "bg-brand-600",
  medio: "bg-brand-500",
  alto: "bg-danger-700",
};
const riskText: Record<RiskLevel, string> = {
  baixo: "text-brand-700",
  medio: "text-slate-500",
  alto: "text-danger-700",
};

export function UnitScore({ score }: { score: number }) {
  const risk = getRiskLevel(score);
  return (
    <div className="flex items-center gap-3">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-200" aria-hidden="true">
        <div className={cn("h-full", riskBar[risk])} style={{ width: `${score}%` }} />
      </div>
      <div className="leading-tight">
        <p className={cn("text-sm font-bold", risk === "alto" ? "text-danger-700" : "text-ink")}>{score}%</p>
        <p className={cn("text-xs", riskText[risk])}>{RISK_LABEL[risk]}</p>
      </div>
    </div>
  );
}

// Situação dos documentos: regulares, com pendência ou com pendência grave.
export function UnitDocs({ supplier }: { supplier: Pick<Supplier, "docsOk" | "docsTotal" | "status"> }) {
  const pending = supplier.docsTotal - supplier.docsOk;

  if (pending === 0) {
    return (
      <span className="inline-flex items-center gap-2 text-sm text-ink">
        <CheckCircle2 size={16} className="text-brand-600" aria-hidden="true" />
        {supplier.docsOk}/{supplier.docsTotal} <span className="text-xs text-slate-500">Regulares</span>
      </span>
    );
  }
  if (supplier.status === "inativa") {
    return (
      <span className="inline-flex items-center gap-2 text-sm text-danger-700">
        <AlertTriangle size={16} aria-hidden="true" />
        {supplier.docsOk}/{supplier.docsTotal} <span className="text-xs">Pendências graves</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-2 text-sm text-ink">
      <Info size={16} className="text-brand-600" aria-hidden="true" />
      {supplier.docsOk}/{supplier.docsTotal}{" "}
      <span className="text-xs text-slate-500">{pending === 1 ? "1 pendente" : `${pending} pendentes`}</span>
    </span>
  );
}