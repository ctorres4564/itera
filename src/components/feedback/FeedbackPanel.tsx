import React from "react";
import type { ActivityResult } from "../../core/domain/types";

interface FeedbackPanelProps {
  result: ActivityResult | null;
}

export const FeedbackPanel: React.FC<FeedbackPanelProps> = ({ result }) => {
  if (!result) return null;

  const isSuccess = result.status === "success";
  
  // Escolha de cores e estilos acessíveis com alto contraste
  const bgClass = isSuccess ? "bg-emerald-950/30 border-emerald-900/50" : "bg-red-950/20 border-red-900/50";
  const textClass = isSuccess ? "text-emerald-300" : "text-red-300";
  const titleText = isSuccess ? "Sucesso!" : "Revisão necessária";

  return (
    <div className={`p-4 rounded border ${bgClass} transition-all duration-300`} role="alert">
      <div className="flex items-start space-x-3">
        {/* Ícone Semântico */}
        <span className={`text-lg font-bold ${textClass}`} aria-hidden="true">
          {isSuccess ? "✓" : "⚠"}
        </span>
        <div className="flex-1">
          <h4 className={`text-sm font-bold ${textClass} mb-1`}>{titleText}</h4>
          <p className="text-xs text-slate-300 leading-relaxed">{result.message}</p>
          {result.technicalDetails && (
            <pre className="mt-2 p-2 bg-slate-950/60 rounded text-[10px] text-slate-400 font-mono overflow-x-auto max-h-24">
              {result.technicalDetails}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};
