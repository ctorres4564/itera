import React, { useState } from "react";
import type { ConceptualChallenge } from "../../core/domain/types";

interface ConceptChallengeProps {
  challenge: ConceptualChallenge;
  index: number;
}

const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F"];

// Desafio conceitual autocontido: seleção de alternativa, acerto/erro e
// feedback vivem só no state local deste componente. Não depende do motor de
// execução, do worker técnico, do verificador nem da persistência de
// progresso — não roda código nenhum, só compara índices numéricos.
export const ConceptChallenge: React.FC<ConceptChallengeProps> = ({ challenge, index }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const hasAnswered = selectedIndex !== null;
  const isCorrect = hasAnswered && selectedIndex === challenge.correctOptionIndex;

  const handleRetry = () => setSelectedIndex(null);

  return (
    <div
      className="border border-border-default rounded-lg p-4 space-y-3 bg-background/40"
      data-testid={`concept-challenge-${index}`}
    >
      <h5 className="text-sm font-bold text-text-primary">
        {index + 1}. {challenge.title}
      </h5>

      {challenge.code && (
        <pre className="p-3 bg-background border border-border-default rounded font-mono text-brand-primary-hover text-xs overflow-x-auto">
          {challenge.code}
        </pre>
      )}

      {challenge.expectedOutputDisplay && (
        <div>
          <p className="text-label uppercase tracking-wider mb-1">
            Saída desejada
          </p>
          <pre className="p-3 bg-background border border-border-default rounded font-mono text-text-secondary text-xs overflow-x-auto whitespace-pre-wrap">
            {challenge.expectedOutputDisplay}
          </pre>
        </div>
      )}

      <p className="text-sm text-text-secondary leading-relaxed">{challenge.question}</p>

      <div className="space-y-2">
        {challenge.options.map((option, optionIndex) => {
          const letter = OPTION_LETTERS[optionIndex] ?? String(optionIndex + 1);
          const isSelected = selectedIndex === optionIndex;
          const isThisCorrect = optionIndex === challenge.correctOptionIndex;

          let stateClass = "border-border-default hover:border-border-strong";
          if (hasAnswered && isThisCorrect) {
            stateClass = "border-success bg-success-surface";
          } else if (hasAnswered && isSelected && !isThisCorrect) {
            stateClass = "border-error bg-error-surface";
          }

          return (
            <button
              key={optionIndex}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setSelectedIndex(optionIndex)}
              disabled={hasAnswered}
              className={`w-full text-left px-3 py-2 rounded border text-xs text-text-secondary transition-colors disabled:cursor-default ${stateClass}`}
            >
              <span className="font-bold text-text-muted mr-2">{letter})</span>
              {challenge.optionsAreCode ? (
                <span className="font-mono whitespace-pre-wrap">{option}</span>
              ) : (
                option
              )}
            </button>
          );
        })}
      </div>

      {hasAnswered && (
        <div
          className={`p-3 rounded border text-xs leading-relaxed ${
            isCorrect
              ? "bg-success-surface border-success-surface text-success"
              : "bg-error-surface border-error-surface text-error"
          }`}
          role="status"
        >
          <p className="font-bold mb-1">{isCorrect ? "Correto!" : "Incorreto"}</p>
          <p className="text-text-secondary">{challenge.feedback}</p>
          {challenge.explanation && (
            <pre className="mt-2 p-2 bg-background/60 rounded font-mono text-text-secondary overflow-x-auto">
              {challenge.explanation}
            </pre>
          )}
          <button
            type="button"
            onClick={handleRetry}
            className="mt-2 text-xs font-semibold text-text-muted hover:text-text-secondary underline"
          >
            Tentar novamente
          </button>
        </div>
      )}
    </div>
  );
};

export default ConceptChallenge;
