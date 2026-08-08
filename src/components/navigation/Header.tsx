import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { GuideModal } from "../guide/GuideModal";

interface HeaderProps {
  courseTitle: string;
  progressPercent: number;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ courseTitle, progressPercent, onReset }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const resetButtonRef = useRef<HTMLButtonElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  const handleResetClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmReset = () => {
    onReset();
    setShowConfirm(false);
  };

  const handleCancelReset = () => {
    setShowConfirm(false);
  };

  // Move o foco para o modal ao abrir, fecha com Escape e devolve o foco ao
  // botão "Reiniciar" ao fechar (por qualquer caminho).
  useEffect(() => {
    if (!showConfirm) return;
    cancelButtonRef.current?.focus();
    const triggerButton = resetButtonRef.current;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowConfirm(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      triggerButton?.focus();
    };
  }, [showConfirm]);

  return (
    <div className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold tracking-wider text-brand-primary">ITERA</h1>
        <span className="text-text-muted hidden sm:inline">|</span>
        <span className="text-sm font-medium text-text-secondary hidden sm:inline">{courseTitle}</span>
      </div>

      <div className="flex items-center space-x-6">
        {/* Barra de Progresso */}
        <div className="flex items-center space-x-2">
          <span className="text-label">Progresso:</span>
          <div className="w-24 md:w-32 bg-surface-elevated rounded-full h-2 overflow-hidden" role="progressbar" aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100}>
            <div
              className="bg-brand-primary h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs font-bold text-text-secondary">{progressPercent}%</span>
        </div>

        {/* Botão do guia de orientação */}
        <button
          onClick={() => setShowGuide(true)}
          className="px-3 py-1.5 text-xs font-medium text-brand-primary hover:text-brand-primary-hover bg-brand-primary/10 hover:bg-brand-primary/20 border border-brand-primary/30 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-focus"
        >
          Como usar
        </button>

        {/* Botão de Reiniciar Progresso */}
        <button
          ref={resetButtonRef}
          onClick={handleResetClick}
          className="px-3 py-1.5 text-xs font-medium text-error hover:text-error bg-error/10 hover:bg-error/20 border border-error/30 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-error/50"
          aria-label="Reiniciar progresso do curso"
        >
          Reiniciar
        </button>
      </div>

      {/* Modal de confirmação acessível — via portal (mesmo motivo do GuideModal:
          o backdrop-blur do cabeçalho quebraria o posicionamento fixed). */}
      {showConfirm &&
        createPortal(
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className="bg-surface border border-border-default rounded-lg p-6 max-w-md w-full shadow-modal">
              <h2 id="modal-title" className="text-lg font-bold text-text-primary mb-2">Reiniciar Progresso?</h2>
              <p className="text-body mb-6">
                Esta ação apagará todo o seu progresso nesta unidade e restaurará o código inicial. Essa ação não pode ser desfeita.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  ref={cancelButtonRef}
                  onClick={handleCancelReset}
                  className="px-4 py-2 text-xs font-medium text-text-secondary bg-surface-elevated hover:bg-border-strong rounded transition-colors focus:ring-2 focus:ring-focus"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmReset}
                  // danger-solid/danger-solid-hover: preenchimento sólido de ação destrutiva.
                  // `error`/`error-surface` são para texto e superfície de mensagem (tons claros),
                  // não para botão sólido — por isso o token dedicado.
                  className="px-4 py-2 text-xs font-medium text-text-inverse bg-danger-solid hover:bg-danger-solid-hover rounded transition-colors focus:ring-2 focus:ring-error"
                >
                  Confirmar e Reiniciar
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {showGuide && <GuideModal onClose={() => setShowGuide(false)} />}
    </div>
  );
};
