"use client";

import { useUnits } from "@/features/units/hooks";

export default function StatusFornecedores() {
  
  const { data: units = [], isLoading: loadUnits, isError: errorUnits, refetch: refetchUnits } = useUnits();
  
  const total = units.length;
  const ativos = units.filter((u) => u.status === "ativa").length;
  const inativos = units.filter((u) => u.status === "inativa").length;
  const homologacao = units.filter((u) => u.status === "em_homologacao").length;

  const raio = 70;
  const circunferencia = 2 * Math.PI * raio;

  const segmentos = [
    { valor: ativos, cor: "#2450E8" },
    { valor: inativos, cor: "#596178" },
    { valor: homologacao, cor: "#3475FF" },
  ];

  let acumulado = 0;

  const indicadores = [
    { nome: "Ativos", valor: ativos, cor: "#2450E8" },
    { nome: "Inativos", valor: inativos, cor: "#596178" },
    { nome: "Em homologação", valor: homologacao, cor: "#3475FF" },
  ];

  return (
    <div className="mt-10 grid grid-cols-1 items-center gap-8 sm:grid-cols-2">

      {/* Gráfico circular */}
      <div className="flex justify-center">
        <svg
          viewBox="0 0 160 160"
          className="h-[176px] w-[176px]"
        >
          {/* Fundo do círculo */}
          <circle
            cx="80"
            cy="80"
            r={raio}
            fill="none"
            stroke="#E9EDF5"
            strokeWidth="20"
          />

          {/* Segmentos coloridos */}
          {segmentos.map((segmento, indice) => {
            const comprimento =
            total > 0 ? (segmento.valor / total) * circunferencia : 0;

            const deslocamento = acumulado;
            acumulado += comprimento;

            return (
              <circle
                key={indice}
                cx="80"
                cy="80"
                r={raio}
                fill="none"
                stroke={segmento.cor}
                strokeWidth="20"
                strokeLinecap="round"
                strokeDasharray={`${comprimento} ${circunferencia}`}
                strokeDashoffset={-deslocamento}
                transform="rotate(-90 80 80)"
              />
            );
          })}

          {/* Número central */}
          <text
            x="80"
            y="80"
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-slate-900"
            fontSize="23"
            fontWeight="bold"
          >
            {ativos}
          </text>

          {/* Texto central */}
          <text
            x="80"
            y="97"
            textAnchor="middle"
            className="fill-slate-600"
            fontSize="10"
          >
            Ativos
          </text>
        </svg>
      </div>

      <div className="flex w-full flex-col gap-2">

        {indicadores.map((item) => (
          <div
            key={item.nome}
            className="grid min-h-[36px] grid-cols-[12px_minmax(0,1fr)_32px_52px] items-center gap-2 rounded-lg bg-[#EFF4FF] px-2 py-2"
          >
            
            <span
              className="h-[11px] w-[11px] rounded-full"
              style={{ backgroundColor: item.cor }}
            />

            <span className="text-sm text-slate-800">
              {item.nome}
            </span>

            <span className="text-right text-sm font-bold text-slate-900">
              {item.valor}
            </span>

            <span className="text-right text-[11px] text-gray-600">
              {total > 0 ? (item.valor / total * 100).toFixed(1) : 0}%
            </span>
          </div>
        ))}

      </div>

    </div>
  );
}
