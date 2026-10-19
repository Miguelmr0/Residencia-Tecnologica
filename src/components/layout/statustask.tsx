"use client";
import { CheckCircle2 } from "lucide-react";
import { useTasks } from "@/features/tasks/hooks";
import { startOfWeek, endOfWeek, isWithinInterval, parseISO} from "date-fns";

export default function StatusTarefas() {
  
  const { data: tasks = [], isLoading: loadTasks, isError: errorTasks, refetch: refetchTasks } = useTasks();
  
  const pendentes = tasks.filter((t) => t.status === "pendente").length;
  const andamento = tasks.filter((t) => t.status === "em_andamento").length;
  const concluidas = tasks.filter((t) => t.status === "concluida").length;
  const total = pendentes + andamento + concluidas;

  {/* meta semanal */}
  const metaSemanal = 50;
  const hoje = new Date();
  const semana = { start: startOfWeek(hoje), end: endOfWeek(hoje) };
  const tarefasDaSemana = tasks.filter((t) => isWithinInterval(parseISO(t.dueDate), semana));
  const concluidasNaSemana = tarefasDaSemana.filter((t) => t.status === "concluida").length;
  const taxaSemanal = tarefasDaSemana.length > 0 ? Math.round((concluidasNaSemana / tarefasDaSemana.length) * 100) : 0;

  const segmentos = [
    { valor: concluidas, cor: "#2450E8" },
    { valor: andamento, cor: "#3475FF" },
    { valor: pendentes, cor: "#596178" },
  ];

  const indicadores = [
    { nome: "Pendentes", valor: pendentes, cor: "#596178" },
    { nome: "Em andamento", valor: andamento, cor: "#3475FF" },
    { nome: "Concluídas", valor: concluidas, cor: "#2450E8" },
  ];

  return (
    <div className="mt-6 flex flex-col gap-5 xl:mt-10">

      {/* Barra de progresso */}
      <div className="flex flex-col gap-2">

        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-slate-800">
            Progresso geral de resolução
          </span>

          <span className="text-base font-bold text-slate-900">
            {total > 0 ? (concluidas / total * 100).toFixed(1) : 0}% concluído
          </span>
        </div>

        <div className="flex h-2 w-full gap-0.5 overflow-hidden rounded-full bg-[#E9EDF5]">
          {segmentos.map((segmento, indice) => (
            <div
              key={indice}
              style={{
                width: `${total > 0 ? (segmento.valor / total) * 100 : 0}%`,
                backgroundColor: segmento.cor,
              }}
            />
          ))}
        </div>

      </div>

      {/* Cartões por status */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">

        {indicadores.map((item) => (
          <div
            key={item.nome}
            className="min-w-0 rounded-lg bg-[#EFF4FF] px-3 py-3"
          >

            <div className="flex min-h-8 items-start gap-2 sm:min-h-0">
              <span
                className="mt-[3px] h-[11px] w-[11px] shrink-0 rounded-full"
                style={{ backgroundColor: item.cor }}
              />

              <span className="text-xs leading-tight text-slate-800 sm:text-sm">
                {item.nome}
              </span>
            </div>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              {item.valor}
            </p>

            <p className="text-xs text-gray-600">
              {total > 0 ? (item.valor / total * 100).toFixed(1) : 0}%
            </p>

          </div>
        ))}

      </div>

      {/* Taxa de conclusão semanal */}
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-lg bg-[#DCE7FF] px-3 py-3 text-sm">

        <span className="flex items-center gap-2 text-slate-800">
          <CheckCircle2 size={18} className="shrink-0 text-[#2450E8]" />
          Taxa de conclusão de tarefas pendentes nesta semana:
        </span>

        <span className="font-bold text-[#2450E8]">
          {taxaSemanal}% (Meta {metaSemanal}%)
        </span>

      </div>

    </div>
  );
}
