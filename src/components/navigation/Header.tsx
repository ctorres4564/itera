import React, { useState } from "react";

interface HeaderProps {
  courseTitle: string;
  progressPercent: number;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ courseTitle, progressPercent, onReset }) => {
  const [showConfirm, setShowConfirm] = useState(false);

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

  return (
    <div className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold tracking-wider text-indigo-400">ITERA</h1>
        <span className="text-slate-500 hidden sm:inline">|</span>
        <span className="text-sm font-medium text-slate-300 hidden sm:inline">{courseTitle}</span>
      </div>

      <div className="flex items-center space-x-6">
        {/* Barra de Progresso */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-400">Progresso:</span>
          <div className="w-24 md:w-32 bg-slate-800 rounded-full h-2 overflow-hidden" role="progressbar" aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100}>
            <div
              className="bg-indigo-500 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs font-bold text-slate-300">{progressPercent}%</span>
        </div>

        {/* Botão de Reiniciar Progresso */}
        <button
          onClick={handleResetClick}
          className="px-3 py-1.5 text-xs font-medium text-red-400 hover:text-red-300 bg-red-950/20 hover:bg-red-950/40 border border-red-900/50 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/50"
          aria-label="Reiniciar progresso do curso"
        >
          Reiniciar
        </button>
      </div>

      {/* Modal de confirmação acessível */}
      {showConfirm && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 max-w-md w-full shadow-xl">
            <h2 id="modal-title" className="text-lg font-bold text-slate-100 mb-2">Reiniciar Progresso?</h2>
            <p className="text-sm text-slate-400 mb-6">
              Esta ação apagará todo o seu progresso nesta unidade e restaurará o código inicial. Essa ação não pode ser desfeita.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelReset}
                className="px-4 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded transition-colors focus:ring-2 focus:ring-slate-500"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-4 py-2 text-xs font-medium text-white bg-red-600 hover:bg-red-500 rounded transition-colors focus:ring-2 focus:ring-red-500"
              >
                Confirmar e Reiniciar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
