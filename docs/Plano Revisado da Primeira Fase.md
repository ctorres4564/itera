**Plano Revisado da Primeira Fase --- ITERA**

**1. Objetivo**

Construir e validar a primeira versão funcional do ITERA como plataforma modular de aprendizagem, utilizando apenas uma unidade completa:

**Unidade 1.1 --- Exibindo mensagens com print()**

A primeira fase não tem como objetivo entregar um curso de Python completo. Seu objetivo é provar que o modelo pedagógico, a interface, o motor de atividade e o progresso funcionam juntos.

------------------------------------------------------------------------

**2. Resultado esperado**

Ao final desta fase, um aluno iniciante deverá conseguir:

1.  abrir o ITERA no navegador;

2.  compreender para que serve print();

3.  consultar um exemplo;

4.  escrever código;

5.  executar o código;

6.  visualizar a saída;

7.  receber feedback;

8.  solicitar dicas graduais;

9.  concluir a atividade;

10. acessar o aprofundamento opcional;

11. fechar e reabrir a página sem perder o progresso.

Somente depois dessa validação serão criadas as unidades 1.2 e 1.3.

------------------------------------------------------------------------

**3. Princípio arquitetural**

O ITERA deverá manter três camadas separadas:

Plataforma

\+ Motor de atividade

\+ Conteúdo

**3.1 Plataforma**

Responsável por:

- cursos;

- trilhas;

- unidades;

- navegação;

- progresso;

- dicas;

- feedback;

- persistência;

- aprofundamento opcional.

**3.2 Motor de atividade**

Responsável por apresentar e verificar uma prática.

Nesta fase será implementado somente:

CodeActivityEngine

Outros tipos serão apenas previstos no contrato arquitetural:

multiple_choice

short_answer

association

ordering

case_analysis

Não serão criadas interfaces nem schemas detalhados para esses motores agora.

**3.3 Conteúdo**

Responsável por armazenar:

- objetivo;

- explicação;

- exemplo;

- prática;

- dicas;

- aprofundamento;

- critérios de conclusão.

O conteúdo não poderá ficar escrito diretamente nos componentes React.

------------------------------------------------------------------------

**4. Escopo**

**Incluído**

- estrutura mínima de curso, trilha e unidade;

- interface no navegador;

- unidade 1.1 completa;

- percurso essencial;

- aprofundamento opcional;

- editor de código;

- execução de Python;

- Web Worker;

- timeout;

- entrada simulada;

- saída do programa;

- verificação comportamental;

- dicas graduais;

- progresso local;

- tratamento básico de erros;

- testes essenciais;

- teste inicial com usuários.

**Não incluído**

- unidades 1.2 e 1.3;

- login;

- banco remoto;

- sincronização;

- inteligência artificial;

- painel administrativo;

- gamificação;

- certificados;

- pagamentos;

- ranking;

- terminal interativo completo;

- múltiplos cursos;

- outros motores de atividade implementados;

- aplicativo móvel.

------------------------------------------------------------------------

**5. Stack técnica**

  -----------------------------------------------------------------------
  **Camada**                        **Tecnologia**
  --------------------------------- -------------------------------------
  Interface                         React + TypeScript

  Build                             Vite

  Estilo                            Tailwind CSS

  Editor                            CodeMirror 6

  Execução Python                   Pyodide

  Isolamento                        Web Worker

  Conteúdo                          JSON com Markdown

  Validação                         Zod

  Progresso inicial                 LocalStorage

  Testes unitários                  Vitest

  Testes de interface               Playwright
  -----------------------------------------------------------------------

**6. Persistência**

Nesta fase, o progresso será salvo em localStorage.

A plataforma deverá utilizar uma abstração:

interface ProgressRepository {

load(): Promise\<UserProgress\>;

save(progress: UserProgress): Promise\<void\>;

reset(): Promise\<void\>;

}

A implementação inicial será:

LocalStorageProgressRepository

Essa separação permitirá substituir localStorage por IndexedDB ou banco remoto posteriormente, sem alterar o núcleo da plataforma.

**Dados salvos**

- unidade atual;

- código escrito;

- quantidade de tentativas;

- dicas abertas;

- atividade concluída;

- aprofundamento acessado;

- data da última atividade.

------------------------------------------------------------------------

**7. Modelo pedagógico da unidade**

