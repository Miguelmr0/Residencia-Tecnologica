import { BadgeCheck, Lock, ShieldCheck, TrendingDown } from "lucide-react";
import { BrandLogo } from "@/components/layout/brand-logo";
import { Badge } from "@/components/ui/badge";
import { Cards } from "@/components/ui/card";

const stats = [
  { value: "+12.000", label: "Fornecedores ativos" },
  { value: "R$ 18.4 Bi", label: "Volume sob gestão" },
  { value: "Zero Fail", label: "SLA de auditoria" },
];

const certifications = ["LGPD Compliant", "ISO 27001", "SOC 2 Type II"];

export function LoginHero() {
  return (
    <aside
      aria-label="Apresentação do VendorHub"
      className="hidden flex-col justify-between gap-8 rounded-2xl bg-brand-50 p-8 lg:flex xl:p-10"
    >
      <div className="space-y-6">
        <BrandLogo />

        <Badge variant="brand" className="bg-white">
          Plataforma Líder em Auditoria Contratual B2B
        </Badge>

        <h2 className="text-3xl font-bold leading-tight text-ink xl:text-4xl">
          Gestão inteligente e segura de fornecedores para médias e grandes empresas.
        </h2>

        <p className="max-w-md text-base text-muted-foreground">
          Centralize ciclo de vida, homologação contínua, auditoria fiscal automatizada e mitigação de
          riscos operacionais em uma interface unificada.
        </p>

        <Cards className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
              <ShieldCheck className="h-5 w-5" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold">Automação de Certidões</p>
              <p className="text-sm text-muted-foreground">
                Conformidade tributária e trabalhista em tempo real
              </p>
            </div>
            <Badge variant="info">99.8% Eficiência</Badge>
          </div>

          <div className="flex items-center justify-between gap-3 rounded-xl bg-brand-50 p-4">
            <div>
              <p className="text-xs text-muted-foreground">Processamento Médio</p>
              <p className="text-lg font-bold">{"< 14 segundos por dossiê"}</p>
            </div>
            <p className="flex shrink-0 items-center gap-1 text-xs font-semibold text-brand-700">
              <TrendingDown className="h-4 w-4" aria-hidden />
              -92% Riscos
            </p>
          </div>
        </Cards>

        <ul className="grid grid-cols-3 gap-3">
          {stats.map((stat) => (
            <li key={stat.label}>
              <Cards className="h-full p-4 sm:p-4">
                <p className="text-lg font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </Cards>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-3">
        <ul className="flex flex-wrap gap-2">
          {certifications.map((name) => (
            <li key={name}>
              <Badge variant="neutral" className="gap-1 bg-white">
                <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
                {name}
              </Badge>
            </li>
          ))}
        </ul>
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <Lock className="h-3.5 w-3.5" aria-hidden />
          Transmissão criptografada ponta-a-ponta via TLS 1.3 / AES-256 bits
        </p>
      </div>
    </aside>
  );
}