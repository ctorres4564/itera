# ITERA — Skill de Implementação da Primeira Fase

## Finalidade

Esta skill orienta um agente de código na implementação da primeira fase do ITERA.

O objetivo não é construir um curso completo de Python. O objetivo é entregar e validar uma única experiência vertical completa:

**Unidade 1.1 — Exibindo mensagens com `print()`**

A implementação deve provar que o núcleo pedagógico, a interface, o motor de atividade, a execução segura, o feedback, as dicas, o aprofundamento opcional e a persistência funcionam juntos.

---

## 1. Princípios obrigatórios

### 1.1 Arquitetura multiconteúdo

O ITERA deve ser estruturado em três camadas independentes:

```text
Plataforma
+ Motores de atividade
+ Conteúdo
```

O núcleo da plataforma não pode depender diretamente de Python, Pyodide ou CodeMirror.

Python é apenas o primeiro conteúdo de validação.

### 1.2 Uma única unidade nesta fase

Implementar somente:

```text
1.1 — Exibindo mensagens com print()
```

Não implementar as unidades 1.2 e 1.3 antes da validação da unidade 1.1.

### 1.3 Conteúdo fora dos componentes

Objetivos, explicações, exemplos, práticas, dicas, feedbacks e aprofundamentos devem ser carregados de arquivos estruturados.

Não hardcode conteúdo pedagógico em componentes React.

### 1.4 Verificação comportamental primeiro

A atividade deve ser avaliada pelo comportamento produzido.

Não exigir código idêntico ao exemplo.

Usar análise estrutural ou AST somente quando existir requisito pedagógico explícito e indispensável.

### 1.5 Execução segura

Código do aluno deve ser executado:

- em Pyodide;
- dentro de Web Worker;
- com timeout;
- com limite de saída;
- sem acesso ao sistema operacional;
- sem bloquear a interface principal.

### 1.6 Aprofundamento opcional

A unidade deve conter:

- percurso essencial obrigatório;
- aprofundamento opcional.

Nenhuma informação indispensável à conclusão pode existir somente no aprofundamento.

### 1.7 Escopo controlado

Não adicionar nesta fase:

- login;
- banco remoto;
- IA;
- gamificação;
- certificados;
- pagamentos;
- painel administrativo;
- ranking;
- terminal interativo completo;
- aplicativo móvel;
- múltiplos cursos;
- outros motores funcionais.

---

## 2. Stack técnica

Utilizar:

| Camada | Tecnologia |
|---|---|
| Interface | React |
| Linguagem | TypeScript |
| Build | Vite |
| Estilo | Tailwind CSS |
| Editor | CodeMirror 6 |
| Python | Pyodide |
| Isolamento | Web Worker |
| Conteúdo | JSON com Markdown |
| Validação | Zod |
| Progresso inicial | localStorage |
| Testes unitários | Vitest |
| Testes E2E | Playwright |

Não substituir essa stack sem justificar tecnicamente no relatório final.

---

## 3. Estrutura arquitetural mínima

Organizar o projeto com separação equivalente a:

```text
src/
  core/
    curriculum/
    progress/
    feedback/
    hints/
    persistence/
    domain/

  activities/
    shared/
    code/
      components/
      engine/
      verifier/
      worker/
      schemas/

  content/
    courses/
      python-iniciante/
        course.json
        tracks/
          fundamentos-interacao.json
        units/
          1.1-print.json

  components/
    layout/
    navigation/
    feedback/
    deep-dive/

  pages/
  schemas/
  tests/

docs/
  arquitetura.md
  modelo-pedagogico.md
  formato-unidade.md
  motor-de-codigo.md
  plano-de-testes.md
```

A estrutura pode variar, desde que preserve as responsabilidades.

---

## 4. Modelo de domínio mínimo

Implementar entidades ou tipos equivalentes para:

- `Course`
- `Track`
- `Unit`
- `ActivityDefinition`
- `ActivityResult`
- `UserProgress`
- `Attempt`
- `HintState`
- `DeepDiveState`

Evitar entidades especulativas que não sejam necessárias à primeira fase.

---

## 5. Contratos obrigatórios