A unidade terá dois percursos independentes.

**7.1 Percurso essencial**

Obrigatório para concluir a unidade.

Estrutura:

1.  Objetivo

2.  Para que serve

3.  Como funciona

4.  Exemplo

5.  Prática

6.  Feedback

7.  Dicas

**7.2 Aprofundamento opcional**

Não bloqueia o avanço.

Deverá conter:

- origem do conceito;

- problema que ele resolve;

- evolução;

- funcionamento interno básico;

- comparação com outras linguagens;

- boas práticas;

- curiosidades;

- desafios conceituais opcionais (perguntas de múltipla escolha sobre o conteúdo da unidade, sem execução de código).

Regra obrigatória:

Nenhuma informação necessária para concluir a atividade poderá existir apenas no aprofundamento.

------------------------------------------------------------------------

**8. Unidade 1.1 --- print()**

**Título**

Exibindo mensagens com print()

**Objetivo**

O aluno deverá conseguir exibir uma mensagem no painel de saída.

**Para que serve**

Explicar que programas precisam comunicar informações ao usuário.

**Como funciona**

Apresentar:

- função print;

- uso dos parênteses;

- uso das aspas;

- execução da instrução;

- saída produzida.

**Exemplo**

print(\"Olá\")

**Prática**

O aluno deverá escrever um programa que exiba:

Meu diário de saúde

**Código inicial**

O editor poderá iniciar vazio ou com um comentário curto:

\# Escreva seu código abaixo

------------------------------------------------------------------------

**9. Critérios de conclusão**

A atividade será considerada correta quando:

- o código executar sem erro;

- a saída normalizada for Meu diário de saúde;

- a mensagem não estiver apenas em comentário;

- o programa realmente produzir saída.

A validação principal será comportamental.

**Regra sobre AST**

A análise estrutural não será usada como padrão.

Ela só poderá ser aplicada quando houver um requisito pedagógico explícito e indispensável.

Na unidade 1.1, pode ser usada apenas para diferenciar:

- uso real de print;

- texto colocado em comentário;

- texto sem execução.

Soluções alternativas corretas não deverão ser rejeitadas.

------------------------------------------------------------------------

**10. Verificação comportamental**

O verificador deverá:

1.  receber o código;

2.  executar dentro do Worker;

3.  capturar a saída;

4.  normalizar espaços e quebras de linha;

5.  comparar com o resultado esperado;

6.  devolver feedback pedagógico.

Exemplo de resultado:

interface ActivityResult {

status:

\| \"success\"

\| \"incorrect\"

\| \"syntax_error\"

\| \"runtime_error\"

\| \"timeout\"

\| \"internal_error\";

message: string;

output?: string;

}

------------------------------------------------------------------------

**11. Execução do código**

Fluxo:

Editor

→ CodeActivityEngine

→ Web Worker

→ Pyodide

→ execução

→ captura de saída

→ resultado

→ feedback

**Requisitos obrigatórios**

- Pyodide executado dentro de Web Worker;

- limite de tempo;

- encerramento do Worker em timeout;

- reinicialização após travamento;

- limite para quantidade de saída;

- captura de erros;

- nenhuma execução local;

- nenhum acesso ao sistema operacional;

- interface principal não pode congelar.

------------------------------------------------------------------------

**12. Entrada simulada**

A primeira versão não terá terminal interativo completo.

O motor deverá ser preparado para entrada simulada, mas a unidade 1.1 não utilizará input().

Quando unidades futuras precisarem de entrada, o sistema fornecerá valores controlados durante a execução.

Exemplo futuro:

entrada simulada: Claudio

Isso permitirá testar o código sem criar um terminal complexo.

------------------------------------------------------------------------

**13. Dicas graduais**

A quantidade de dicas será variável.

O schema deverá aceitar de uma a cinco dicas.

Exemplo para a unidade 1.1:

**Dica 1**

Use uma função que exibe informações.

**Dica 2**

A função se chama print.

**Dica 3**

Coloque a mensagem entre aspas e dentro dos parênteses.

**Dica 4**

Estrutura esperada:

print(\"mensagem\")

As dicas serão liberadas uma por vez.

------------------------------------------------------------------------

**14. Feedback pedagógico**

O sistema deverá diferenciar:

**Sucesso**

A mensagem foi exibida corretamente.

**Saída incorreta**

Seu programa executou, mas a mensagem exibida não corresponde ao objetivo.

**Erro de sintaxe**

O Python não conseguiu interpretar o código. Verifique as aspas e os parênteses.

**Nenhuma saída**

O código executou, mas nenhuma mensagem foi exibida.

**Timeout**

A execução demorou mais que o limite permitido e foi interrompida.

**Erro interno**

Ocorreu uma falha no ambiente de execução. Seu código foi preservado.

Mensagens como "Errado" ou "Falhou" não deverão ser usadas isoladamente.

------------------------------------------------------------------------

**15. Aprofundamento opcional da unidade 1.1**

**Origem**

Explicar por que programas precisam apresentar resultados.

**Terminal**

Introduzir de forma simples o ambiente onde mensagens de texto são exibidas.

**Saída padrão**

Apresentar o conceito de stdout sem aprofundamento excessivo.

**Evolução**

Explicar brevemente a diferença entre print no Python 2 e print() no Python 3.

**Comparações**

Python:

print(\"Olá\")

JavaScript:

console.log(\"Olá\")

Java:

System.out.println(\"Olá\");

**Boas práticas**

- usar mensagens claras;

- evitar excesso de saídas;

- diferenciar mensagens para usuário e mensagens de depuração.

**Desafios conceituais**

Três perguntas de múltipla escolha sobre o conteúdo da unidade, sem execução de código.

Esses desafios não interferem na conclusão principal.

------------------------------------------------------------------------

**16. Interface mínima**

**Cabeçalho**

- nome ITERA;

- nome do curso;

- progresso;

- botão para reiniciar.

**Menu lateral**

Nesta fase poderá mostrar apenas:

Trilha 1 --- Fundamentos de interação

└── 1.1 print

As futuras unidades poderão aparecer como "em preparação", sem funcionalidade.

**Área principal**

- objetivo;

- explicação;

- exemplo;

- prática;

- aprofundamento.

**Área de código**

- editor;

- botão Executar;

- botão Verificar;

- botão Dica;

- botão Restaurar;

- painel de saída;

- painel de feedback.

------------------------------------------------------------------------

**17. Diferença entre Executar e Verificar**

**Executar**

- roda o código;

- mostra a saída;

- mostra erros técnicos;

- não conclui a unidade.

**Verificar**

- executa o código;

- aplica os critérios pedagógicos;

- fornece feedback;

- registra a tentativa;

- conclui a unidade quando correto.

Essa separação deve ficar clara visualmente.

------------------------------------------------------------------------

**18. Estrutura mínima de dados**

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

\"purpose\": \"\...\",

\"behavior\": \"\...\",

\"example\": \"\...\",

\"application\": \"\...\"

},

\"deepDive\": {

\"enabled\": true,

\"origin\": \"\...\",

\"evolution\": \"\...\",

\"internalBehavior\": \"\...\",

\"comparisons\": \"\...\",

\"goodPractices\": \"\...\",

\"curiosities\": \"\...\"

},

\"activity\": {

\"type\": \"code\",

\"config\": {

\"language\": \"python\",

\"starterCode\": \"# Escreva seu código abaixo\",

\"expectedOutput\": \"Meu diário de saúde\",

\"timeoutMs\": 3000

}

},

\"hints\": \[

\"\...\",

\"\...\",

\"\...\"

\]

}

