# Design System do ITERA

Documento curto de referência. Fonte de verdade dos valores: `tailwind.config.js` (`theme.extend.colors`/`boxShadow`).

## Princípios

- Identidade violeta profunda, autoral e reconhecível — aprendizagem, tecnologia, clareza, profundidade, concentração, confiança. Sem aparência de SaaS genérico azul/indigo, sem neon, cyberpunk, gamer, gradientes chamativos ou saturação exagerada. Interface confortável para longos períodos de estudo.
- O violeta é a **assinatura** da marca (logo, ação primária, item ativo, progresso, foco, badges, detalhes de cards principais) — não pinta a aplicação inteira. Superfícies continuam neutras/escuras.
- Componentes não conhecem cores específicas da marca. Usam tokens semânticos (`bg-surface`, `text-text-primary`, `border-border-default`, `text-success`...), nunca `bg-violet-900`/`text-purple-400` diretamente.
- Trocar a identidade visual no futuro deve exigir mudança só em `tailwind.config.js`, não em cada componente.

## Paleta e tokens

| Token | Hex/valor | Papel |
|---|---|---|
| `brand-primary` | `#7C3AED` | Violeta profundo — ação primária (fundo de botão), logo, barra de progresso, foco. |
| `brand-primary-hover` | `#6D28D9` | Hover/estado ativo de preenchimentos sólidos com `brand-primary` (hover de botão primário). Escuro demais para servir de indicador visível (texto pequeno, cursor do editor) — ver nota de acessibilidade abaixo. |
| `brand-secondary` | `#A78BFA` | Lavanda — texto de marca em qualquer tamanho pequeno, destaques secundários, itens ativos, aprofundamento. |
| `accent` | `#F472B6` | Coral/rosa-violeta — só detalhes pontuais pequenos (ícones, badges opcionais). Nunca em grandes superfícies, nunca para sucesso/aviso/erro. |
| `background` | `#0B0714` | Fundo **principal da aplicação** — o canvas da página (`MainLayout`). |
| `surface` | `#151022` | Cards, painéis, modais, toolbars — superfícies principais que se apoiam sobre o `background`. |
| `surface-elevated` | `#21182F` | Superfícies elevadas — hover, item ativo (Sidebar), trilho da barra de progresso. |
| `surface-muted` | `#100B1B` | Áreas recuadas/secundárias — editor, blocos de código, painel de saída, dicas, detalhes técnicos. |
| `text-primary` | `#F8F7FC` | Títulos. |
| `text-secondary` | `#D7D0E3` | Corpo de texto. |
| `text-muted` | `#9F95B0` | Texto auxiliar/rótulo. |
| `text-inverse` | `#FFFFFF` | Texto sobre botão sólido colorido. |
| `border-default` | `#302541` | Borda padrão. |
| `border-strong` | `#55436D` | Borda/hover de ênfase. |
| `success` / `success-surface` | `#6EE7B7` / `#0D2A23` | Texto e superfície de feedback de sucesso — **independente da marca**. |
| `warning` / `warning-surface` | `#FCD34D` / `#33260A` | Texto e superfície de feedback de aviso — independente da marca. |
| `error` / `error-surface` | `#FCA5A5` / `#351010` | Texto e superfície de feedback de erro — independente da marca. |
| `info` | `#C4B5FD` | Reservado para uso futuro (lavanda clara — não é mais alias de `accent`). |
| `focus` | `#A78BFA` | Anel/contorno de foco. |
| `danger-solid` / `danger-solid-hover` | `#DC2626` / `#EF4444` | Preenchimento sólido de ação destrutiva — exclusivo, não é violeta. |

**Papel semântico dos quatro fundos (não inverter):** `background` = fundo principal da app; `surface` = cards/painéis que se apoiam sobre ele; `surface-elevated` = estado elevado/ativo/hover; `surface-muted` = área recuada/secundária dentro de uma superfície (editor, blocos de código, saída). O editor **não** usa `background` — ele é uma área recuada da interface, não o fundo principal da aplicação.

**Estados semânticos (success/warning/error) nunca são substituídos por violeta** — o violeta representa marca, não status pedagógico. Eles continuam com seus próprios tons (verde/âmbar/vermelho claro), e cada estado mantém título e ícone próprios além da cor (`FeedbackPanel`).

