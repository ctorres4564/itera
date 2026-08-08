# Design System do ITERA

Documento curto de referência. Fonte de verdade dos valores: `tailwind.config.js` (`theme.extend.colors`/`boxShadow`).

## Princípios

- Clareza, concentração, organização, tecnologia, confiança, aprendizagem — sem aparência "hacker"/cyberpunk/neon, sem gradientes chamativos, sem saturação alta. Interface confortável para longos períodos de estudo.
- Componentes não conhecem cores específicas da marca. Usam tokens semânticos (`bg-surface`, `text-text-primary`, `border-border-default`, `text-success`...), nunca `bg-slate-900`/`text-indigo-400` diretamente.
- Trocar a identidade visual no futuro deve exigir mudança só em `tailwind.config.js`, não em cada componente.

## Paleta e tokens

| Token | Hex/valor | Papel |
|---|---|---|
| `brand-primary` | `#6366F1` | Ação primária, marca |
| `brand-primary-hover` | `#818CF8` | Hover de ação primária |
| `brand-secondary` | `#8B5CF6` | Marca secundária, variação sutil |
| `accent` | `#7DD3FC` | Destaque pontual, não-ação |
| `background` | `#020617` | Fundo mais profundo/recuado (blocos de código, editor, saída, tingimento do cabeçalho/sidebar) |
| `surface` | `#0F172A` | Fundo de página, cards, modais, toolbars |
| `surface-elevated` | `#1E293B` | Superfícies em hover/destaque (trilha ativa, trilho da barra de progresso) |
| `surface-muted` | `rgba(2,6,23,0.6)` | Painéis recuados/translúcidos (dicas, saída interna) |
| `text-primary` | `#F1F5F9` | Títulos |
| `text-secondary` | `#CBD5E1` | Corpo de texto |
| `text-muted` | `#94A3B8` | Texto auxiliar/rótulo |
| `text-inverse` | `#FFFFFF` | Texto sobre botão sólido colorido |
| `border-default` | `#1E293B` | Borda padrão |
| `border-strong` | `#475569` | Borda/hover de ênfase |
| `success` / `success-surface` | `#6EE7B7` / `rgba(2,44,34,0.3)` | Texto e superfície de feedback de sucesso |
| `warning` / `warning-surface` | `#FCD34D` / `rgba(69,26,3,0.2)` | Texto e superfície de feedback de aviso |
| `error` / `error-surface` | `#FCA5A5` / `rgba(69,10,10,0.2)` | Texto e superfície de feedback de erro |
| `info` | `#7DD3FC` | Reservado para uso futuro (alias de `accent`) |
| `focus` | `#6366F1` | Anel/contorno de foco |
| `danger-solid` | `#DC2626` | Preenchimento sólido de ação destrutiva |
| `danger-solid-hover` | `#EF4444` | Hover do preenchimento sólido de ação destrutiva |

**Exceção documentada:** o realce de sintaxe Python do editor (`CodeEditor.tsx`, `pythonHighlightStyle`) usa uma paleta própria de tema de código-fonte, independente destes tokens de marca — mesmo que algum valor coincida por acaso, não há relação de dependência entre as duas paletas.

## Ações destrutivas

- `danger-solid` e `danger-solid-hover` são exclusivos para preenchimento sólido de ações destrutivas principais (hoje, só o botão "Confirmar e Reiniciar" em `Header.tsx`).
- `error`/`error-surface` continuam reservados para texto e superfície de mensagem de feedback (tons claros/translúcidos) — não usar `error`/`error-surface` como fundo de botão sólido, pois são claros demais para contraste com `text-inverse`.
- Não usar `danger-solid`/`danger-solid-hover` para texto ou superfície de mensagem de feedback.
- Nenhuma outra cor vermelha (literal ou token) deve ser usada diretamente em componentes fora deste par.

## Tipografia

Sem fonte nova — stack do sistema. Classes reutilizáveis (`src/index.css`, `@layer components`):

| Classe | Uso |
|---|---|
| `.heading-1` | Título principal (nome da unidade) |
| `.heading-2` | Rótulo de seção (uppercase, pequeno) |
| `.text-body` | Corpo de texto |
| `.text-auxiliary` | Texto pequeno/auxiliar |
| `.text-code` | Texto monoespaçado |
| `.text-label` | Rótulo de botão/campo |

## Radius

Sem escala nova — os 3 valores Tailwind já cobrem todos os papéis:
- `rounded` → botões, blocos de código inline
- `rounded-lg` → cards, painéis, modais, editor
- `rounded-full` → pílulas, badges, barra de progresso

## Sombra

- `shadow-modal` → único valor para todos os modais/painéis flutuantes (Header, GuideModal, DeepDivePanel).
- Cards de conteúdo comum não usam sombra (distinção só por borda) — nenhuma sombra nova foi introduzida onde não existia.

## Estados interativos

- `disabled:opacity-40 disabled:cursor-not-allowed` — padrão em todo botão desabilitado.
- `focus:ring-2 focus:ring-focus` — padrão de foco visível em elementos Tailwind.
- No editor (CodeMirror, fora do alcance de classes Tailwind), o contorno de foco e o cursor usam os mesmos valores hex de `focus`/`brand-primary-hover` — comentado no código para manter sincronizado se o token mudar.

## Regras de uso

- Nunca usar classes de cor Tailwind cruas (`bg-slate-*`, `text-indigo-*` etc.) em componentes — sempre um token semântico.
- Botões "fantasma" (ação secundária tingida) seguem o padrão `text-{token} bg-{token}/10 hover:bg-{token}/20 border border-{token}/30`.
- Painéis de feedback (sucesso/aviso/erro) seguem o padrão `bg-{tom}-surface border-{tom}-surface text-{tom}`.
- Distinção entre estados nunca depende só de cor — cada status pedagógico mantém título e ícone/texto próprios (`FeedbackPanel`).