------------------------------------------------------------------------

**19. Contrato mínimo de atividades**

type ActivityType =

\| \"code\"

\| \"multiple_choice\"

\| \"short_answer\"

\| \"association\"

\| \"ordering\"

\| \"case_analysis\";

interface ActivityEngine\<TConfig, TResponse\> {

type: ActivityType;

validate(

response: TResponse,

config: TConfig

): Promise\<ActivityResult\>;

reset(): void;

}

Nesta fase, apenas o CodeActivityEngine será implementado.

Não serão criadas implementações vazias dos demais motores.

------------------------------------------------------------------------

**20. Estrutura de pastas**

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

**21. Ordem de implementação**

**Etapa 1 --- Fundação**

- criar projeto React com TypeScript;

- configurar Vite;

- configurar Tailwind;

- configurar Vitest;

- configurar Playwright;

- criar estrutura de pastas.

**Etapa 2 --- Modelo mínimo**

- definir curso;

- definir trilha;

- definir unidade;

- definir atividade;

- definir progresso;

- definir resultado.

**Etapa 3 --- Conteúdo completo**

Escrever integralmente a unidade 1.1:

- percurso essencial;

- exemplo;

- prática;

- dicas;

- feedbacks;

- aprofundamento;

- critérios de conclusão.

Essa etapa deve ser concluída antes de ampliar a interface.

