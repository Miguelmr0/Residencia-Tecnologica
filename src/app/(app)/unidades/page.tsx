"use client"; // roda no navegador (necessário porque usamos o hook useUnits)

import { Button } from "@/components/ui/button";
import { useUnits } from "@/features/units/hooks";
import type { UnitStatus } from "@/types"; // só o tipo: "ativa" | "inativa" | "em_homologacao"

// Texto que aparece na tela para cada status.
// Record<UnitStatus, string> obriga a ter um texto para TODOS os status:
// se surgir um status novo e ninguém colocar aqui, o TypeScript avisa.
const statusLabel: Record<UnitStatus, string> = {
  ativa: "Ativo",
  inativa: "Inativo",
  em_homologacao: "Em homologação",
};

// Classes do Tailwind (cor de fundo + cor do texto) de cada status.
// bg-green-100 = fundo verde bem clarinho
// text-green-800 = texto verde escuro
const statusStyle: Record<UnitStatus, string> = {
  ativa: "bg-green-100 text-green-800",
  inativa: "bg-red-100 text-red-800",
  em_homologacao: "bg-amber-100 text-amber-800",
};

export default function UnidadesPage() {
  // Pega do hook: a lista (data, renomeada para units), se está carregando,
  // se deu erro e a função refetch, que busca os dados de novo.
  // A página não busca nada sozinha, só usa o que o hook entrega.
  const { data: units, isLoading, isError, refetch } = useUnits();

  return (
    // space-y-6 = espaço de 24px entre os blocos da página
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Fornecedores</h1>
        <p className="text-slate-600">
          Base centralizada de parceiros comerciais, homologações e
          conformidade cadastral.
        </p>
      </header>

      {/* Estado de loading: "se está carregando, mostre as barras cinzas".
          animate-pulse faz elas piscarem; aria-busy avisa leitores de tela. */}
      {isLoading && (
        <div className="space-y-3" aria-busy="true">
          <div className="h-12 animate-pulse rounded-lg bg-slate-200" />
          <div className="h-12 animate-pulse rounded-lg bg-slate-200" />
          <div className="h-12 animate-pulse rounded-lg bg-slate-200" />
        </div>
      )}

      {/* Estado de erro: mostra a mensagem e um botão que chama o refetch.
          role="alert" faz o leitor de tela anunciar o erro. */}
      {isError && (
        <div role="alert" className="space-y-3">
          <p>Erro ao carregar os fornecedores.</p>
          <Button onClick={() => refetch()}>Tentar novamente</Button>
        </div>
      )}

      {/* Estado vazio: carregou, não deu erro, mas a lista está sem itens.
          O "?." evita quebrar quando units ainda não existe. */}
      {!isLoading && !isError && units?.length === 0 && (
        <p>Nenhum fornecedor encontrado.</p>
      )}

      {/* Tabela: só aparece quando terminou de carregar e existem dados */}
      {!isLoading && !isError && units && units.length > 0 && (
        // overflow-x-auto = no celular a rolagem lateral fica só na tabela,
        // e não na página inteira
        <div className="overflow-x-auto rounded-xl bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Empresa</th>
                <th className="px-4 py-3">Cidade</th>
                <th className="px-4 py-3">Gerente</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {/* .map cria uma linha para cada unidade da lista.
                  key = id único, que o React usa para identificar cada linha. */}
              {units.map((unit) => (
                <tr key={unit.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium">{unit.name}</td>
                  <td className="px-4 py-3">{unit.city}</td>
                  <td className="px-4 py-3">{unit.manager}</td>
                  <td className="px-4 py-3">
                    {/* Etiqueta do status: pega a cor e o texto nos dois
                        objetos de cima, usando unit.status como chave */}
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyle[unit.status]}`}
                    >
                      {statusLabel[unit.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}