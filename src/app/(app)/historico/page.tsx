"use client";

import { Badge, type BadgeVariant } from "@/components/ui/badge";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useHistoric } from "@/features/historic/hooks";
import { differenceInCalendarDays, parseISO, format } from "date-fns";
import { HistoricoLevel } from "@/types/index";
import {
  Download,
  ClipboardClock,
  Bot,
  TrendingUp,
  LockKeyhole,
  AlertTriangle,
  Search,
  SlidersHorizontal
} from "lucide-react";

export default function HistoricoPage() {

    const { data: historico = [], isLoading, isError, refetch} = useHistoric();

    const temErro = isError;
    const carregando = isLoading;
    const tentarNovamente = () => refetch();


    const hoje = new Date();
    const totalRegistros = historico.length;
    const totalDos90 = historico.filter((log) => {
    const dias = differenceInCalendarDays(hoje, parseISO(log.timestamp)); return dias >= 0 && dias <= 90;}).length;
    // Porcentagem dos últimos 90 dias em relação a todo o histórico
    const porcentagem = historico.length === 0 ? 0 : Math.round((totalDos90 / historico.length) * 100);

    const acoesRobos = historico.filter((log) => log.origin === "robo").length;
    const porcentagemRobos = historico.length === 0 ? 0 : Math.round((acoesRobos / historico.length) * 100);

    const alertasDisparados = historico.filter((log) => log.level === "alerta" || log.level === "critico").length;
    const bloqueiosPreventivos = historico.filter((log) => log.type === "Bloqueio").length;

    const StatusHist: Record<HistoricoLevel, { label: string; variant: BadgeVariant }> = {
    sucesso: { label: "Sucesso", variant: "info" },
    informativo: { label: "Informativo", variant: "neutral" },
    alerta: { label: "Atenção", variant: "warning" },
    critico: { label: "Crítico", variant: "danger" },
    };

    // "Mariana Silva" -> "MS"
    function iniciaisAutor(nome: string) {
    return nome
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((parte) => parte[0])
        .join("")
        .toUpperCase();
    }

    const POR_PAGINA = 7; //quantidade de entidades que vão aparecer na pagina
    const [pagina, setPagina] = useState(1);

    {/* usado na barra de filtros */}
    const [busca, setBusca] = useState("");
    const [filtroTipo, setFiltroTipo] = useState("todos");
    const [filtroOrigem, setFiltroOrigem] = useState("todas");
    const [filtroNivel, setFiltroNivel] = useState("todas");

    const tiposAcao = [...new Set(historico.map((log) => log.type))];
    const ordenados = [...historico].sort( (a, b) => parseISO(b.timestamp).getTime() - parseISO(a.timestamp).getTime());

    const logsFiltrados = ordenados.filter((log) =>
        `${log.id} ${log.supplierName} ${log.actorName} ${log.action} ${log.description}`.toLowerCase().includes(busca.toLowerCase()) &&
        (filtroTipo === "todos" || log.type === filtroTipo) &&
        (filtroOrigem === "todas" || log.origin === filtroOrigem) &&
        (filtroNivel === "todas" || log.level === filtroNivel)
    );

    const totalPaginas = Math.max(1, Math.ceil(logsFiltrados.length / POR_PAGINA));
    const inicio = (pagina - 1) * POR_PAGINA;
    const registrosDaPagina = logsFiltrados.slice(inicio, inicio + POR_PAGINA); // aparece até 7 itens na tabela

    {/*usado na paginação */}
    const MAX_BOTOES = 3;
    const primeiroBotao = Math.min(Math.max(1, pagina - 1),Math.max(1, totalPaginas - MAX_BOTOES + 1));
    const numerosPaginas = Array.from({ length: Math.min(MAX_BOTOES, totalPaginas) },(_, i) => primeiroBotao + i);

    const limparFiltros = () => {
        setBusca("");
        setFiltroTipo("todos");
        setFiltroOrigem("todas");
        setFiltroNivel("todas");
        setPagina(1);
    };

    {/* logica para exportar o dossie em csv */}
    const handleExportarDossie = () => {
    const linhas: string[] = [];
    linhas.push("Historico VendorHub");
    linhas.push(`Gerado em;${new Date().toLocaleString("pt-BR")}`);
    linhas.push("");
    linhas.push("Indicador;Valor");
    linhas.push(`Total de registros;${totalRegistros}`);
    linhas.push(`Acoes por robos;${acoesRobos}`);
    linhas.push(`Alertas disparados;${alertasDisparados}`);
    linhas.push(`Bloqueios preventivos;${bloqueiosPreventivos}`);
    linhas.push("ID;Data;Hora;Ator;Setor;Origem;Fornecedor;CNPJ;Acao;Descricao;IP;Detalhe;Nivel");
    ordenados.forEach((log) => {
    const data = format(parseISO(log.timestamp), "dd/MM/yyyy");
    const hora = format(parseISO(log.timestamp), "HH:mm:ss");
    linhas.push(`${log.id};${data};${hora};${log.actorName};${log.actorRole};${log.origin}`
        + `;${log.supplierName};${log.supplierCnpj};${log.action};${log.description}`
        + `;${log.ipAddress};${log.detail};${log.level}`);
    });

    const csv = linhas.join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `dossie-vendorhub-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    };

    return (
    <div className="space-y-6">
        {/* primeira coluna */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold">
                Histórico de auditoria e compliance
                </h1>

                <Badge variant="info">● Atualizado hoje</Badge>
            </div>

            <p className="text-sm text-gray-600">
                Trilha Completa e imutável de eventos, alterações cadastrais, validações de documentos e logs de sistema.
            </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">

            <Button variant="default" className="w-full sm:w-[168px] h-10" onClick={handleExportarDossie}>
                <Download aria-hidden />
                Exportar Dossiê
            </Button>

            </div>

        </div>

        {temErro ? (
                <div role="alert" className="flex flex-col items-start gap-3 rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
                  <p className="font-semibold">Não foi possível carregar os dados do dashboard.</p>
                  <Button onClick={tentarNovamente}>Tentar novamente</Button>
                </div>
              ) : carregando ? (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {[0, 1, 2].map((i) => (
                            <div key={i} className="h-[158px] rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="mt-4 h-9 w-16" />
                            <Skeleton className="mt-6 h-4 w-32" />
                        </div>
                    ))}
                    </div>

                    <div className="w-full h-[166px] rounded-lg bg-[#FFFFFF] p-4 shadow-sm">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="mt-8 h-10 w-full" />
                    </div>
                  
                    <div className="flex w-full flex-col rounded-lg border border-[#F3F4F6] bg-[#FFFFFF] py-4 shadow-sm">
                        <Skeleton className="h-10 w-full" />
                    </div>
                </>
            ) : (
        <>
        {/* segunda coluna */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* cartão 1 */}
            <div className="w-full h-[158px] rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                    <p className="text-[17px] font-semibold tracking-wider text-gray-600">
                    Total registros
                    </p>

                    <Badge variant="info" className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-lg">
                    <ClipboardClock size={21} />
                    </Badge>
                </div>

                <h2 className="mt-0 text-3xl font-bold text-black">
                    {totalRegistros}
                </h2>

                <div className="mt-5 flex items-center gap-2 text-[14px] text-gray-600">
                    <Badge variant="brand" className="gap-1">
                    <TrendingUp size={12} />
                    {porcentagem}%
                    </Badge>
                    nos últimos 90 dias
                </div>
            </div>

             {/* cartão 2 */}
            <div className="w-full h-[158px] rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                    <p className="text-[17px] font-semibold tracking-wider text-gray-600">
                    Ações por robôs
                    </p>

                    <Badge variant="info" className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-lg">
                    <Bot size={21} />
                    </Badge>
                </div>

                <h2 className="mt-0 text-3xl font-bold text-black">
                    {acoesRobos}
                </h2>

                <div className="mt-5 flex items-center gap-2 text-[14px] text-gray-600">
                    <Badge variant="brand" className="gap-1">
                    <TrendingUp size={12} />
                    {porcentagemRobos}%
                    </Badge>
                    do total automatizado
                </div>
            </div>

            {/* cartão 3 */}
            <div className="w-full h-[158px] rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                    <p className="text-[17px] font-semibold tracking-wider text-gray-600">
                    Alertas disparados
                    </p>

                    <Badge variant="danger" className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-lg">
                    <AlertTriangle size={21} />
                    </Badge>
                </div>

                <h2 className="mt-0 text-3xl font-bold text-black">
                    {alertasDisparados}
                </h2>

                <div className="mt-5 flex items-center gap-2 text-[14px] text-gray-600">
                    <Badge variant="danger" className="gap-1">
                    {bloqueiosPreventivos} bloqueios
                    </Badge>
                    preventivos executados
                </div>
            </div>
        </div>

        {/* terceira coluna */}
        <div className="w-full h-[166px] rounded-lg bg-[#FFFFFF] p-4 shadow-sm">

            <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4A5565]" />
                    <input
                        value={busca}
                        onChange={(e) => { setBusca(e.target.value); setPagina(1); }}
                        placeholder="Buscar por Fornecedor, Responsável, Documento ou ID..."
                        className="h-10 w-full rounded-lg bg-[#EFF4FF] pl-9 pr-3 text-sm outline-none"
                    />
                </div>

                <Button variant="ghost" onClick={limparFiltros} className="h-10 gap-2 bg-[#EFF4FF]">
                    <SlidersHorizontal size={16} />
                    Limpar Filtros
                </Button>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">

                <div>
                    <p className="mb-2 text-[11px] font-semibold text-[#4A5565]">TIPO DE AÇÃO</p>
                    <select className={"h-10 w-full rounded-lg border border-[#F3F4F6] bg-white px-3 text-sm"} value={filtroTipo}
                        onChange={(e) => { setFiltroTipo(e.target.value); setPagina(1); }}>
                        
                        <option value="todos">Todos os tipos de ação</option>
                        {tiposAcao.map((tipo) => (
                            <option key={tipo} value={tipo}>{tipo}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <p className="mb-2 text-[11px] font-semibold text-[#4A5565]">ORIGEM DO DISPARO</p>
                    <select className={"h-10 w-full rounded-lg border border-[#F3F4F6] bg-white px-3 text-sm"} value={filtroOrigem}
                        onChange={(e) => { setFiltroOrigem(e.target.value); setPagina(1); }}>
                        
                        <option value="todas">Todas as origens</option>
                        <option value="usuario">Usuário</option>
                        <option value="robo">Robô</option>
                        <option value="sistema">Sistema</option>
                    </select>
                </div>

                <div>
                    <p className="mb-2 text-[11px] font-semibold text-[#4A5565]">NÍVEL DE GRAVIDADE</p>
                    <select className={"h-10 w-full rounded-lg border border-[#F3F4F6] bg-white px-3 text-sm"} value={filtroNivel}
                        onChange={(e) => { setFiltroNivel(e.target.value); setPagina(1); }}>
                        
                        <option value="todas">Todas as gravidades</option>
                        <option value="sucesso">Sucesso</option>
                        <option value="informativo">Informativo</option>
                        <option value="alerta">Atenção</option>
                        <option value="critico">Crítico</option>
                    </select>
                </div>

            </div>
        </div>

        {/* quarta coluna: tabela */}
        <div className="flex w-full flex-col rounded-lg border border-[#F3F4F6] bg-[#FFFFFF] py-4 shadow-sm">

            <div className="flex items-start justify-between gap-3 px-4">
                <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-[18px] font-bold">
                    Trilha Criptográfica de eventos em tempo real
                    </h1>

                    <Badge variant="info">
                    Exibindo {registrosDaPagina.length} eventos mais recentes
                    </Badge>
                </div>
                </div>

                <div className="inline-flex shrink-0 rounded-lg p-1 text-[#4A5565]">
                    <LockKeyhole size={18}/>
                     Protegido contra edição
                </div>

            </div>

            <div className="mt-5 w-full">
                <table className="w-full min-w-[650px] text-left">
                    <thead className="bg-[#EFF4FF]">
                        <tr>
                        <th className="px-4 py-3 text-[12px] font-semibold text-[#4A5565]">
                            DATA/TIMESTAMP
                        </th>
                        <th className="px-4 py-3 text-[12px] font-semibold text-[#4A5565]">
                            ATOR & ORIGEM
                        </th>
                        <th className="px-4 py-3 text-[12px] font-semibold text-[#4A5565]">
                            FORNECEDOR IMPACTADO
                        </th>
                        <th className="px-4 py-3 text-[12px] font-semibold text-[#4A5565]">
                            EVENTO AÇÃO REALIZADA
                        </th>
                        <th className="px-4 py-3 text-[12px] font-semibold text-[#4A5565]">
                            DETALHAMENTO & RASTREIO
                        </th>
                        <th className="px-4 py-3 text-[12px] font-semibold text-[#4A5565]">
                            NÍVEL
                        </th>
                        </tr>
                    </thead>

                    <tbody>
                        {registrosDaPagina.map((log) => {
                            const critico = log.level === "critico";
                            const nivel = StatusHist[log.level];
                            const data = parseISO(log.timestamp);

                            return(
                                <tr key={log.id} className={`border-t border-gray-100 align-top`}>

                                    {/* Data / Timestamp */}
                                    <td className="px-4 py-4 items-center">
                                        <p className={`text-sm font-semibold ${critico ? "text-red-700" : ""}`}>
                                            {format(data, "dd/MM/yyyy")}
                                        </p>
                                        <p className="text-xs text-gray-600">{format(data, "HH:mm:ss")} BRT</p>
                                    </td>

                                    {/* Ator & Origem */}
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full bg-blue-700 text-xs font-semibold text-white">
                                                {log.origin === "usuario" ? iniciaisAutor(log.actorName) : <Bot size={16} />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">{log.actorName}</p>
                                                <p className="text-xs text-gray-600">{log.actorRole}</p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Fornecedor impactado */}
                                    <td className="px-4 py-4">
                                        <div className="text-sm font-semibold text-blue-700">
                                            {log.supplierName}
                                        </div>
                                        <p className="text-xs text-gray-600">CNPJ {log.supplierCnpj}</p>
                                    </td>


                                    {/* Evento / Ação */}
                                    <td className="max-w-[240px] px-4 py-4">
                                        <p className={`text-sm font-semibold ${critico ? "text-red-700" : ""}`}>
                                            {log.action}
                                        </p>
                                        <p className="text-sm text-gray-600">{log.description}</p>
                                    </td>

                                    {/* Detalhamento & Rastreio */}
                                    <td className="px-4 py-4 text-xs">
                                        <p>
                                            IP: <strong>{log.ipAddress}</strong>
                                        </p>
                                        <p className="text-gray-600">{log.detail}</p>
                                    </td>

                                    {/* Nível */}
                                    <td className="px-4 py-4">
                                        <Badge variant={nivel.variant}>{nivel.label}</Badge>
                                    </td>

                                </tr>
                            );
                        })
                    }

                    {registrosDaPagina.length === 0 && (
                        <tr>
                            <td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-600">
                                Nenhum registro encontrado com os filtros atuais.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
            {/* paginação */}
            <div className="mt-auto flex flex-col gap-3 border-t border-gray-100 px-4 pt-4 pb-4 text-xs text-gray-600 bg-[#EFF4FF] sm:flex-row sm:items-center sm:justify-between">
                <p>
                    Mostrando{" "}
                    <strong>
                    {logsFiltrados.length === 0 ? 0 : inicio + 1}-{Math.min(inicio + POR_PAGINA, logsFiltrados.length)}
                    </strong>{" "}
                    de <strong>{logsFiltrados.length}</strong> logs indexados
                </p>

                <div className="flex items-center gap-1">
                    <Button variant="ghost" disabled={pagina === 1} onClick={() => setPagina(pagina - 1)} className={"border-full bg-[#FFFFFF]"}>
                    Anterior
                    </Button>

                    <Button variant="ghost" className={numerosPaginas.includes(1) ? "hidden!" : ""} onClick={() => setPagina(1)}>
                    1
                    </Button>
                    <span className={numerosPaginas.includes(1) ? "hidden" : "px-1 text-gray-600"}>. . .</span>

                    {numerosPaginas.map((n) => (
                    <Button key={n} variant={n === pagina ? "default" : "ghost"} onClick={() => setPagina(n)}>
                        {n}
                    </Button>
                    ))}

                    <span className={numerosPaginas.includes(totalPaginas) ? "hidden" : "px-1 text-gray-600"}>. . .</span>
                    <Button variant="ghost" className={numerosPaginas.includes(totalPaginas) ? "hidden!" : ""} onClick={() => setPagina(totalPaginas)}>
                    {totalPaginas}
                    </Button>

                    <Button variant="ghost" disabled={pagina === totalPaginas} onClick={() => setPagina(pagina + 1)} className={"border-full bg-[#FFFFFF]"}>
                    Próxima
                    </Button>
                </div>
            </div>
        </div>
        </>
        )}
    </div>
    );
}