**Etapa 4 --- Núcleo**

- carregar conteúdo;

- navegar até a unidade;

- controlar estado;

- registrar progresso;

- controlar dicas;

- controlar aprofundamento.

**Etapa 5 --- Interface base**

- cabeçalho;

- menu lateral;

- área de conteúdo;

- prática;

- aprofundamento;

- feedback.

**Etapa 6 --- Editor**

- integrar CodeMirror;

- salvar código;

- restaurar código inicial;

- manter código ao atualizar a página.

**Etapa 7 --- Motor de código mínimo**

- carregar Pyodide;

- criar Web Worker;

- executar código;

- capturar saída;

- capturar erros;

- aplicar timeout;

- limitar saída.

**Etapa 8 --- Verificação**

- normalizar saída;

- comparar comportamento;

- registrar tentativa;

- gerar feedback;

- concluir unidade.

**Etapa 9 --- Persistência**

- implementar ProgressRepository;

- criar implementação com localStorage;

- restaurar estado;

- reiniciar progresso.

**Etapa 10 --- Teste interno**

Validar:

- carregamento;

- execução;

- erros;

- timeout;

- dicas;

- conclusão;

- persistência;

- aprofundamento.

**Etapa 11 --- Teste inicial com usuários**

Testar com uma ou duas pessoas iniciantes.

Observar:

- se entendem o objetivo;

- se sabem onde escrever;

- se distinguem Executar de Verificar;

- se compreendem o feedback;

- se utilizam as dicas;

- se conseguem concluir sem orientação;

- se acessam o aprofundamento;

- quanto tempo levam.

**Etapa 12 --- Correções**

Corrigir problemas encontrados antes de criar qualquer nova unidade.

------------------------------------------------------------------------

**22. Testes obrigatórios**

**Testes do núcleo**

- carregamento da unidade;

- validação do conteúdo;

- progresso;

- conclusão;

- dicas;

- aprofundamento;

- restauração.

**Testes do motor**

- código correto;

- saída incorreta;

- erro de sintaxe;

- erro de execução;

- nenhuma saída;

- timeout;

- reinicialização do Worker;

- limite de saída.

**Testes de interface**

- abrir unidade;

- escrever código;

- executar;

- verificar;

- abrir dica;

- concluir;

- abrir aprofundamento;

- atualizar a página;

- confirmar persistência;

- reiniciar progresso.

**Comandos**

npm run lint

npm run typecheck

npm test

npm run build

npm run test:e2e

Todos deverão terminar sem erros.

------------------------------------------------------------------------

**23. Critérios de conclusão**

A primeira fase estará concluída quando:

- a unidade 1.1 estiver completa;

- o conteúdo estiver separado da interface;

- o núcleo não depender diretamente de Python;

- o motor de código estiver isolado;

- Pyodide rodar em Web Worker;

- timeout não travar a página;

- a saída for verificada por comportamento;

- soluções alternativas corretas forem aceitas;

- as dicas forem graduais;

- o aprofundamento funcionar;

- o progresso persistir;

- os testes passarem;

- uma ou duas pessoas iniciantes conseguirem concluir a unidade;

- os problemas observados forem corrigidos.

**24. Regra para avançar**

As unidades 1.2 e 1.3 só poderão ser iniciadas depois que:

1.  a unidade 1.1 estiver tecnicamente estável;

2.  o fluxo tiver sido testado com usuários;

3.  os principais problemas de compreensão e navegação tiverem sido corrigidos;

4.  o modelo de conteúdo tiver sido validado;

5.  o motor de código estiver seguro e reutilizável.

------------------------------------------------------------------------

**25. Resultado da fase**

Ao final, o ITERA terá:

- uma arquitetura multiconteúdo;

- um motor de código funcional;

- uma unidade pedagógica completa;

- um aprofundamento opcional;

- progresso persistente;

- execução segura;

- validação inicial com usuários;

- base concreta para expansão.
