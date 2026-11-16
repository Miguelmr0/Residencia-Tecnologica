import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Task, Unit, UnitDocument } from "@/types";
import { calcularIndicadores } from "./coluna-indicadores";

type Resumo = { fornecedores: number; fornecedoresAtivos: number; documentosAVencer: number; tarefasPendentes: number };

function montarCsvRelatorio(units: Unit[], resumo: Resumo) {
  const linhas: string[] = [];
  linhas.push("Relatorio VendorHub");
  linhas.push(`Gerado em: ${new Date().toLocaleString("pt-BR")}`);
  linhas.push("");
  linhas.push("Indicador;Valor");
  linhas.push(`Fornecedores;${resumo.fornecedores}`);
  linhas.push(`Fornecedores ativos;${resumo.fornecedoresAtivos}`);
  linhas.push(`Documentos a vencer;${resumo.documentosAVencer}`);
  linhas.push(`Tarefas pendentes;${resumo.tarefasPendentes}`);
  linhas.push("");
  linhas.push("Fornecedor;Cidade;Responsavel;Status");
  units.forEach((u) => {
    linhas.push(`${u.name};${u.city};${u.manager};${u.status}`);
  });
  return linhas.join("\n");
}

function baixarCsv(csv: string) {
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `relatorio-vendorhub-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

type Props = { units: Unit[]; docs: UnitDocument[]; tasks: Task[] };

// logica para exportar o relatorio em csv
export function BotaoExportarRelatorio({ units, docs, tasks }: Props) {
  const handleExportarRelatorio = () => {
    const { fornecedores, fornecedoresAtivos, documentosAVencer, tarefasPendentes } = calcularIndicadores(units, docs, tasks);

    baixarCsv(montarCsvRelatorio(units, { fornecedores, fornecedoresAtivos, documentosAVencer, tarefasPendentes }));
  };

  return (
    <Button variant="outline" className="w-full sm:w-[168px] h-10" onClick={handleExportarRelatorio}>
      <Download aria-hidden />
      Exportar Relatório
    </Button>
  );
}