### 5.1 Tipo de atividade

```ts
export type ActivityType =
  | "code"
  | "multiple_choice"
  | "short_answer"
  | "association"
  | "ordering"
  | "case_analysis";
```

Apenas `code` será implementado nesta fase.

Não criar implementações vazias dos demais motores.

### 5.2 Resultado de atividade

```ts
export interface ActivityResult {
  status:
    | "success"
    | "incorrect"
    | "syntax_error"
    | "runtime_error"
    | "timeout"
    | "no_output"
    | "internal_error";

  message: string;
  output?: string;
  technicalDetails?: string;
}
```

### 5.3 Motor de atividade

```ts
export interface ActivityEngine<TConfig, TResponse> {
  type: ActivityType;

  validate(
    response: TResponse,
    config: TConfig
  ): Promise<ActivityResult>;

  reset(): Promise<void>;
}
```

### 5.4 Persistência

```ts
export interface ProgressRepository {
  load(): Promise<UserProgress>;
  save(progress: UserProgress): Promise<void>;
  reset(): Promise<void>;
}
```

Implementar:

```text
CodeActivityEngine
LocalStorageProgressRepository
```

---

## 6. Conteúdo da unidade 1.1

### 6.1 Identificação

```text
ID: 1.1-print
Curso: Python para iniciantes
Trilha: Fundamentos de interação
Título: Exibindo mensagens com print()
```

### 6.2 Objetivo

Ao final da unidade, o aluno deve conseguir usar `print()` para exibir uma mensagem.

### 6.3 Conhecimentos essenciais

O conteúdo principal deve explicar:

- programas podem exibir informações;
- `print()` é uma função;
- textos ficam entre aspas;
- argumentos ficam entre parênteses;
- o código precisa ser executado;
- a saída aparece em um painel próprio.

### 6.4 Exemplo

```python
print("Olá")
```

### 6.5 Aplicação

```python
print("Meu diário de saúde")
```

### 6.6 Atividade

O aluno deve produzir exatamente esta saída:

```text
Meu diário de saúde
```

### 6.7 Código inicial

```python
# Escreva seu código abaixo
```

---

## 7. Aprofundamento opcional

Criar uma área separada com:

- origem da necessidade de saída em programas;
- terminal;
- introdução a `stdout`;
- diferença entre Python 2 e Python 3;
- equivalentes em JavaScript e Java;
- boas práticas;
- curiosidades;
- desafio extra.

O desafio extra deve pedir duas mensagens em linhas diferentes.

O aprofundamento:

- não bloqueia o avanço;
- não altera a conclusão principal;
- pode registrar estado `not_started`, `viewed` ou `completed`.

---

## 8. Dicas graduais

Permitir de uma a spins dicas.

Liberar somente uma por ação.

Para a unidade 1.1, usar uma progressão semelhante:

1. Use uma função que exibe informações.
2. A função se chama `print`.
3. A mensagem deve ficar entre aspas.
4. A mensagem e as aspas ficam dentro dos parênteses.
5. Estrutura: `print("mensagem")`.

Não revelar a solução específica completa antes da última dica.

---

## 9. Interface mínima

### Cabeçalho

Exibir:

- ITERA;
- nome do curso;
- progresso;
- ação de reiniciar.

### Navegação lateral

Exibir apenas:

```text
Trilha 1 — Fundamentos de interação
└── 1.1 — print()
```

### Conteúdo principal

Exibir:

- objetivo;
- para que serve;
- como funciona;
- exemplo;
- aplicação;
- prática;
- aprofundamento opcional.

### Área de prática

Exibir:

- CodeMirror;
- botão `Executar`;
- botão `Verificar`;
- botão `Dica`;
- botão `Restaurar`;
- painel de saída;
- painel de feedback.

---

## 10. Comportamento de Executar e Verificar

### Executar

Deve:

- executar o código;
- mostrar a saída;
- mostrar erros técnicos;
- preservar o código;
- não concluir a unidade;
- não registrar sucesso pedagógico.

### Verificar

Deve:

- executar o código;
- aplicar os critérios pedagógicos;
- registrar tentativa;
- gerar feedback;
- marcar a unidade como concluída quando correta.

