import { BadgeCheck, Building2, ClipboardList, ShieldOff } from "lucide-react";
import type { ReactNode } from "react";
import { Cards } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { SupplierStats } from "@/features/units/utils";
import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: number;
  icon: ReactNode;
  footer: string;
  tone: "brand" | "danger";
  loading: boolean;
};

function StatCard({ label, value, icon, footer, tone, loading }: StatCardProps) {
  const isDanger = tone === "danger";

  return (
    <Cards className={cn("border-b-4", isDanger ? "border-b-danger-700" : "border-b-brand-600")}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
        <span className={cn("rounded-lg p-2", isDanger ? "bg-danger-50 text-danger-700" : "bg-brand-100 text-brand-700")}>
          {icon}
        </span>
      </div>
      {loading ? (
        <Skeleton className="mt-3 h-9 w-16" />
      ) : (
        <p className={cn("mt-2 text-4xl font-bold", isDanger ? "text-danger-700" : "text-ink")}>{value}</p>
      )}
      <p className="mt-3 text-sm text-slate-500">{loading ? "Carregando..." : footer}</p>
    </Cards>
  );
}

export function UnitsStats({ stats, loading }: { stats: SupplierStats; loading: boolean }) {
  return (
    <section aria-label="Indicadores de fornecedores" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Total de fornecedores"
        value={stats.total}
        icon={<Building2 size={20} aria-hidden="true" />}
        footer="cadastrados na base"
        tone="brand"
        loading={loading}
      />
      <StatCard
        label="Homologados / Ativos"
        value={stats.ativas}
        icon={<BadgeCheck size={20} aria-hidden="true" />}
        footer={`Taxa de conformidade: ${stats.taxaConformidade.toLocaleString("pt-BR")}%`}
        tone="brand"
        loading={loading}
      />
      <StatCard
        label="Em homologação"
        value={stats.emHomologacao}
        icon={<ClipboardList size={20} aria-hidden="true" />}
        footer={`${stats.aguardandoDocs} aguardando documentação`}
        tone="brand"
        loading={loading}
      />
      <StatCard
        label="Bloqueados / Inativos"
        value={stats.inativas}
        icon={<ShieldOff size={20} aria-hidden="true" />}
        footer="Necessitam auditoria ou suspensos"
        tone="danger"
        loading={loading}
      />
    </section>
  );
}