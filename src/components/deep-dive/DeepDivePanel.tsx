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
    <div className="fixed inset-y-0 right-0 w-full sm:w-[32rem] bg-surface border-l border-border-default shadow-modal z-50 flex flex-col transform transition-transform duration-300 ease-out" role="dialog" aria-modal="true" aria-labelledby="deepdive-title">
      {/* Cabeçalho */}
      <div className="p-4 border-b border-border-default flex items-center justify-between bg-background/40">
        <h3 id="deepdive-title" className="font-bold text-text-primary flex items-center space-x-2">
          <span className="text-brand-primary">💡</span>
          <span>Aprofundamento Opcional</span>
        </h3>
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="p-1 text-text-muted hover:text-text-secondary rounded focus:ring-2 focus:ring-focus"
          aria-label="Fechar aprofundamento opcional"
        >
          ✕
        </button>
      </div>

      {/* Conteúdo rolável */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div>
          <h4 className="text-xs font-bold text-brand-primary uppercase tracking-wider mb-2">1. Origem Histórica</h4>
          <p className="text-sm text-text-secondary leading-relaxed">{deepDive.origin}</p>
        </div>

        {deepDive.terminal && (
          <div>
            <h4 className="text-xs font-bold text-brand-primary uppercase tracking-wider mb-2">2. O Terminal</h4>
            <p className="text-sm text-text-secondary leading-relaxed">{deepDive.terminal}</p>
          </div>
        )}

        {deepDive.stdout && (
          <div>
            <h4 className="text-xs font-bold text-brand-primary uppercase tracking-wider mb-2">3. Saída Padrão (stdout)</h4>
            <p className="text-sm text-text-secondary leading-relaxed">{deepDive.stdout}</p>
          </div>
        )}

        <div>
          <h4 className="text-xs font-bold text-brand-primary uppercase tracking-wider mb-2">4. Evolução da Linguagem</h4>
          <p className="text-sm text-text-secondary leading-relaxed">{deepDive.evolution}</p>
        </div>

        {deepDive.internalBehavior && (
          <div>
            <h4 className="text-xs font-bold text-brand-primary uppercase tracking-wider mb-2">5. Funcionamento Interno</h4>
            <p className="text-sm text-text-secondary leading-relaxed">{deepDive.internalBehavior}</p>
          </div>
        )}

        <div>
          <h4 className="text-xs font-bold text-brand-primary uppercase tracking-wider mb-2">6. Outras Linguagens</h4>
          <p className="text-sm text-text-secondary leading-relaxed">{deepDive.comparisons}</p>
        </div>

        <div>
          <h4 className="text-xs font-bold text-brand-primary uppercase tracking-wider mb-2">7. Boas Práticas</h4>
          <p className="text-sm text-text-secondary leading-relaxed">{deepDive.goodPractices}</p>
        </div>

        <div>
          <h4 className="text-xs font-bold text-brand-primary uppercase tracking-wider mb-2">8. Curiosidades</h4>
          <p className="text-sm text-text-secondary leading-relaxed">{deepDive.curiosities}</p>
        </div>

        {deepDive.conceptualChallenges.length > 0 && (
          <div className="pt-4 border-t border-border-default space-y-3">
            <h4 className="text-xs font-bold text-success uppercase tracking-wider">
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
