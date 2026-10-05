# VendorHub

Front-end de uma plataforma de gestão corporativa, desenvolvido na Residência da Motiron Technologies. O cenário é o de uma empresa fictícia com várias unidades, que precisa acompanhar documentos, tarefas e indicadores de cada uma em um único painel.

Não há back-end. Os dados são mockados e passam por uma camada que simula o tempo de resposta de uma API, o que deixa a troca por um servidor real localizada em um só arquivo (explicado mais abaixo).

- Squad:<br>
  Felipe de Lima<br>
  Italo Nascimento<br>
  João Lucas Cisneiros<br>
  Karen Evelyn<br>
  Mauricio Adelino<br>
  Miguel Gomes<br>
  Miguel Rodrigues<br>
  Sthefanny Almeida
  
- Aplicação publicada: [Em construção]

## Stack

Next.js 16 (App Router), React 19 e TypeScript, com estilo em Tailwind CSS 4. Os dados são gerenciados pelo TanStack Query, as datas pelo date-fns, os ícones vêm do lucide-react e os testes rodam no Vitest.

TanStack Table, React Hook Form e Zod já estão instalados, mas ainda não foram usados. Entram nas listas e nos formulários.

## Como rodar

É preciso ter o Node 20.9 ou superior.

```bash
git clone [https://github.com/Miguelmr0/Residencia-Tecnologica.git]
cd Residencia-Tecnologica
npm install
npm run dev
```

O app abre em http://localhost:3000.

Para os demais comandos:

```bash
npm test            # testes unitários
npm run lint        # lint
npm run build       # build de produção
npx tsc --noEmit    # checagem de tipos
```

## Organização do código

Tudo fica dentro de `src/`:

```
src/
  app/              rotas e páginas (App Router)
    (app)/          grupo de rotas que usa sidebar e topbar
  components/
    ui/             Button, Badge, Card, Skeleton e demais peças reutilizáveis
    layout/         sidebar, topbar e app-shell
  features/         hooks de dados, um por entidade (units, documents, tasks)
  lib/              regras de negócio e utilitários
  mocks/            dados falsos que simulam a API
  types/            tipos de Unidade, Documento e Tarefa
```

O caminho dos dados é sempre o mesmo: `mocks` alimenta os `hooks`, os hooks alimentam os `componentes`, e as páginas só montam os componentes. Nenhuma página busca dados por conta própria, e nenhum componente de `ui` conhece regra de negócio.

## Decisões técnicas

**Mocks atrás de uma interface assíncrona.** As funções de `src/mocks/db.ts` devolvem Promises com um atraso de 300 a 500 ms, como uma requisição de verdade. Isso permite exibir os estados de carregamento sem esforço extra. Quando existir uma API, só o corpo dessas funções muda; hooks e telas continuam iguais.

**Uma chave de cache para cada entidade.** As chaves ficam em `src/lib/query-keys.ts`. Como as listas e o Dashboard consultam a mesma chave, concluir uma tarefa invalida o cache de tarefas e as duas telas se atualizam sozinhas, sem recarregar a página. É assim que o total de pendências do Dashboard acompanha as listagens.

**Status do documento calculado, nunca armazenado.** A função `getDocumentStatus`, em `src/lib/document-status.ts`, compara a data de validade com o dia atual: se já passou, o documento está expirado; se faltam 15 dias ou menos, está próximo do vencimento; acima disso, é válido. Os testes cobrem as bordas da regra (vencido ontem, vence hoje, 15 dias e 16 dias). A função recebe a data de referência por parâmetro, o que torna os testes independentes do dia em que rodam.

**Dois tipos de estado.** Dados que vêm do servidor ficam no TanStack Query. Estado puramente visual, como menu aberto, filtros e modais, fica em `useState`.

**Tipagem.** As três entidades têm tipos próprios em `src/types`, e o projeto não usa `any`.

**Tema em um só lugar.** Cores e fonte estão no bloco `@theme` de `src/app/globals.css`.

## Regras de negócio

Uma unidade é ativa ou inativa. Unidades inativas não recebem novos documentos nem tarefas, e os itens delas aparecem somente para leitura no detalhamento. Uma tarefa tem status Pendente, Em andamento ou Concluída, e só pode ser concluída depois de uma confirmação do usuário.

Em alguns pontos o enunciado não define o comportamento, então adotamos estas interpretações:

- Na interface, a Unidade aparece como "Fornecedor", seguindo o protótipo. No código, o tipo se chama `Unit`.
- O protótipo prevê um terceiro status de unidade, "Em homologação". Só o status "inativa" bloqueia novos documentos e tarefas.
- No Dashboard, contam como pendência os documentos próximos do vencimento ou expirados e as tarefas com status Pendente.

## Andamento

- [x] Configuração do projeto, tema e providers do TanStack Query
- [x] Tipos das entidades
- [x] Regra de status do documento, com testes
- [x] Dados mockados e hooks de leitura
- [x] Layout responsivo (sidebar e topbar) e componentes base
- [ ] Dashboard (cards e painéis de status)
- [ ] Lista de Unidades, com busca, filtros e paginação
- [ ] Lista de Documentos
- [ ] Lista de Tarefas, com confirmação ao concluir
- [ ] Detalhamento da Unidade
- [ ] Login e proteção de rotas
- [ ] Datas no formato dd/MM/yyyy
- [ ] Extras: camada de API própria, auditoria, dark mode, mais testes e deploy
