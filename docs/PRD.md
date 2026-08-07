**PRD --- Primeira Fase do ITERA**

**1. Identificação do produto**

**Produto:** ITERA\
**Versão:** MVP 0.1\
**Fase:** Primeira fase de implementação\
**Conteúdo inicial:** Python para iniciantes\
**Unidade validada:** 1.1 --- Exibindo mensagens com print()\
**Plataforma:** Aplicação web executada no navegador

------------------------------------------------------------------------

**2. Visão do produto**

O ITERA será uma plataforma modular de aprendizagem que combina:

- explicação objetiva;

- prática interativa;

- feedback imediato;

- dicas graduais;

- progresso;

- aprofundamento opcional.

A plataforma não será limitada ao ensino de programação. O primeiro conteúdo em Python será utilizado para validar o núcleo pedagógico e técnico.

A arquitetura deverá permitir que futuramente sejam criados cursos de:

- História;

- Filosofia;

- Sociologia;

- Língua Portuguesa;

- Saúde;

- outros conteúdos estruturados em unidades e atividades.

------------------------------------------------------------------------

**3. Problema**

Cursos introdutórios frequentemente apresentam três dificuldades:

1.  explicações superficiais ou excessivamente longas;

2.  saltos grandes entre conceitos;

3.  exercícios que apenas informam se a resposta está certa ou errada.

No ensino de programação, há ainda dificuldades adicionais:

- necessidade de instalar ferramentas;

- uso de terminal;

- mensagens de erro pouco compreensíveis;

- verificadores rígidos;

- falta de orientação durante a prática.

O ITERA deverá permitir que um iniciante aprenda e pratique diretamente no navegador, sem instalar Python ou utilizar uma CLI.

------------------------------------------------------------------------

**4. Hipótese principal**

Um aluno iniciante terá maior chance de compreender e concluir uma unidade quando receber:

- um objetivo claro;

- uma explicação curta do conceito;

- um exemplo;

- uma atividade prática;

- execução imediata;

- feedback pedagógico;

- dicas graduais;

- aprofundamento opcional.

A primeira fase deverá testar essa hipótese com uma única unidade completa.

------------------------------------------------------------------------

**5. Objetivo da primeira fase**

Construir e validar uma experiência vertical completa da unidade:

**1.1 --- Exibindo mensagens com print()**

A primeira fase deverá provar que o ITERA consegue integrar:

conteúdo

→ interface

→ editor

→ execução

→ verificação

→ feedback

→ dicas

→ progresso

→ aprofundamento

A fase não deverá produzir um curso completo.

------------------------------------------------------------------------

**6. Público inicial**

**Público principal**

Pessoas sem experiência prévia em programação.

**Características esperadas**

- não conhecem Python;

- podem não saber usar terminal;

- podem ter pouca familiaridade com ferramentas de desenvolvimento;

- precisam de instruções claras;

- podem interpretar mensagens de erro como falhas pessoais;

- necessitam de feedback orientado à correção.

------------------------------------------------------------------------

**7. Proposta de valor**

O ITERA permitirá que o aluno:

- entenda o propósito de cada conceito;

- pratique imediatamente;

- execute código sem instalar ferramentas;

- receba explicações sobre seus erros;

- use dicas sem visualizar diretamente a solução;

- conclua unidades em pequenas etapas;

- aprofunde conceitos quando desejar.

------------------------------------------------------------------------

**8. Princípios do produto**

**8.1 Um conceito por unidade**

Cada unidade deverá introduzir uma competência principal.

**8.2 Prática rápida**

O aluno deverá chegar à prática sem precisar atravessar uma explicação extensa.

**8.3 Profundidade opcional**

Origem, evolução e funcionamento interno ficarão em uma seção separada.

**8.4 Feedback explicativo**

O sistema deverá informar:

- o que aconteceu;

- por que não funcionou;

- qual aspecto deve ser revisado.

**8.5 Soluções alternativas**

O sistema não deverá exigir que o aluno escreva código idêntico ao exemplo.

