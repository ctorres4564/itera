# Arquitetura do Projeto ITERA

Este documento descreve a organização arquitetural do projeto **ITERA**, estabelecida durante a **Etapa 1 — Fundação**.

## Objetivo da Separação
Para garantir modularidade e independência tecnológica, a plataforma é estruturada em três camadas independentes:
1. **Plataforma**: Gerencia a navegação, progresso do usuário e carregamento de trilhas e unidades.
2. **Motores de Atividade**: Executam e validam as respostas do usuário de acordo com o tipo de atividade.
3. **Conteúdo**: Arquivos JSON que definem a estrutura pedagógica e textos Markdown da trilha.

> [!NOTE]
> O núcleo da plataforma não depende de tecnologias específicas de execução (como Pyodide) ou edição (como CodeMirror). Nesta primeira fase de validação, **apenas o motor de código (Python)** será implementado.

## Estrutura de Diretórios Inicial

A estrutura do projeto está organizada da seguinte forma:

```text
src/
  core/           -> Regras de negócio, progresso, currículo e persistência
  activities/     -> Motores de execução de atividades (especificamente code/ nesta fase)
  content/        -> Arquivos de dados de cursos, trilhas e unidades
  components/     -> Componentes visuais comuns (layout, feedback, deep-dive)
  pages/          -> Telas principais da aplicação
  schemas/        -> Schemas de validação de dados (ex: Zod)
  tests/          -> Testes unitários e de integração
docs/             -> Documentação do projeto
```

## Especificação Principal
Para detalhes completos de requisitos, regras de implementação e limites de escopo, consulte a especificação oficial em [ITERA-SKILL.md](file:///c:/itera/agent/ITERA-SKILL.md).