A diferença deve ser visível e compreensível.

---

## 11. Motor de código

### 11.1 Fluxo

```text
Editor
→ CodeActivityEngine
→ Web Worker
→ Pyodide
→ captura de saída
→ resultado
→ feedback
```

### 11.2 Requisitos

Implementar:

- carregamento do Pyodide;
- estado de carregamento;
- execução em Worker;
- captura de `stdout`;
- captura de exceções;
- timeout configurável;
- reinicialização após timeout;
- limite de caracteres da saída;
- preservação do código;
- bloqueio de execuções duplicadas.

### 11.3 Entrada

Não criar terminal interativo nesta fase.

Preparar o motor para entradas simuladas futuras.

A unidade 1.1 não usa `input()`.

### 11.4 Timeout inicial

Usar inicialmente:

```text
3000 ms
```

O valor deve ser configurável por atividade.

### 11.5 Limite de saída

Usar inicialmente:

```text
5000 caracteres
```

Truncar ou interromper saída excessiva com feedback claro.

---

## 12. Verificação da atividade

A validação deve:

1. executar o código;
2. capturar a saída;
3. normalizar espaços externos;
4. remover apenas quebra de linha final irrelevante;
5. comparar com `Meu diário de saúde`;
6. produzir feedback específico.

Aceitar soluções alternativas com o mesmo comportamento.

Não aceitar:

- comentário contendo a frase;
- código sem saída;
- saída com mensagem diferente;
- texto não executado.

Evitar AST, salvo se necessária para distinguir comentário de execução.

---

## 13. Feedback pedagógico

Criar mensagens específicas.

### Sucesso

```text
A mensagem foi exibida corretamente.
```

### Saída incorreta

```text
Seu programa executou, mas a mensagem exibida não corresponde ao objetivo.
```

### Nenhuma saída

```text
O código foi executado, mas nenhuma mensagem foi exibida.
```

### Erro de sintaxe

```text
O Python não conseguiu interpretar o código. Verifique as aspas e os parênteses.
```

### Nome incorreto

```text
O Python não reconheceu esse nome. A função deve ser escrita como print, com letras minúsculas.
```

### Timeout

```text
A execução ultrapassou o limite permitido e foi interrompida.
```

### Erro interno

```text
O ambiente de execução apresentou uma falha. Seu código foi preservado.
```

Não usar isoladamente:

- Errado;
- Falhou;
- Inválido.

---

## 14. Persistência

Salvar em `localStorage`:

- unidade atual;
- código;
- número de tentativas;
- dicas abertas;
- status de conclusão;
- estado do aprofundamento;
- data da última atividade.

A aplicação deve restaurar o estado após recarregar a página.

Toda persistência deve passar por `ProgressRepository`.

Nenhum componente deve acessar `localStorage` diretamente.

---

## 15. Estados da interface

Implementar estados claros para:

- carregando conteúdo;
- carregando Python;
- pronto;
- executando;
- execução concluída;
- verificando;
- sucesso;
- resposta incorreta;
- erro de sintaxe;
- erro de execução;
- timeout;
- falha interna.

Durante carregamento ou execução:

- desativar ações incompatíveis;
- impedir execução duplicada;
- preservar código e progresso.

---

## 16. Acessibilidade

Garantir:

- navegação por teclado;
- foco visível;
- contraste adequado;
- botões com rótulos;
- mensagens não dependentes apenas de cor;
- estrutura semântica;
- editor utilizável por teclado;
- responsividade para desktop, notebook e tablet.

Celular não é prioridade nesta fase.

---

## 17. Testes obrigatórios

### 17.1 Núcleo

Testar:

- carregamento do curso;
- carregamento da trilha;
- carregamento da unidade;
- validação dos schemas;
- progresso;
- dicas;
- aprofundamento;
- persistência;
- reinício.

### 17.2 Motor

Testar:

- código correto;
- saída incorreta;
- nenhuma saída;
- erro de sintaxe;
- erro de execução;
- timeout;
- saída excessiva;
- reinicialização do Worker;
- preservação do código.

