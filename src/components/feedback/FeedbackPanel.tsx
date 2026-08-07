import React from "react";
import type { ActivityResult } from "../../core/domain/types";

interface FeedbackPanelProps {
  result: ActivityResult | null;
}

type Tone = "success" | "warning" | "error";

const TITLE_BY_STATUS: Record<ActivityResult["status"], string> = {
  success: "Sucesso",
  incorrect: "Revisar resposta",
  no_output: "Nenhuma saída",
  syntax_error: "Revisão necessária",
  runtime_error: "Revisão necessária",
  timeout: "Revisão necessária",
  output_limit: "Revisão necessária",
  internal_error: "Falha da plataforma",
};

const TONE_BY_STATUS: Record<ActivityResult["status"], Tone> = {
  success: "success",
  incorrect: "warning",
  no_output: "warning",
  syntax_error: "error",
  runtime_error: "error",
  timeout: "error",
  output_limit: "error",
  internal_error: "error",
};

const STYLE_BY_TONE: Record<Tone, { bg: string; text: string; icon: string }> = {
  success: { bg: "bg-emerald-950/30 border-emerald-900/50", text: "text-emerald-300", icon: "✓" },
  warning: { bg: "bg-amber-950/20 border-amber-900/50", text: "text-amber-300", icon: "◐" },
  error: { bg: "bg-red-950/20 border-red-900/50", text: "text-red-300", icon: "⚠" },
};

export const FeedbackPanel: React.FC<FeedbackPanelProps> = ({ result }) => {
  if (!result) return null;

  const tone = TONE_BY_STATUS[result.status];
  const titleText = TITLE_BY_STATUS[result.status];
  const { bg: bgClass, text: textClass, icon } = STYLE_BY_TONE[tone];

  return (
    <div className={`p-4 rounded border ${bgClass} transition-all duration-300`} role="alert">
      <div className="flex items-start space-x-3">
        {/* Ícone Semântico */}
        <span className={`text-lg font-bold ${textClass}`} aria-hidden="true">
          {icon}
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
