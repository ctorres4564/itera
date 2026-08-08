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
      className="border border-slate-800 rounded-lg p-4 space-y-3 bg-slate-950/40"
      data-testid={`concept-challenge-${index}`}
    >
      <h5 className="text-sm font-bold text-slate-100">
        {index + 1}. {challenge.title}
      </h5>

      {challenge.code && (
        <pre className="p-3 bg-slate-950 border border-slate-800 rounded font-mono text-indigo-300 text-xs overflow-x-auto">
          {challenge.code}
        </pre>
      )}

      {challenge.expectedOutputDisplay && (
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Saída desejada
          </p>
          <pre className="p-3 bg-slate-950 border border-slate-800 rounded font-mono text-slate-300 text-xs overflow-x-auto whitespace-pre-wrap">
            {challenge.expectedOutputDisplay}
          </pre>
        </div>
      )}

      <p className="text-sm text-slate-300 leading-relaxed">{challenge.question}</p>

      <div className="space-y-2">
        {challenge.options.map((option, optionIndex) => {
          const letter = OPTION_LETTERS[optionIndex] ?? String(optionIndex + 1);
          const isSelected = selectedIndex === optionIndex;
          const isThisCorrect = optionIndex === challenge.correctOptionIndex;

          let stateClass = "border-slate-800 hover:border-slate-600";
          if (hasAnswered && isThisCorrect) {
            stateClass = "border-emerald-600 bg-emerald-950/20";
          } else if (hasAnswered && isSelected && !isThisCorrect) {
            stateClass = "border-red-600 bg-red-950/20";
          }

          return (
            <button
              key={optionIndex}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setSelectedIndex(optionIndex)}
              disabled={hasAnswered}
              className={`w-full text-left px-3 py-2 rounded border text-xs text-slate-300 transition-colors disabled:cursor-default ${stateClass}`}
            >
              <span className="font-bold text-slate-400 mr-2">{letter})</span>
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
              ? "bg-emerald-950/30 border-emerald-900/50 text-emerald-300"
              : "bg-red-950/20 border-red-900/50 text-red-300"
          }`}
          role="status"
        >
          <p className="font-bold mb-1">{isCorrect ? "Correto!" : "Incorreto"}</p>
          <p className="text-slate-300">{challenge.feedback}</p>
          {challenge.explanation && (
            <pre className="mt-2 p-2 bg-slate-950/60 rounded font-mono text-slate-300 overflow-x-auto">
              {challenge.explanation}
            </pre>
          )}
          <button
            type="button"
            onClick={handleRetry}
            className="mt-2 text-xs font-semibold text-slate-400 hover:text-slate-200 underline"
          >
            Tentar novamente
          </button>
        </div>
      )}
    </div>
  );
};

export default ConceptChallenge;
