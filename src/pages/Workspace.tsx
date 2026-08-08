import React, { useEffect, useMemo, useRef, useState } from "react";
import { MainLayout } from "../components/layout/MainLayout";
import { Header } from "../components/navigation/Header";
import { Sidebar } from "../components/navigation/Sidebar";
import { FeedbackPanel } from "../components/feedback/FeedbackPanel";
import { DeepDivePanel } from "../components/deep-dive/DeepDivePanel";
import { CodeEditor } from "../components/editor/CodeEditor";
import { EditorToolbar } from "../components/editor/EditorToolbar";

import { loadUnit } from "../core/curriculum/loader";
import {
  createInitialProgress,
  createInitialUnitProgress,
  unlockHint,
  updateDeepDiveStatus,
  updateUnitCode,
  resetUnitProgress,
  registerAttempt,
} from "../core/progress/manager";
import type { UserProgress, ActivityResult } from "../core/domain/types";
import type { ProgressRepository } from "../core/domain/contracts";
import { LocalStorageProgressRepository } from "../core/persistence/LocalStorageProgressRepository";
import { CodeActivityEngine } from "../activities/code/engine/CodeActivityEngine";
import type { EngineStatus } from "../activities/code/worker/protocol";
import { verifyActivityResult } from "../activities/code/verifier/OutputVerifier";

// Conteúdo JSON pedagógico real
import unitData from "../content/courses/python-iniciante/units/1.1-print.json";

interface WorkspaceProps {
  // Injeção opcional para testes; em produção usa LocalStorageProgressRepository.
  repository?: ProgressRepository;
}

