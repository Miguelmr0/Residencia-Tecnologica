import { ArrowRight, Bot, Eye, Check } from "lucide-react";
import { Badge, type BadgeVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Cards } from "@/components/ui/card";

// ATENÇÃO: este painel é uma DEMONSTRAÇÃO. Os robôs e as regras abaixo são textos
// fixos (ainda não existe API de automações). Quando existir, troque por dados reais.
const rules: { title: string; description: string; badge: string; variant: BadgeVariant }[] = [
  {
    title: "Auto-bloqueio por CND vencida",
    description: "Trava ordens de compra em fornecedores com pendência > 5 dias.",
    badge: "Ativo",
    variant: "brand",
  },
  {
    title: "Cobrança WhatsApp prévia",
    description: "Disparo automático em D-30, D-15 e D-5 antes do vencimento.",
    badge: "Ativo",
    variant: "brand",
  },
  {
    title: "OCR de Validação de Certidões",
    description: "Extrai autenticidade e renova a tarefa sem ação manual.",
    badge: "Em Execução",
    variant: "info",
  },
];

export function TasksAutomations({ onConfigure }: { onConfigure: () => void }) {
  return (
    <Cards className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="rounded-lg bg-brand-100 p-2 text-brand-700">
            <Bot size={20} aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-semibold text-ink">Automações Ativas</h2>
            <p className="text-xs text-slate-500">Robôs de cobrança &amp; notificações</p>
          </div>
        </div>
        <span className="mt-1 size-2 rounded-full bg-emerald-500" role="img" aria-label="Automações em funcionamento" />
      </div>

      <div className="rounded-xl bg-brand-50 p-3 text-sm">
        <div className="flex items-center justify-between gap-2 text-xs">
          <span className="font-semibold text-brand-700">Robô de Cobrança 24h</span>
          <span className="text-slate-500">Hoje, 09:14</span>
        </div>
        <p className="mt-2 font-medium text-ink">
          3 fornecedores notificados hoje via WhatsApp e E-mail sobre certidões vencendo em menos de 10 dias.
        </p>
        <p className="mt-2 flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Check size={12} aria-hidden="true" /> 100% entregue
          </span>
          <span className="flex items-center gap-1">
            <Eye size={12} aria-hidden="true" /> 2 visualizados
          </span>
        </p>
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Regras operacionais disparadas</h3>
        <ul className="mt-3 space-y-4">
          {rules.map((rule) => (
            <li key={rule.title} className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-ink">{rule.title}</p>
                <p className="text-xs text-slate-500">{rule.description}</p>
              </div>
              <Badge variant={rule.variant} className="shrink-0">
                {rule.badge}
              </Badge>
            </li>
          ))}
        </ul>
      </div>

      <Button variant="ghost" className="w-full bg-brand-50 text-brand-700" onClick={onConfigure}>
        Configurar Novas Automações <ArrowRight aria-hidden="true" />
      </Button>
    </Cards>
  );
}