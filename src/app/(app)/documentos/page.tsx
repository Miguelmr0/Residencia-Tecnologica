
"use client";

import { useMemo, useState } from "react";
import { AlertCircle, CalendarDays, FileText, RefreshCw, Search } from "lucide-react";
import { Badge, type BadgeVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Cards } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDocuments } from "@/features/documents/hooks";
import { useUnits } from "@/features/units/hooks";
import { getDocumentStatus } from "@/lib/document-status";

type FiltroDocumento = "todos" | "validos" | "proximos" | "expirados";

const filtros: { label: string; value: FiltroDocumento }[] = [
  { label: "Todos", value: "todos" },
  { label: "Válidos", value: "validos" },
  { label: "Próximos do vencimento", value: "proximos" },
  { label: "Expirados", value: "expirados" },
];

function formatarData(data: string): string {
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

function statusInfo(status: ReturnType<typeof getDocumentStatus>): {
  label: string;
  variant: BadgeVariant;
} {
  switch (status) {
    case "valido":
      return { label: "Válido", variant: "brand" };
    case "proximo_vencimento":
      return { label: "Próximo do vencimento", variant: "warning" };
    case "expirado":
      return { label: "Expirado", variant: "danger" };
  }
}

export default function DocumentosPage() {
  const [filtro, setFiltro] = useState<FiltroDocumento>("todos");
  const [busca, setBusca] = useState("");

  const {
    data: documentos = [],
    isLoading: carregandoDocumentos,
    isError: erroDocumentos,
    refetch: recarregarDocumentos,
  } = useDocuments();

  const {
    data: unidades = [],
    isLoading: carregandoUnidades,
    isError: erroUnidades,
    refetch: recarregarUnidades,
  } = useUnits();

  const carregando = carregandoDocumentos || carregandoUnidades;
  const ocorreuErro = erroDocumentos || erroUnidades;

  const documentosFiltrados = useMemo(() => {
    return documentos.filter((documento) => {
      const status = getDocumentStatus(documento.expiresAt);
      const unidade = unidades.find(
        (item) => item.id === documento.unitId
      );

      const correspondeAoFiltro =
        filtro === "todos" ||
        (filtro === "validos" && status === "valido") ||
        (filtro === "proximos" && status === "proximo_vencimento") ||
        (filtro === "expirados" && status === "expirado");

      const termo = busca.trim().toLocaleLowerCase("pt-BR");
      const correspondeABusca =
        documento.title.toLocaleLowerCase("pt-BR").includes(termo) ||
        (unidade?.name ?? "").toLocaleLowerCase("pt-BR").includes(termo);

      return correspondeAoFiltro && correspondeABusca;
    });
  }, [documentos, unidades, filtro, busca]);

  const quantidadePorStatus = useMemo(() => {
    return documentos.reduce(
      (total, documento) => {
        const status = getDocumentStatus(documento.expiresAt);
        total[status] += 1;
        return total;
      },
      { valido: 0, proximo_vencimento: 0, expirado: 0 }
    );
  }, [documentos]);

  const tentarNovamente = () => {
    void recarregarDocumentos();
    void recarregarUnidades();
  };

  return (
    <main className="space-y-6 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="size-4" />
            Gestão documental
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Documentos
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Acompanhe os documentos e seus prazos de validade por unidade.
          </p>
        </div>

        <Button variant="outline" onClick={tentarNovamente} disabled={carregando}>
          <RefreshCw className="size-4" />
          Atualizar
        </Button>
      </header>

      {carregando ? (
        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <Cards key={item}>
              <Skeleton className="h-4 w-28" />
              <Skeleton className="mt-4 h-8 w-16" />
            </Cards>
          ))}
        </div>
      ) : ocorreuErro ? (
        <Cards className="border border-destructive/30">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-1 size-5 text-destructive" />
            <div className="flex-1">
              <h2 className="font-semibold text-foreground">
                Não foi possível carregar os documentos.
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Verifique sua conexão e tente novamente.
              </p>
              <Button className="mt-4" onClick={tentarNovamente}>
                Tentar novamente
              </Button>
            </div>
          </div>
        </Cards>
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-3">
            <Cards>
              <p className="text-sm text-muted-foreground">Documentos válidos</p>
              <p className="mt-2 text-3xl font-bold text-foreground">
                {quantidadePorStatus.valido}
              </p>
            </Cards>
            <Cards>
              <p className="text-sm text-muted-foreground">Próximos do vencimento</p>
              <p className="mt-2 text-3xl font-bold text-amber-600">
                {quantidadePorStatus.proximo_vencimento}
              </p>
            </Cards>
            <Cards>
              <p className="text-sm text-muted-foreground">Documentos expirados</p>
              <p className="mt-2 text-3xl font-bold text-destructive">
                {quantidadePorStatus.expirado}
              </p>
            </Cards>
          </section>

          <Cards>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <h2 className="text-lg font-semibold text-foreground">
                  Lista de documentos
                </h2>

                <label className="flex h-10 items-center gap-2 rounded-lg border border-border px-3 lg:w-80">
                  <Search className="size-4 shrink-0 text-muted-foreground" />
                  <input
                    type="search"
                    value={busca}
                    onChange={(evento) => setBusca(evento.target.value)}
                    placeholder="Buscar documento ou unidade..."
                    className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  />
                </label>
              </div>

              <div className="flex flex-wrap gap-2">
                {filtros.map((item) => (
                  <Button
                    key={item.value}
                    variant={filtro === item.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFiltro(item.value)}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>

              {documentosFiltrados.length === 0 ? (
                <div className="flex flex-col items-center py-12 text-center">
                  <FileText className="size-10 text-muted-foreground" />
                  <h3 className="mt-3 font-semibold text-foreground">
                    Nenhum documento encontrado
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Tente mudar o filtro ou o termo da busca.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[650px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground">
                        <th className="px-3 py-3 font-medium">Documento</th>
                        <th className="px-3 py-3 font-medium">Unidade</th>
                        <th className="px-3 py-3 font-medium">Vencimento</th>
                        <th className="px-3 py-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {documentosFiltrados.map((documento) => {
                        const status = getDocumentStatus(documento.expiresAt);
                        const informacao = statusInfo(status);
                        const unidade = unidades.find(
                          (item) => item.id === documento.unitId
                        );

                        return (
                          <tr
                            key={documento.id}
                            className="border-b border-border last:border-0 hover:bg-muted/50"
                          >
                            <td className="px-3 py-4">
                              <div className="flex items-center gap-3">
                                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                                  <FileText className="size-4 text-muted-foreground" />
                                </span>
                                <span className="font-medium text-foreground">
                                  {documento.title}
                                </span>
                              </div>
                            </td>
                            <td className="px-3 py-4 text-muted-foreground">
                              {unidade?.name ?? "Unidade não encontrada"}
                            </td>
                            <td className="px-3 py-4">
                              <span className="inline-flex items-center gap-2 text-muted-foreground">
                                <CalendarDays className="size-4" />
                                {formatarData(documento.expiresAt)}
                              </span>
                            </td>
                            <td className="px-3 py-4">
                              <Badge variant={informacao.variant}>
                                {informacao.label}
                              </Badge>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              <p className="text-xs text-muted-foreground">
                Exibindo {documentosFiltrados.length} de {documentos.length} documentos.
              </p>
            </div>
          </Cards>
        </>
      )}
    </main>
  );
}
