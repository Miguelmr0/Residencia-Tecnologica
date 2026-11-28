"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Building2,
  ShieldCheck,
  Zap,
  Plug,
  Users,
  Lock,
  RotateCcw,
  Save,
  Plug2,
  KeyRound,
  FileDown,
} from "lucide-react";

const abas = [
  { id: "geral", label: "Geral & Organização", icon: Building2 },
  { id: "compliance", label: "Compliance & Risco", icon: ShieldCheck },
  { id: "automacao", label: "Automação & Alertas", icon: Zap },
  { id: "integracoes", label: "Integrações & ERP", icon: Plug },
  { id: "membros", label: "Membros & RBAC", icon: Users },
  { id: "seguranca", label: "Segurança & Logs", icon: Lock },
];

export default function SettingsPage() {
  const [abaAtiva, setAbaAtiva] = useState("geral");

  const [bloqueioFinanceiro, setBloqueioFinanceiro] = useState(true);
  const [exigirEsg, setExigirEsg] = useState(true);
  const [varreduraNoturna, setVarreduraNoturna] = useState(true);
  const [validacaoQrCode, setValidacaoQrCode] = useState(true);
  const [consultaListas, setConsultaListas] = useState(true);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-xs text-muted-foreground">
            Sistema & Governança / <span className="font-medium text-blue-700">Preferências Globais</span>
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold">Configurações da Plataforma</h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Gerencie parâmetros de auditoria contínua, regras de homologação automática, integrações
            governamentais e permissões de acesso da sua organização.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline">
            <RotateCcw size={16} aria-hidden />
            Restaurar Padrões
          </Button>
          <Button>
            <Save size={16} aria-hidden />
            Salvar Alterações
          </Button>
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto border-b border-gray-100">
        {abas.map((aba) => {
          const Icon = aba.icon;
          const ativa = abaAtiva === aba.id;
          return (
            <button
              key={aba.id}
              onClick={() => setAbaAtiva(aba.id)}
              className={`flex items-center gap-2 whitespace-nowrap px-4 py-3 text-sm font-medium border-b-2 ${
                ativa
                  ? "border-blue-700 text-blue-700"
                  : "border-transparent text-muted-foreground hover:text-black"
              }`}
            >
              <Icon size={16} aria-hidden />
              {aba.label}
            </button>
          );
        })}
      </div>

      {abaAtiva !== "geral" && (
        <div className="rounded-lg border border-gray-100 bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-muted-foreground">Esta seção ainda está em desenvolvimento.</p>
        </div>
      )}

      {abaAtiva === "geral" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="font-bold">Perfil da Empresa Contratante</h2>
                  <p className="text-sm text-muted-foreground">
                    Dados cadastrais de governança corporativa e parametrização fiscal
                  </p>
                </div>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 shrink-0">
                  Matriz Homologada
                </span>
              </div>

              <div className="flex items-center gap-4 rounded-lg border border-gray-100 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-700 font-bold">
                  AC
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Acme Corp Brasil Soluções S/A</p>
                  <p className="text-xs text-muted-foreground">
                    CNPJ Raiz: 45.120.918/0001-70 • IE: 104.992.411-SP
                  </p>
                </div>
                <Button variant="outline">Alterar Logo</Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Razão Social Completa</label>
                  <input
                    defaultValue="Acme Corp Brasil Soluções em Tecnologia"
                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Nome Fantasia Organizacional</label>
                  <input
                    defaultValue="Acme Enterprise Tech"
                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">E-mail para Alertas Fiscais & CNDs</label>
                  <input
                    defaultValue="compliance-fiscal@acmeenterprise.com.br"
                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Fuso Horário Padrão</label>
                  <select className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm">
                    <option>BRT (Brasília)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="font-bold">Políticas de Homologação & Bloqueio Automático</h2>
                  <p className="text-sm text-muted-foreground">
                    Diretrizes de compliance operacional e regras preventivas financeiras
                  </p>
                </div>
                <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700 shrink-0">
                  Motor Ativo
                </span>
              </div>

              <label className="flex items-start justify-between gap-4 rounded-lg border border-gray-100 p-4">
                <div>
                  <p className="font-medium">Bloqueio financeiro imediato ao identificar CND Federal vencida</p>
                  <p className="text-sm text-muted-foreground">
                    Suspende automaticamente ordens de compra e pagamentos no ERP integrado (SAP) até a
                    regularização e validação das certidões negativas de débito.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={bloqueioFinanceiro}
                  onChange={(e) => setBloqueioFinanceiro(e.target.checked)}
                  className="mt-1 h-5 w-9 shrink-0 accent-blue-700"
                />
              </label>

              <label className="flex items-start justify-between gap-4 rounded-lg border border-gray-100 p-4">
                <div>
                  <p className="font-medium">Exigir Questionário ESG & Due Diligence Estendida</p>
                  <p className="text-sm text-muted-foreground">
                    Obrigatório para fornecedores com volume transacionado estimado acima de R$ 500.000/ano
                    ou fornecimento em categorias de risco crítico.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={exigirEsg}
                  onChange={(e) => setExigirEsg(e.target.checked)}
                  className="mt-1 h-5 w-9 shrink-0 accent-blue-700"
                />
              </label>
            </div>

            <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="font-bold">Automação de OCR & Robôs de Consulta Pública</h2>
                  <p className="text-sm text-muted-foreground">
                    Varredura contínua em órgãos estaduais, federais e certificadoras
                  </p>
                </div>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 shrink-0">
                  3 Robôs Ativos
                </span>
              </div>

              <label className="flex items-start justify-between gap-4 rounded-lg border border-gray-100 p-4">
                <div>
                  <p className="font-medium">Varredura Noturna Automática via Robôs SEFAZ / Receita Federal</p>
                  <p className="text-sm text-muted-foreground">
                    Executado diariamente às 03:00 BRT. Faz o download automático e revalida CND Federal,
                    FGTS e Certidões Trabalhistas (CNDT).
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={varreduraNoturna}
                  onChange={(e) => setVarreduraNoturna(e.target.checked)}
                  className="mt-1 h-5 w-9 shrink-0 accent-blue-700"
                />
              </label>

              <label className="flex items-start justify-between gap-4 rounded-lg border border-gray-100 p-4">
                <div>
                  <p className="font-medium">Validação Automática via QR Code / ICP-Brasil</p>
                  <p className="text-sm text-muted-foreground">
                    Extração por OCR neural de metadados e verificação criptográfica do carimbo de
                    autenticidade emitido por cartórios ou órgãos públicos.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={validacaoQrCode}
                  onChange={(e) => setValidacaoQrCode(e.target.checked)}
                  className="mt-1 h-5 w-9 shrink-0 accent-blue-700"
                />
              </label>

              <label className="flex items-start justify-between gap-4 rounded-lg border border-gray-100 p-4">
                <div>
                  <p className="font-medium">Consulta Contínua a Listas Restritivas Globais & Nacionais</p>
                  <p className="text-sm text-muted-foreground">
                    Monitoramento diário contra bases CEIS (CGU), CNEP, OFAC (Sanções Internacionais), PEP e
                    Cadastro de Empregadores de Trabalho Análogo à Escravidão.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={consultaListas}
                  onChange={(e) => setConsultaListas(e.target.checked)}
                  className="mt-1 h-5 w-9 shrink-0 accent-blue-700"
                />
              </label>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm space-y-3">
              <h2 className="flex items-center gap-2 font-bold">
                <Plug2 size={18} aria-hidden /> Conectores de API
              </h2>
              <div className="rounded-lg border border-gray-100 p-3">
                <p className="font-medium text-sm">SAP S/4HANA Cloud</p>
                <p className="text-xs text-muted-foreground">Sincronização a cada 15 min • Ativo</p>
              </div>
              <div className="rounded-lg border border-gray-100 p-3">
                <p className="font-medium text-sm">Serpro / Receita Federal</p>
                <p className="text-xs text-muted-foreground">Gateway Oficial Gov.br • Operacional</p>
              </div>
              <div className="rounded-lg border border-gray-100 p-3">
                <p className="font-medium text-sm">WhatsApp Dispatcher</p>
                <p className="text-xs text-muted-foreground">Cobrança de docs urgente • Conectado</p>
              </div>
              <Button variant="outline" className="w-full">Configurar novas chaves de API</Button>
            </div>

            <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm space-y-3">
              <h2 className="flex items-center gap-2 font-bold">
                <KeyRound size={18} aria-hidden /> Licença & Quotas
              </h2>
              <div>
                <p className="text-sm">Licenças de Analistas Compras</p>
                <p className="text-sm text-muted-foreground">8 de 12 assentos</p>
              </div>
              <div>
                <p className="text-sm">Fornecedores Monitorados</p>
                <p className="text-sm text-muted-foreground">128 de 500 contratados</p>
              </div>
              <Button variant="outline" className="w-full">Gerenciar Assinatura</Button>
            </div>

            <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm space-y-3">
              <h2 className="flex items-center gap-2 font-bold">
                <ShieldCheck size={18} aria-hidden /> Governança & Segurança
              </h2>
              <div>
                <p className="text-sm font-medium">Retenção de Logs WORM</p>
                <p className="text-xs text-muted-foreground">Armazenamento imutável — 5 Anos</p>
              </div>
              <div>
                <p className="text-sm font-medium">Autenticação MFA / SSO</p>
                <p className="text-xs text-muted-foreground">Obrigatório para todos os administradores</p>
              </div>
              <Button variant="outline" className="w-full">
                <FileDown size={16} aria-hidden /> Baixar Dossiê de Políticas
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}