**Nota de acessibilidade — `brand-primary-hover`:** o valor original proposto (`#8B5CF6`) dava texto branco sobre o botão "Executar" em `:hover` com 4,23:1 (abaixo do AA de texto normal, 4,5:1). Ajustado para `#6D28D9`, que sobe esse contraste para 7,1:1 e mantém `#7C3AED` (`brand-primary`, estado normal) intocado. Esse valor mais escuro, porém, cai abaixo de 3:1 como indicador visível sobre fundos recuados — por isso o cursor do editor (que usava `brand-primary-hover`) passou a usar `brand-secondary` (7,1:1 sobre o fundo do editor), a mesma regra de fallback já aplicada a todo texto pequeno de marca (ver "Regras de uso"). Nenhum componente usa mais `brand-primary-hover` como texto ou indicador pequeno — só como fundo sólido no hover do botão primário.

**Exceção documentada — sintaxe do editor:** o realce de sintaxe Python (`CodeEditor.tsx`, `pythonHighlightStyle`) usa uma paleta própria de tema de código-fonte, independente destes tokens de marca. O editor pode usar os mesmos valores hex necessários para fundo/gutter/cursor/foco/seleção (sincronizados manualmente com os tokens, comentado no código), mas a paleta de cores da sintaxe em si (palavras-chave, strings, funções, comentários) não é violeta e não depende de `brand-*`/`accent`, mesmo que algum valor coincida por acaso.

## Ações destrutivas

- `danger-solid` e `danger-solid-hover` são exclusivos para preenchimento sólido de ações destrutivas principais (hoje, só o botão "Confirmar e Reiniciar" em `Header.tsx`).
- `error`/`error-surface` continuam reservados para texto e superfície de mensagem de feedback — não usar como fundo de botão sólido.
- Nenhuma outra cor vermelha (literal ou token) deve ser usada diretamente em componentes fora deste par.

## Tipografia

Sem fonte nova — stack do sistema, hierarquia inalterada. Classes reutilizáveis (`src/index.css`, `@layer components`):

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
- No editor (CodeMirror, fora do alcance de classes Tailwind), o contorno de foco usa o valor hex de `focus`, o cursor usa `brand-secondary` (ver nota de acessibilidade) e a seleção de texto usa `brand-primary` em baixa opacidade — comentado no código para manter sincronizado se um token mudar.

## Regras de uso

- Nunca usar classes de cor Tailwind cruas (`bg-violet-*`, `bg-purple-*` etc.) em componentes — sempre um token semântico.
- **Texto de marca pequeno usa `brand-secondary`, não `brand-primary`/`brand-primary-hover`.** `brand-primary` só rende AA como texto em tamanho grande/negrito (ex.: o logo "ITERA", `text-xl font-bold`) — como texto pequeno (rótulos, badges, títulos de seção, itens de lista) sobre qualquer superfície escura do app, `brand-primary` e `brand-primary-hover` ficam abaixo de 4.5:1. `brand-secondary` mantém contraste confortável (>6:1) em todos os casos testados. `brand-primary`/`brand-primary-hover` seguem reservados para preenchimento sólido (botão primário, progresso) e para o logo.
- Botões "fantasma" (ação secundária tingida) seguem o padrão `text-{token} bg-{token-marca}/10 hover:bg-{token-marca}/20 border border-{token-marca}/30` — quando o token de marca é `brand-primary`, o texto usa `brand-secondary` pelo motivo acima (fundo continua tingido de `brand-primary`).
- Painéis de feedback (sucesso/aviso/erro) seguem o padrão `bg-{tom}-surface border-{tom}-surface text-{tom}`.
- Distinção entre estados nunca depende só de cor — cada status pedagógico mantém título e ícone/texto próprios (`FeedbackPanel`).
- `Executar` é a ação visualmente primária (`bg-brand-primary`/`hover:bg-brand-primary-hover`, `text-inverse`) — é a interação mais frequente do fluxo de prática. `Verificar` permanece claramente distinguível, mas com tratamento neutro elevado (`bg-surface-elevated`) para não competir visualmente com `Executar`.