**8.6 Arquitetura multiconteúdo**

O núcleo da plataforma não poderá depender exclusivamente de Python.

------------------------------------------------------------------------

**9. Escopo funcional**

**9.1 Incluído**

- aplicação web;

- estrutura de curso, trilha e unidade;

- unidade 1.1 completa;

- percurso essencial;

- aprofundamento opcional;

- editor de código;

- execução de Python no navegador;

- isolamento em Web Worker;

- timeout;

- captura da saída;

- captura de erros;

- verificação comportamental;

- dicas graduais;

- feedback pedagógico;

- progresso salvo localmente;

- restauração do código;

- reinício do progresso;

- testes automatizados essenciais;

- teste com usuários iniciantes.

**9.2 Fora do escopo**

- unidades 1.2 e 1.3;

- login;

- cadastro;

- banco de dados remoto;

- sincronização entre dispositivos;

- inteligência artificial;

- gamificação;

- certificados;

- pagamentos;

- painel administrativo;

- ranking;

- aplicativo móvel;

- terminal Python interativo;

- colaboração;

- múltiplos cursos completos;

- implementação de outros motores de atividade.

------------------------------------------------------------------------

**10. Arquitetura conceitual**

O produto deverá ser dividido em três camadas.

**10.1 Núcleo da plataforma**

Responsável por:

- carregamento do curso;

- carregamento da trilha;

- carregamento da unidade;

- navegação;

- progresso;

- dicas;

- feedback;

- aprofundamento;

- persistência.

**10.2 Motores de atividade**

Responsáveis pela apresentação e validação das práticas.

Nesta fase será implementado somente:

CodeActivityEngine

Tipos futuros previstos:

multiple_choice

short_answer

association

ordering

case_analysis

Esses tipos não deverão ser implementados nesta fase.

**10.3 Conteúdo**

Responsável por:

- textos;

- objetivos;

- exemplos;

- práticas;

- dicas;

- aprofundamentos;

- critérios de conclusão.

O conteúdo não poderá ser escrito diretamente nos componentes da interface.

------------------------------------------------------------------------

**11. Stack técnica**

  -----------------------------------------------------------------------
  **Componente**                       **Tecnologia**
  ------------------------------------ ----------------------------------
  Interface                            React

  Linguagem                            TypeScript

  Build                                Vite

  Estilo                               Tailwind CSS

  Editor                               CodeMirror 6

  Execução Python                      Pyodide

  Isolamento                           Web Worker

  Validação de dados                   Zod

  Conteúdo                             JSON e Markdown

  Progresso                            localStorage

  Testes unitários                     Vitest

  Testes de interface                  Playwright
  -----------------------------------------------------------------------

------------------------------------------------------------------------

**12. Estrutura pedagógica da unidade**

A unidade deverá ter dois percursos.

**12.1 Percurso essencial**

Obrigatório para concluir a unidade.

Deverá conter:

1.  objetivo;

2.  para que serve;

3.  como funciona;

4.  exemplo;

5.  aplicação;

6.  prática;

7.  feedback;

8.  dicas.

**12.2 Aprofundamento opcional**

Não deverá interferir na conclusão da unidade.

Deverá conter:

- origem;

- problema histórico ou prático;

- evolução;

- funcionamento interno básico;

- comparação com outras linguagens;

- boas práticas;

- curiosidades;

- desafio extra.

**Regra**

Nenhum conhecimento indispensável à conclusão da atividade poderá existir somente no aprofundamento.

------------------------------------------------------------------------

**13. Especificação da unidade 1.1**

**13.1 Identificação**

**ID:** 1.1-print\
**Título:** Exibindo mensagens com print()\
**Trilha:** Fundamentos de interação\
**Ordem:** 1

**13.2 Objetivo pedagógico**

Ao final da unidade, o aluno deverá conseguir usar print() para exibir uma mensagem.

**13.3 Conhecimentos prévios**

Nenhum conhecimento de programação será exigido.

**13.4 Conteúdo essencial**

