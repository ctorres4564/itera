import React, { useState } from "react";
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
  unlockHint,
  updateDeepDiveStatus,
  resetUnitProgress,
} from "../core/progress/manager";
import type { UserProgress, ActivityResult } from "../core/domain/types";

// Conteúdo JSON pedagógico real
import unitData from "../content/courses/python-iniciante/units/1.1-print.json";

export const Workspace: React.FC = () => {
  const unit = loadUnit(unitData);
  const [progress, setProgress] = useState<UserProgress>(() =>
    createInitialProgress(unit.id, unit.activity.config.starterCode)
  );

  const [code, setCode] = useState(unit.activity.config.starterCode);
  const [stdout, setStdout] = useState<string>("");
  const [feedback, setFeedback] = useState<ActivityResult | null>(null);
  const [showDeepDive, setShowDeepDive] = useState(false);

  const unitProgress = progress.units[unit.id] || {
    code: unit.activity.config.starterCode,
    completed: false,
    unlockedHintsCount: 0,
    deepDiveStatus: "not_started",
  };

  const progressPercent = unitProgress.completed ? 100 : 0;

  // Lógica de dicas
  const handleUnlockHint = () => {
    const updated = unlockHint(progress, unit.id, unit.hints.length, unit.activity.config.starterCode);
    setProgress(updated);
  };

  // Lógica de reset
  const handleResetProgress = () => {
    const confirmRestore = window.confirm("Deseja realmente restaurar o código inicial?");
    if (!confirmRestore) return;

    const updated = resetUnitProgress(progress, unit.id, unit.activity.config.starterCode);
    setProgress(updated);
    setCode(unit.activity.config.starterCode);
    setStdout("");
    setFeedback(null);
  };

  // Botão Executar nesta etapa existe apenas visualmente sem executar código real
  const handleExecute = () => {
    // Placeholder sem execução nesta etapa
  };

  // Botão Verificar nesta etapa existe apenas visualmente sem verificar código real
  const handleVerify = () => {
    // Placeholder sem verificação nesta etapa
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
          onReset={handleResetProgress}
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
            <div>
              <h3 className="font-bold text-slate-200 mb-1 text-xs uppercase tracking-wider">Aplicação</h3>
              <pre className="p-3 bg-slate-950 border border-slate-800 rounded font-mono text-indigo-300 text-xs">
                {unit.essential.application}
              </pre>
            </div>
          </div>

          {/* Botão de aprofundamento */}
          <div className="pt-4">
            <button
              onClick={handleOpenDeepDive}
              className="px-4 py-2 text-xs font-medium text-indigo-400 hover:text-indigo-300 bg-indigo-950/20 hover:bg-indigo-950/40 border border-indigo-900/40 rounded transition-colors focus:ring-2 focus:ring-indigo-500"
            >
              💡 Quero me aprofundar (Opcional)
            </button>
          </div>
        </section>

        {/* Lado Direito: Área de Prática */}
        <section className="lg:col-span-6 space-y-6" aria-label="Área de Prática">
          <div className="bg-slate-950 border border-slate-800 rounded-lg overflow-hidden flex flex-col">
            <EditorToolbar />

            {/* Editor CodeMirror 6 Controlado */}
            <CodeEditor
              value={code}
              onChange={setCode}
            />

            {/* Ações */}
            <div className="bg-slate-900 px-4 py-3 border-t border-slate-800 flex items-center justify-between">
              <div className="flex space-x-2">
                <button
                  onClick={handleExecute}
                  className="px-4 py-2 text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded transition-colors focus:ring-2 focus:ring-slate-500"
                >
                  Executar
                </button>
                <button
                  onClick={handleVerify}
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded transition-colors focus:ring-2 focus:ring-indigo-500"
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
            <pre className="font-mono text-xs text-slate-300 min-h-12 bg-slate-900/60 p-3 rounded overflow-x-auto whitespace-pre-wrap">
              {stdout || "(Aguardando execução...)"}
            </pre>
          </div>

          {/* Painel de Feedback */}
          <FeedbackPanel result={feedback} />
        </section>
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