export const Workspace: React.FC<WorkspaceProps> = ({ repository }) => {
  // O conteúdo da unidade é estático (mesmo import a cada render); memoizar
  // evita revalidar o schema Zod em todo render sem mudar nenhum comportamento.
  const unit = useMemo(() => loadUnit(unitData), []);
  const [progress, setProgress] = useState<UserProgress>(() =>
    createInitialProgress(unit.id, unit.activity.config.starterCode)
  );

  const [code, setCode] = useState(unit.activity.config.starterCode);
  const [stdout, setStdout] = useState<string>("");
  const [feedback, setFeedback] = useState<ActivityResult | null>(null);
  const [showDeepDive, setShowDeepDive] = useState(false);
  const [engineStatus, setEngineStatus] = useState<EngineStatus>("loading");
  const [isRunning, setIsRunning] = useState(false);
  const [isProgressLoaded, setIsProgressLoaded] = useState(false);
  const engineRef = useRef<CodeActivityEngine | null>(null);

  // Repositório de persistência: injetável para testes, senão o repositório real
  // (armazenamento local do navegador). Toda leitura/escrita de progresso passa
  // exclusivamente por ele — este componente nunca acessa o armazenamento direto.
  const repositoryRef = useRef<ProgressRepository | null>(null);
  if (repositoryRef.current === null) {
    repositoryRef.current =
      repository ??
      new LocalStorageProgressRepository(unit.id, unit.activity.config.starterCode);
  }

  // Motor Python (Worker + Pyodide) começa a carregar assim que a unidade monta.
  useEffect(() => {
    const created = new CodeActivityEngine(setEngineStatus);
    engineRef.current = created;
    return () => {
      created.dispose();
      engineRef.current = null;
    };
  }, []);

  // Carrega o progresso persistido assim que a unidade monta (ou mantém o
  // progresso inicial se não houver nada salvo ainda).
  useEffect(() => {
    let cancelled = false;
    repositoryRef.current?.load().then((loaded) => {
      if (cancelled) return;
      setProgress(loaded);
      setCode(loaded.units[unit.id]?.code ?? unit.activity.config.starterCode);
      setIsProgressLoaded(true);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Salva automaticamente sempre que o progresso mudar de fato (funções do
  // núcleo retornam a mesma referência quando não há alteração efetiva, então
  // esse efeito não dispara à toa). Só começa depois do load inicial terminar,
  // para não sobrescrever dados salvos com o estado inicial vazio.
  useEffect(() => {
    if (!isProgressLoaded) return;
    repositoryRef.current?.save(progress);
  }, [progress, isProgressLoaded]);

  const unitProgress =
    progress.units[unit.id] ||
    createInitialUnitProgress(unit.id, unit.activity.config.starterCode);

  const progressPercent = unitProgress.completed ? 100 : 0;

  // Lógica de dicas
  const handleUnlockHint = () => {
    const updated = unlockHint(progress, unit.id, unit.hints.length, unit.activity.config.starterCode);
    setProgress(updated);
  };

  // Reset de fato — sem confirmação própria, pois quem chama já confirmou
  // (o modal do Header ou o window.confirm do botão Restaurar).
  const performReset = () => {
    repositoryRef.current?.reset();

    const updated = resetUnitProgress(progress, unit.id, unit.activity.config.starterCode);
    setProgress(updated);
    setCode(unit.activity.config.starterCode);
    setStdout("");
    setFeedback(null);
  };

  // Botão "Restaurar" da área de prática: confirma e reseta. O texto reflete
  // o que a ação realmente faz (não é só o código — progresso, tentativas,
  // dicas e aprofundamento também são apagados), igual ao modal do Header.
  const handleResetProgress = () => {
    const confirmRestore = window.confirm(
      "Deseja realmente restaurar esta unidade? O código, o progresso, as tentativas, as dicas liberadas e o aprofundamento serão apagados."
    );
    if (!confirmRestore) return;

    performReset();
  };

  // Executar roda o código no motor técnico (Worker + Pyodide) e mostra saída/erros.
  // Não marca conclusão nem registra tentativa pedagógica — isso é responsabilidade
  // exclusiva do Verificar.
  const handleExecute = async () => {
    const engine = engineRef.current;
    if (!engine || engineStatus !== "ready" || isRunning) return;

    setIsRunning(true);
    try {
      const result = await engine.execute(code, unit.activity.config);
      setStdout(result.output ?? "");
      setFeedback(result);
    } finally {
      setIsRunning(false);
    }
  };

  // Verificar traduz o ActivityResult técnico do último Executar em resultado
  // pedagógico, registra a tentativa e conclui a unidade quando apropriado.
  // Não reexecuta código — trabalha só sobre o resultado já produzido pelo motor.
  const handleVerify = () => {
    if (!feedback) return;

    const verified = verifyActivityResult(feedback, unit.activity.config.expectedOutput);
    setFeedback(verified);

    const updated = registerAttempt(
      progress,
      unit.id,
      code,
      verified,
      unit.activity.config.starterCode
    );
    setProgress(updated);
  };

  // O código muda depois de um Executar invalida o resultado técnico: evita
  // verificar um resultado antigo contra um código já diferente. Também
  // mantém progress.units[unitId].code sincronizado com o buffer vivo do
  // editor, que é o que fica persistido (não existe um campo separado).
  const handleCodeChange = (value: string) => {
    setCode(value);
    setFeedback(null);
    setProgress((current) =>
      updateUnitCode(current, unit.id, value, unit.activity.config.starterCode)
    );
  };

  const handleOpenDeepDive = () => {
    const updated = updateDeepDiveStatus(progress, unit.id, "viewed", unit.activity.config.starterCode);
    setProgress(updated);
    setShowDeepDive(true);
  };

  return (
    <MainLayout
      header={
        <Header
          courseTitle="Python para iniciantes"
          progressPercent={progressPercent}
          onReset={performReset}
        />
      }
      sidebar={<Sidebar currentUnitId={unit.id} />}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Lado Esquerdo: Conteúdo Pedagógico */}
        <section className="lg:col-span-6 space-y-6" aria-labelledby="unit-title">
          <div>
            <h2 id="unit-title" className="text-2xl font-bold text-slate-100 mb-2">{unit.title}</h2>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 bg-indigo-950 text-indigo-400 border border-indigo-900 rounded-full">
                Unidade {unit.order}
              </span>
              {unitProgress.completed && (
                <span className="text-xs font-semibold px-2.5 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-900 rounded-full">
                  Concluído
                </span>
              )}
            </div>
          </div>

          <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
            <div>
              <h3 className="font-bold text-slate-200 mb-1 text-xs uppercase tracking-wider">Objetivo</h3>
              <p>{unit.objectives[0]}</p>
            </div>
            <div>
              <h3 className="font-bold text-slate-200 mb-1 text-xs uppercase tracking-wider">Para que serve?</h3>
              <p>{unit.essential.purpose}</p>
            </div>
            <div>
              <h3 className="font-bold text-slate-200 mb-1 text-xs uppercase tracking-wider">Como funciona?</h3>
              <p>{unit.essential.behavior}</p>
            </div>
            <div>
              <h3 className="font-bold text-slate-200 mb-1 text-xs uppercase tracking-wider">Exemplo</h3>
              <pre className="p-3 bg-slate-950 border border-slate-800 rounded font-mono text-indigo-300 text-xs">
                {unit.essential.example}
              </pre>
            </div>
          </div>
        </section>

        {/* Lado Direito: Área de Prática */}
        <section className="lg:col-span-6 space-y-6" aria-label="Área de Prática">
          <div className="bg-slate-950 border border-slate-800 rounded-lg overflow-hidden flex flex-col">
            <EditorToolbar />

            {/* Editor CodeMirror 6 Controlado */}
            <CodeEditor
              value={code}
              onChange={handleCodeChange}
            />

            {/* Ações */}
            <div className="bg-slate-900 px-4 py-3 border-t border-slate-800 flex items-center justify-between">
              <div className="flex space-x-2">
                <button
                  onClick={handleExecute}
                  disabled={engineStatus !== "ready" || isRunning}
                  className="px-4 py-2 text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded transition-colors focus:ring-2 focus:ring-slate-500 disabled:opacity-40 disabled:hover:bg-slate-800"
                >
                  {engineStatus === "loading" && "Carregando motor Python…"}
                  {engineStatus === "error" && "Motor indisponível"}
                  {engineStatus === "ready" && (isRunning ? "Executando…" : "Executar")}
                </button>
                <button
                  onClick={handleVerify}
                  disabled={!feedback}
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded transition-colors focus:ring-2 focus:ring-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600"
                >
                  Verificar
                </button>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={handleUnlockHint}
                  disabled={unitProgress.unlockedHintsCount >= unit.hints.length}
                  className="px-3 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 disabled:opacity-40 disabled:hover:text-slate-400 transition-colors"
                >
                  Dica ({unitProgress.unlockedHintsCount}/{unit.hints.length})
                </button>
                <button
                  onClick={handleResetProgress}
                  className="px-3 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Restaurar
                </button>
              </div>
            </div>
          </div>

          {/* Dicas reveladas */}
          {unitProgress.unlockedHintsCount > 0 && (
            <div className="bg-slate-950/40 border border-slate-800/80 rounded-lg p-4 space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dicas Liberadas:</h4>
              <ol className="list-decimal pl-4 space-y-1.5">
                {unit.hints.slice(0, unitProgress.unlockedHintsCount).map((hint, idx) => (
                  <li key={idx} className="text-xs text-slate-300 leading-relaxed">
                    {hint}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Painel de Saída */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Painel de Saída:</h4>
            <pre
              className="font-mono text-xs text-slate-300 min-h-12 bg-slate-900/60 p-3 rounded overflow-x-auto whitespace-pre-wrap"
              aria-live="polite"
            >
              {stdout || "(Aguardando execução...)"}
            </pre>
          </div>

          {/* Painel de Feedback */}
          <FeedbackPanel result={feedback} />
        </section>
      </div>

      {/* Aprofundamento opcional — vem depois da Prática, não entre Exemplo e Prática */}
      <div className="pt-6">
        <button
          onClick={handleOpenDeepDive}
          className="px-4 py-2 text-xs font-medium text-indigo-400 hover:text-indigo-300 bg-indigo-950/20 hover:bg-indigo-950/40 border border-indigo-900/40 rounded transition-colors focus:ring-2 focus:ring-indigo-500"
        >
          💡 Quero me aprofundar (Opcional)
        </button>
      </div>

      {/* Painel do aprofundamento */}
      {showDeepDive && (
        <DeepDivePanel
          deepDive={unit.deepDive}
          onClose={() => setShowDeepDive(false)}
        />
      )}
    </MainLayout>
  );
};
