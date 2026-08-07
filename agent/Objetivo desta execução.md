Você atuará como agente responsável pela implementação da primeira fase do projeto ITERA.

Antes de alterar qualquer arquivo, leia integralmente:

```text
ITERA-SKILL.md
```

Esse arquivo é a especificação principal do projeto. Suas regras, limites de escopo, arquitetura, ordem de implementação, critérios de aceite e validações são obrigatórios.

## Objetivo desta execução

Iniciar o projeto ITERA e concluir somente a **Etapa 1 — Fundação** definida no skill.

Não avance para domínio, schemas, conteúdo pedagógico, Pyodide, CodeMirror ou motor de atividades nesta execução.

## Tarefas

1. Inspecione o diretório atual e identifique:
   - se já existe algum projeto;
   - arquivos presentes;
   - configuração Git;
   - versão do Node.js e npm;
   - possíveis conflitos com a stack definida.

2. Caso o diretório esteja vazio ou não contenha uma aplicação válida, crie um projeto com:
   - React;
   - TypeScript;
   - Vite.

3. Configure:
   - Tailwind CSS;
   - ESLint;
   - Vitest;
   - React Testing Library;
   - Playwright;
   - script de typecheck.

4. Crie a estrutura inicial de diretórios prevista no skill, sem adicionar implementações especulativas:

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

  components/
    layout/
    navigation/
    feedback/
    deep-dive/

  pages/
  schemas/
  tests/

docs/
```

5. Adicione apenas arquivos mínimos necessários para preservar diretórios vazios, quando isso for necessário para o Git.

6. Crie uma página inicial provisória simples contendo:
   - nome `ITERA`;
   - texto `Plataforma modular de aprendizagem`;
   - indicação `Primeira fase em preparação`.

Essa página é temporária e não deve antecipar a interface final.

7. Configure os scripts:

```json
{
  "dev": "...",
  "build": "...",
  "lint": "...",
  "typecheck": "...",
  "test": "...",
  "test:e2e": "..."
}
```

8. Crie:
   - um teste unitário mínimo confirmando a renderização da página;
   - um teste E2E mínimo confirmando que a página inicial abre.

9. Crie `docs/arquitetura.md` com apenas:
   - objetivo da separação entre plataforma, motores e conteúdo;
   - estrutura inicial de diretórios;
   - informação de que somente o motor de código será implementado nesta fase;
   - referência ao `ITERA-SKILL.md` como especificação principal.

Não escreva documentação extensa nem antecipe decisões das próximas etapas.

## Regras obrigatórias

- Não implementar Pyodide.
- Não implementar Web Worker.
- Não instalar CodeMirror.
- Não criar a unidade `1.1-print`.
- Não criar schemas de curso, trilha ou unidade.
- Não implementar persistência.
- Não criar motores futuros.
- Não adicionar login, banco remoto, IA ou gamificação.
- Não alterar o escopo definido no skill.
- Não executar commit, push ou deploy sem autorização explícita.
- Não apagar arquivos existentes sem justificar e preservar backup ou histórico.
- Use versões estáveis e compatíveis das dependências.
- Evite dependências desnecessárias.

## Validações obrigatórias

Ao final, execute:

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
```

Corrija todos os erros antes de encerrar.

Se algum comando não puder ser executado por limitação real do ambiente, informe claramente:

- qual comando falhou;
- erro encontrado;
- tentativa de correção realizada;
- o que precisa ser executado fora do ambiente.

## Relatório final

Entregue um relatório objetivo contendo:

1. estado inicial encontrado;
2. arquivos criados e alterados;
3. dependências instaladas;
4. estrutura final;
5. resultado de cada validação;
6. limitações ou riscos encontrados;
7. confirmação explícita de que nenhuma etapa posterior foi iniciada;
8. próximo passo recomendado: `Etapa 2 — Domínio e schemas`.

Pare após entregar o relatório. Não inicie a Etapa 2.
