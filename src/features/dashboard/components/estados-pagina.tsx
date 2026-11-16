import { Button } from "@/components/ui/button";
import { EsqueletoIndicadores } from "./coluna-indicadores";
import { EsqueletoStatusFornecedores } from "./cartao-status-fornecedores";
import { EsqueletoStatusTarefas } from "./cartao-status-tarefas";
import { EsqueletoDocumentos } from "./cartao-documentos";
import { EsqueletoTarefas } from "./cartao-tarefas-pendentes";
import { EsqueletoContratos } from "./cartao-contratos";
import { EsqueletoAtividades } from "./cartao-atividades-recentes";

export function EstadoErro({ tentarNovamente }: { tentarNovamente: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-start gap-3 rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
      <p className="font-semibold">Não foi possível carregar os dados do dashboard.</p>
      <Button onClick={tentarNovamente}>Tentar novamente</Button>
    </div>
  );
}

// Junta o skeleton de cada cartão, na mesma grid de cada coluna
export function EstadoCarregando() {
  return (
    <>
      <EsqueletoIndicadores />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <EsqueletoStatusFornecedores />
        <EsqueletoStatusTarefas />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <EsqueletoDocumentos />
        <EsqueletoTarefas />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <EsqueletoContratos />
        <EsqueletoAtividades />
      </div>
    </>
  );
}
