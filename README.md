# Dashboard de Inventário

Painel de estoque com cadastro de produtos, filtros, indicadores e exportação de relatórios. Projeto de interface desenvolvido com Next.js, React e TypeScript.

[Visualizar projeto](https://dashboard-de-inventario.vercel.app) · [Portfólio](https://mrleorobot.github.io/)

## Recursos

- Cadastro, edição e exclusão de produtos na interface.
- Busca e filtros para consultar o inventário.
- Indicadores e gráficos de estoque e vendas.
- Alertas visuais para produtos com estoque baixo.
- Exportação de relatórios em CSV, Excel e PDF.

A versão atual inicia com dados definidos em `app/page.tsx` e mantém as alterações no estado React da sessão. Isso permite explorar o painel como demonstração.

## Tecnologias

Next.js, React, TypeScript, Tailwind CSS, Framer Motion, Recharts, SheetJS e jsPDF.

## Executar localmente

Requisitos: Node.js e pnpm.

```bash
git clone https://github.com/mrleorobot/Dashboard_De_Inventario.git
cd Dashboard_De_Inventario
pnpm install
pnpm dev
```

Abra o endereço exibido pelo servidor no terminal.

Para gerar e servir a versão de produção:

```bash
pnpm build
pnpm start
```

## Estrutura

| Caminho | Conteúdo |
| --- | --- |
| [app/page.tsx](app/page.tsx) | Painel, dados iniciais, interações e exportações |
| [components/](components/) | Componentes da interface |
| [hooks/](hooks/) | Hooks auxiliares |
| [lib/](lib/) | Utilitários |
| [public/](public/) | Arquivos estáticos |
| [package.json](package.json) | Dependências e comandos |

## Licença

MIT © Leonilson Souza