### 17.3 Interface

Testar:

- abrir a unidade;
- editar código;
- executar;
- verificar;
- liberar dica;
- restaurar código;
- concluir;
- abrir aprofundamento;
- atualizar página;
- restaurar estado;
- reiniciar progresso.

### 17.4 Comandos obrigatórios

Executar:

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
```

Todos devem passar sem erros.

Não declarar conclusão sem evidência dos comandos.

---

## 18. Ordem obrigatória de implementação

### Etapa 1 — Fundação

- criar React + TypeScript + Vite;
- configurar Tailwind;
- configurar Vitest;
- configurar Playwright;
- criar estrutura inicial.

### Etapa 2 — Domínio e schemas

- definir tipos;
- definir contratos;
- criar schemas Zod;
- validar conteúdo.

### Etapa 3 — Conteúdo integral

Antes de expandir a interface, escrever:

- percurso essencial;
- exemplos;
- atividade;
- dicas;
- feedbacks;
- aprofundamento;
- critérios.

### Etapa 4 — Núcleo

- carregamento;
- progresso;
- dicas;
- aprofundamento;
- persistência abstrata.

### Etapa 5 — Interface base

- layout;
- navegação;
- conteúdo;
- prática;
- feedback;
- aprofundamento.

### Etapa 6 — Editor

- CodeMirror;
- código inicial;
- salvamento;
- restauração.

### Etapa 7 — Motor Python

- Pyodide;
- Worker;
- saída;
- erros;
- timeout;
- limite de saída;
- reinicialização.

### Etapa 8 — Verificador

- normalização;
- comparação;
- feedback;
- tentativas;
- conclusão.

### Etapa 9 — Persistência

- `LocalStorageProgressRepository`;
- restauração;
- reinício.

### Etapa 10 — Qualidade

- testes;
- lint;
- typecheck;
- build;
- acessibilidade;
- responsividade.

### Etapa 11 — Validação humana

Preparar a aplicação para teste com uma ou duas pessoas iniciantes.

Não implementar as próximas unidades antes desse teste.

---

## 19. Critérios de aceite

A fase só pode ser considerada concluída quando:

- a unidade 1.1 estiver integralmente implementada;
- o conteúdo estiver separado da interface;
- o núcleo não depender diretamente de Python;
- o motor estiver isolado;
- Pyodide rodar em Web Worker;
- timeout não congelar a página;
- saída excessiva for controlada;
- verificação comportamental funcionar;
- soluções alternativas corretas forem aceitas;
- dicas forem graduais;
- aprofundamento funcionar;
- progresso persistir;
- restauração funcionar;
- reinício funcionar;
- testes obrigatórios passarem;
- build de produção passar;
- documentação estiver atualizada.

---

## 20. Regras de trabalho do agente

Durante a implementação:

1. Trabalhar em etapas pequenas.
2. Não expandir o escopo.
3. Não alterar arquitetura sem justificar.
4. Não implementar funcionalidades futuras por antecipação.
5. Não criar abstrações sem uso imediato.
6. Não acoplar conteúdo aos componentes.
7. Não acessar `localStorage` fora do repositório.
8. Não executar Python na thread principal.
9. Não usar verificações rígidas de texto-fonte como padrão.
10. Não declarar sucesso sem executar validações.
11. Registrar limitações conhecidas.
12. Preservar código do aluno em qualquer falha possível.

---

## 21. Relatório final obrigatório

Ao concluir, entregar:

### Resumo

- o que foi implementado;
- o que não foi implementado;
- decisões arquiteturais;
- limitações.

### Evidências

Registrar os resultados de:

```text
lint
typecheck
testes unitários
build
testes E2E
```

### Arquivos principais

Listar arquivos criados e alterados por responsabilidade.

### Riscos conhecidos

Informar:

- limitações do Pyodide;
- tempo de carregamento;
- comportamento do Worker;
- limitações da persistência local;
- pontos a validar com usuários.

### Próximo passo

Recomendar somente:

```text
teste com 1–2 iniciantes
→ correções
→ decisão sobre unidade 1.2
```

Não iniciar automaticamente a próxima fase.