O aluno deverá compreender:

- que programas podem exibir informações;

- que print() é uma função do Python;

- que o texto deve ficar entre aspas;

- que o conteúdo da função fica entre parênteses;

- que o código precisa ser executado para gerar uma saída.

**13.5 Exemplo principal**

print(\"Olá\")

**13.6 Aplicação contextualizada**

print(\"Meu diário de saúde\")

**13.7 Atividade**

O aluno deverá criar um programa que exiba:

Meu diário de saúde

**13.8 Código inicial**

\# Escreva seu código abaixo

------------------------------------------------------------------------

**14. Critérios de conclusão**

A atividade será considerada concluída quando:

- o código executar sem erro;

- houver uma saída;

- a saída normalizada corresponder a Meu diário de saúde;

- o texto não estiver apenas em um comentário;

- o programa realmente gerar a mensagem.

**Normalização permitida**

O verificador poderá ignorar:

- espaços antes e depois da saída;

- uma quebra de linha final;

- diferenças irrelevantes na representação interna.

**Normalização não permitida**

Não deverá ignorar:

- palavras ausentes;

- palavras adicionais;

- mensagem diferente;

- ausência de execução.

------------------------------------------------------------------------

**15. Regra de verificação**

A verificação deverá ser prioritariamente comportamental.

Fluxo:

receber código

→ executar

→ capturar saída

→ normalizar saída

→ comparar resultado

→ gerar feedback

A análise por AST não será obrigatória como regra geral.

Poderá ser utilizada somente quando for necessário distinguir:

- código executável;

- comentário;

- texto que não produz saída.

Soluções alternativas corretas deverão ser aceitas.

------------------------------------------------------------------------

**16. Dicas graduais**

A unidade deverá possuir entre uma e cinco dicas.

As dicas serão liberadas uma por vez.

**Dica 1**

Use uma função que exibe informações.

**Dica 2**

A função se chama print.

**Dica 3**

A mensagem deve ficar entre aspas.

**Dica 4**

A mensagem e as aspas ficam dentro dos parênteses.

**Dica 5**

Estrutura:

print(\"mensagem\")

A solução completa específica da atividade não deverá aparecer antes da última dica.

------------------------------------------------------------------------

**17. Aprofundamento da unidade**

**17.1 Origem**

Explicar que programas precisam apresentar resultados para usuários e desenvolvedores.

**17.2 Terminal**

Apresentar o terminal como um ambiente textual de entrada e saída.

**17.3 Saída padrão**

Explicar de forma introdutória o conceito de stdout.

**17.4 Evolução**

Apresentar brevemente:

- print como instrução no Python 2;

- print() como função no Python 3.

**17.5 Comparações**

Python:

print(\"Olá\")

JavaScript:

console.log(\"Olá\")

Java:

System.out.println(\"Olá\");

**17.6 Boas práticas**

- escrever mensagens claras;

- evitar mensagens desnecessárias;

- diferenciar saída para usuário e depuração.

**17.7 Desafio extra**

Exibir duas mensagens em linhas diferentes.

O desafio extra não deverá interferir no progresso principal.

------------------------------------------------------------------------

**18. Requisitos funcionais**

**RF-01 --- Carregamento da unidade**

O sistema deverá carregar os dados da unidade a partir de um arquivo estruturado.

**RF-02 --- Exibição do conteúdo**

O sistema deverá mostrar o percurso essencial em uma ordem compreensível.

**RF-03 --- Editor de código**

O sistema deverá disponibilizar um editor com:

- realce de sintaxe;

- numeração de linhas;

- indentação;

- edição por teclado;

- código inicial.

**RF-04 --- Execução**

O botão **Executar** deverá:

- executar o código;

- mostrar a saída;

- mostrar erros;

- não concluir a unidade.

**RF-05 --- Verificação**

O botão **Verificar** deverá:

- executar o código;

- avaliar o resultado;

- registrar a tentativa;

- mostrar feedback;

- concluir a unidade quando correto.

**RF-06 --- Dicas**

O sistema deverá liberar uma dica por vez.

**RF-07 --- Restaurar código**

O aluno deverá poder restaurar o código inicial.

Antes da restauração, o sistema deverá informar que o código atual será substituído.

**RF-08 --- Progresso**

O sistema deverá salvar:

- código atual;

- número de tentativas;

- dicas abertas;

- conclusão;

- acesso ao aprofundamento;

- data da última atividade.

**RF-09 --- Retomada**

Ao reabrir a aplicação, o aluno deverá retornar ao estado anterior.

**RF-10 --- Reinício**

O sistema deverá permitir reiniciar o progresso da unidade.

A operação deverá exigir confirmação.

**RF-11 --- Aprofundamento**

O aluno deverá conseguir abrir e fechar a seção opcional sem perder o código ou o progresso.

**RF-12 --- Feedback**

Cada resultado deverá apresentar uma mensagem específica.

------------------------------------------------------------------------

**19. Requisitos não funcionais**

**RNF-01 --- Segurança da execução**

O código deverá ser executado exclusivamente dentro de um Web Worker.

**RNF-02 --- Timeout**

A execução deverá ser interrompida após o limite configurado.

Valor inicial sugerido:

3 segundos

**RNF-03 --- Recuperação**

Depois de um timeout, o ambiente deverá ser reiniciado e continuar disponível.

**RNF-04 --- Limite de saída**

O sistema deverá interromper ou truncar uma saída excessiva.

**RNF-05 --- Desempenho**

A interface deverá permanecer responsiva durante a execução.

**RNF-06 --- Persistência**

A falha de armazenamento local não deverá apagar o código que estiver visível no editor.

**RNF-07 --- Acessibilidade**

A interface deverá oferecer:

- navegação por teclado;

- foco visível;

- contraste adequado;

- mensagens que não dependam apenas de cores;

- rótulos nos botões;

- estrutura semântica.

**RNF-08 --- Responsividade**

A aplicação deverá funcionar em:

- desktop;

- notebook;

- tablet.

O celular não será prioridade nesta fase.

**RNF-09 --- Separação arquitetural**

O núcleo não deverá importar diretamente componentes específicos do Pyodide.

**RNF-10 --- Validação do conteúdo**

Arquivos de curso, trilha e unidade deverão ser validados por schema antes de serem exibidos.

------------------------------------------------------------------------

**20. Estados da interface**

**Estado inicial**

- conteúdo carregado;

- editor disponível;

- código inicial visível;

- painel de saída vazio;

- primeira dica bloqueada até solicitação.

**Carregando o Python**

- indicador de carregamento;

- botões de execução temporariamente desativados;

- mensagem clara.

**Executando**

- botão com estado de execução;

- prevenção de execuções duplicadas;

- possibilidade de interrupção por timeout.

**Execução concluída**

- saída exibida;

- editor preservado.

**Verificação correta**

- feedback de sucesso;

- unidade marcada como concluída;

- progresso atualizado.

**Verificação incorreta**

- feedback pedagógico;

- código preservado;

- possibilidade de nova tentativa.

**Erro interno**

- explicação de falha da plataforma;

- código preservado;

- opção de tentar novamente.

------------------------------------------------------------------------

**21. Mensagens de feedback**

**Sucesso**

A mensagem foi exibida corretamente.

**Saída incorreta**

Seu programa executou, mas a mensagem exibida não corresponde ao objetivo.

**Nenhuma saída**

O código foi executado, mas nenhuma mensagem foi exibida.

**Erro de sintaxe**

O Python não conseguiu interpretar o código. Verifique as aspas e os parênteses.

**Nome incorreto**

O Python não reconheceu esse nome. A função deve ser escrita como print, com letras minúsculas.

**Timeout**

A execução ultrapassou o limite permitido e foi interrompida.

**Falha da plataforma**

O ambiente de execução apresentou uma falha. Seu código foi preservado.

Mensagens genéricas como Errado, Falhou ou Inválido não deverão ser utilizadas isoladamente.

------------------------------------------------------------------------

**22. Interface**

**22.1 Cabeçalho**

Deverá apresentar:

- nome ITERA;

- nome do curso;

- progresso;

- opção de reiniciar.

**22.2 Navegação lateral**

Deverá apresentar:

Trilha 1 --- Fundamentos de interação

└── 1.1 --- print()

As unidades futuras poderão aparecer como indisponíveis ou não aparecer nesta fase.

**22.3 Área principal**

Deverá conter:

- objetivo;

- para que serve;

- como funciona;

- exemplo;

- aplicação;

- prática;

- aprofundamento.

**22.4 Área da prática**

Deverá conter:

- editor;

- botão Executar;

- botão Verificar;

- botão Dica;

- botão Restaurar;

- painel de saída;

- painel de feedback.

------------------------------------------------------------------------

**23. Estrutura mínima de dados**

**Curso**

{

\"id\": \"python-iniciante\",

\"title\": \"Python para iniciantes\",

\"version\": \"0.1.0\",

\"tracks\": \[\"fundamentos-interacao\"\]

}

**Trilha**

{

\"id\": \"fundamentos-interacao\",

\"courseId\": \"python-iniciante\",

\"title\": \"Fundamentos de interação\",

\"order\": 1,

\"units\": \[\"1.1-print\"\]

}

**Unidade**

{

\"id\": \"1.1-print\",

\"courseId\": \"python-iniciante\",

\"trackId\": \"fundamentos-interacao\",

\"title\": \"Exibindo mensagens com print()\",

\"order\": 1,

\"objectives\": \[

\"Exibir uma mensagem no painel de saída\"

\],

\"essential\": {

\"purpose\": \"\",

\"behavior\": \"\",

\"example\": \"\",

\"application\": \"\"

},

\"deepDive\": {

\"enabled\": true,

\"origin\": \"\",

\"evolution\": \"\",

\"internalBehavior\": \"\",

\"comparisons\": \"\",

\"goodPractices\": \"\",

\"curiosities\": \"\",

\"extraChallenge\": \"\"

},

\"activity\": {

\"type\": \"code\",

\"config\": {

\"language\": \"python\",

\"starterCode\": \"# Escreva seu código abaixo\",

\"expectedOutput\": \"Meu diário de saúde\",

\"timeoutMs\": 3000,

\"maxOutputCharacters\": 5000

}

},

\"hints\": \[\]

}

------------------------------------------------------------------------

**24. Contratos técnicos mínimos**

**Tipo de atividade**

type ActivityType =

\| \"code\"

\| \"multiple_choice\"

\| \"short_answer\"

\| \"association\"

\| \"ordering\"

\| \"case_analysis\";

**Resultado**

interface ActivityResult {

status:

\| \"success\"

\| \"incorrect\"

\| \"syntax_error\"

\| \"runtime_error\"

\| \"timeout\"

\| \"no_output\"

\| \"internal_error\";

message: string;

output?: string;

technicalDetails?: string;

}

**Motor**

interface ActivityEngine\<TConfig, TResponse\> {

type: ActivityType;

validate(

response: TResponse,

config: TConfig

): Promise\<ActivityResult\>;

reset(): Promise\<void\>;

}

**Repositório de progresso**

interface ProgressRepository {

load(): Promise\<UserProgress\>;

save(progress: UserProgress): Promise\<void\>;

reset(): Promise\<void\>;

}

Nesta fase serão implementados:

CodeActivityEngine

LocalStorageProgressRepository

------------------------------------------------------------------------

**25. Estrutura sugerida do projeto**

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

------------------------------------------------------------------------

**26. Histórias de usuário**

**HU-01**

Como aluno iniciante, quero compreender para que serve print(), para saber por que devo utilizá-lo.

**HU-02**

Como aluno iniciante, quero escrever código diretamente no navegador, para não precisar instalar ferramentas.

**HU-03**

Como aluno iniciante, quero executar meu código antes de enviá-lo para avaliação, para observar o resultado.

**HU-04**

Como aluno iniciante, quero receber uma explicação sobre meu erro, para saber o que corrigir.

**HU-05**

Como aluno iniciante, quero solicitar dicas gradualmente, para continuar tentando antes de ver uma estrutura próxima da solução.

**HU-06**

Como aluno curioso, quero acessar informações sobre a origem e o funcionamento do conceito, para compreender além do uso básico.

**HU-07**

Como aluno, quero fechar e reabrir a aplicação sem perder meu código, para continuar depois.

**HU-08**

Como responsável pelo produto, quero que o motor de código seja independente do núcleo, para adicionar outros tipos de atividade futuramente.

------------------------------------------------------------------------

**27. Critérios de aceite**

**CA-01 --- Conteúdo**

A unidade deverá carregar integralmente a partir de arquivo externo validado.

**CA-02 --- Execução**

Um código válido deverá produzir saída sem travar a interface.

**CA-03 --- Segurança**

Um código com execução infinita deverá ser interrompido pelo timeout.

**CA-04 --- Verificação**

O código abaixo deverá ser aceito:

print(\"Meu diário de saúde\")

**CA-05 --- Alternativas**

Uma solução alternativa com o mesmo comportamento deverá ser aceita.

**CA-06 --- Erro**

Código com aspas ausentes deverá produzir feedback de sintaxe compreensível.

**CA-07 --- Nenhuma saída**

Um comentário contendo o texto esperado não deverá concluir a atividade.

**CA-08 --- Persistência**

Após atualizar a página, o código e o progresso deverão ser restaurados.

**CA-09 --- Dicas**

Cada clique deverá liberar somente a próxima dica.

**CA-10 --- Aprofundamento**

O aprofundamento poderá ser acessado sem alterar a conclusão da atividade.

**CA-11 --- Restauração**

O botão Restaurar deverá devolver o código inicial depois de confirmação.

**CA-12 --- Reinício**

O reinício deverá apagar somente os dados locais relacionados ao curso.

------------------------------------------------------------------------

**28. Testes obrigatórios**

**28.1 Testes unitários**

- validação do schema do curso;

- validação do schema da trilha;

- validação do schema da unidade;

- normalização da saída;

- avaliação correta;

- avaliação incorreta;

- controle de dicas;

- atualização do progresso;

- restauração do progresso.

**28.2 Testes do motor**

- código correto;

- saída incorreta;

- nenhuma saída;

- erro de sintaxe;

- erro de execução;

- timeout;

- saída excessiva;

- reinicialização do Worker;

- preservação da interface.

**28.3 Testes de interface**

- carregar a unidade;

- editar o código;

- executar;

- verificar;

- abrir dica;

- restaurar;

- concluir;

- abrir aprofundamento;

- atualizar a página;

- restaurar o estado;

- reiniciar o progresso.

**28.4 Comandos obrigatórios**

npm run lint

npm run typecheck

npm test

npm run build

npm run test:e2e

Todos deverão terminar sem erros.

------------------------------------------------------------------------

**29. Teste com usuários**

Após a unidade estar funcional, ela deverá ser testada com uma ou duas pessoas sem experiência em programação.

**O teste deverá observar**

- se o objetivo é compreendido;

- se o aluno identifica onde escrever;

- se entende a diferença entre Executar e Verificar;

- se interpreta o painel de saída;

- se compreende o feedback;

- se consegue utilizar as dicas;

- se conclui sem orientação externa;

- se acessa o aprofundamento;

- quanto tempo leva;

- onde demonstra hesitação.

**Regra do teste**

O observador não deverá ensinar o conteúdo durante a execução. Poderá apenas registrar comportamentos e dúvidas.

------------------------------------------------------------------------

**30. Métricas da primeira fase**

**Métricas técnicas**

- tempo de carregamento do Pyodide;

- quantidade de falhas de execução;

- quantidade de timeouts;

- taxa de restauração correta do progresso;

- erros detectados pelos testes.

**Métricas pedagógicas**

- tempo até a primeira execução;

- número de tentativas;

- quantidade de dicas utilizadas;

- taxa de conclusão;

- compreensão de Executar e Verificar;

- interesse no aprofundamento;

- dificuldades relatadas.

Essas métricas poderão ser registradas manualmente durante o teste inicial.

------------------------------------------------------------------------

**31. Ordem de implementação**

**Etapa 1 --- Fundação**

- criar projeto;

- configurar React;

- configurar TypeScript;

- configurar Vite;

- configurar Tailwind;

- configurar Vitest;

- configurar Playwright.

**Etapa 2 --- Domínio e schemas**

- criar entidades;

- criar schemas;

- criar contratos;

- validar arquivos de conteúdo.

**Etapa 3 --- Conteúdo completo**

- escrever o percurso essencial;

- escrever o exemplo;

- escrever a prática;

- escrever as dicas;

- escrever os feedbacks;

- escrever o aprofundamento;

- definir os critérios de conclusão.

**Etapa 4 --- Núcleo da plataforma**

- carregar curso;

- carregar trilha;

- carregar unidade;

- controlar progresso;

- controlar dicas;

- controlar aprofundamento.

**Etapa 5 --- Interface**

- implementar layout;

- implementar navegação;

- implementar conteúdo;

- implementar prática;

- implementar feedback;

- implementar aprofundamento.

**Etapa 6 --- Editor**

- integrar CodeMirror;

- salvar código;

- restaurar código inicial.

**Etapa 7 --- Motor Python**

- integrar Pyodide;

- criar Web Worker;

- capturar saída;

- capturar erros;

- implementar timeout;

- limitar saída;

- reiniciar Worker.

**Etapa 8 --- Verificador**

- normalizar saída;

- comparar comportamento;

- gerar feedback;

- registrar tentativa;

- concluir unidade.

**Etapa 9 --- Persistência**

- implementar o repositório;

- salvar no localStorage;

- restaurar estado;

- reiniciar progresso.

**Etapa 10 --- Testes internos**

- executar testes automatizados;

- revisar acessibilidade;

- revisar responsividade;

- corrigir falhas.

**Etapa 11 --- Teste com usuários**

- testar com iniciantes;

- registrar observações;

- identificar bloqueios.

**Etapa 12 --- Correções**

- corrigir problemas técnicos;

- corrigir textos;

- corrigir navegação;

- ajustar feedbacks;

- ajustar dicas.

------------------------------------------------------------------------

**32. Critério de encerramento da fase**

A primeira fase será considerada concluída quando:

- a unidade estiver completa;

- o conteúdo estiver separado da interface;

- o núcleo não depender diretamente de Python;

- o motor estiver isolado;

- o código executar em Web Worker;

- o timeout funcionar;

- a interface não congelar;

- a verificação comportamental funcionar;

- soluções alternativas corretas forem aceitas;

- o progresso persistir;

- as dicas funcionarem;

- o aprofundamento estiver disponível;

- os testes obrigatórios passarem;

- pelo menos uma pessoa iniciante concluir a unidade;

- os principais problemas observados forem corrigidos.

------------------------------------------------------------------------

**33. Condição para iniciar a segunda fase**

A criação das unidades 1.2 e 1.3 somente poderá começar quando:

1.  a unidade 1.1 estiver estável;

2.  a experiência tiver sido testada;

3.  os feedbacks tiverem sido ajustados;

4.  o motor estiver reutilizável;

5.  o modelo de conteúdo estiver validado;

6.  não houver falhas críticas abertas.

------------------------------------------------------------------------

**34. Resultado esperado**

Ao final desta fase, o ITERA terá:

- arquitetura preparada para múltiplos conteúdos;

- núcleo pedagógico funcional;

- motor de atividade de código isolado;

- unidade completa;

- execução segura no navegador;

- feedback pedagógico;

- dicas graduais;

- aprofundamento opcional;

- progresso persistente;

- primeira validação com usuários reais.
