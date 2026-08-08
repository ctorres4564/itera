import React, { useEffect, useRef } from "react";
import type { UnitDeepDive } from "../../core/domain/types";
import { ConceptChallenge } from "./ConceptChallenge";

interface DeepDivePanelProps {
  deepDive: UnitDeepDive;
  onClose: () => void;
}

export const DeepDivePanel: React.FC<DeepDivePanelProps> = ({ deepDive, onClose }) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

  // Move o foco para o painel ao abrir e devolve ao elemento que o abriu ao fechar.
  useEffect(() => {
    if (!deepDive.enabled) return;
    previouslyFocusedElementRef.current = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    return () => {
      previouslyFocusedElementRef.current?.focus();
    };
  }, [deepDive.enabled]);

  // Escape fecha o painel, como esperado de um diálogo modal.
  useEffect(() => {
    if (!deepDive.enabled) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [deepDive.enabled, onClose]);

  if (!deepDive.enabled) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[32rem] bg-slate-900 border-l border-slate-800 shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-out" role="dialog" aria-modal="true" aria-labelledby="deepdive-title">
      {/* Cabeçalho */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
        <h3 id="deepdive-title" className="font-bold text-slate-100 flex items-center space-x-2">
          <span className="text-indigo-400">💡</span>
          <span>Aprofundamento Opcional</span>
        </h3>
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-slate-200 rounded focus:ring-2 focus:ring-slate-500"
          aria-label="Fechar aprofundamento opcional"
        >
          ✕
        </button>
      </div>

      {/* Conteúdo rolável */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div>
          <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">1. Origem Histórica</h4>
          <p className="text-sm text-slate-300 leading-relaxed">{deepDive.origin}</p>
        </div>

        {deepDive.terminal && (
          <div>
            <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">2. O Terminal</h4>
            <p className="text-sm text-slate-300 leading-relaxed">{deepDive.terminal}</p>
          </div>
        )}

        {deepDive.stdout && (
          <div>
            <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">3. Saída Padrão (stdout)</h4>
            <p className="text-sm text-slate-300 leading-relaxed">{deepDive.stdout}</p>
          </div>
        )}

        <div>
          <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">4. Evolução da Linguagem</h4>
          <p className="text-sm text-slate-300 leading-relaxed">{deepDive.evolution}</p>
        </div>

        {deepDive.internalBehavior && (
          <div>
            <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">5. Funcionamento Interno</h4>
            <p className="text-sm text-slate-300 leading-relaxed">{deepDive.internalBehavior}</p>
          </div>
        )}

        <div>
          <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">6. Outras Linguagens</h4>
          <p className="text-sm text-slate-300 leading-relaxed">{deepDive.comparisons}</p>
        </div>

        <div>
          <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">7. Boas Práticas</h4>
          <p className="text-sm text-slate-300 leading-relaxed">{deepDive.goodPractices}</p>
        </div>

        <div>
          <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">8. Curiosidades</h4>
          <p className="text-sm text-slate-300 leading-relaxed">{deepDive.curiosities}</p>
        </div>

        {deepDive.conceptualChallenges.length > 0 && (
          <div className="pt-4 border-t border-slate-800/60 space-y-3">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Desafios Conceituais (opcional)
            </h4>
            {deepDive.conceptualChallenges.map((challenge, index) => (
              <ConceptChallenge key={index} challenge={challenge} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
