import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface GuideModalProps {
  onClose: () => void;
}

interface GuideStep {
  title: string;
  description: React.ReactNode;
}

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

const GUIDE_STEPS: GuideStep[] = [
  {
    title: "1. Leia a explicação",
    description: (
      <>
        Antes de praticar, leia o <strong className="text-indigo-300">Objetivo</strong>, o{" "}
        <strong className="text-indigo-300">Para que serve?</strong>, o{" "}
        <strong className="text-indigo-300">Como funciona?</strong> e o{" "}
        <strong className="text-indigo-300">Exemplo</strong>. Comece lendo a explicação da
        unidade. Você não precisa decorar nada. O objetivo é entender a ideia principal antes de
        praticar.
      </>
    ),
  },
  {
    title: "2. Encontre o editor",
    description: (
      <>
        Na seção "Sua vez", você encontrará o editor de código. É nesse espaço que você
        escreverá sua resposta. Você pode escrever, apagar, corrigir e experimentar à vontade.
      </>
    ),
  },
  {
    title: "3. Use Executar",
    description: (
      <>
        Clique em <strong className="text-indigo-300">Executar</strong> para ver o que o seu
        código produz. <strong className="text-indigo-300">Executar</strong> não avalia se a
        resposta está correta; ele apenas roda o programa e mostra o resultado.
      </>
    ),
  },
  {
    title: "4. Observe a saída",
    description: (
      <>
        Depois de executar, observe o painel de saída. Ele mostra exatamente o que o programa
        produziu.
      </>
    ),
  },
  {
    title: "5. Use Verificar",
    description: (
      <>
        Quando acreditar que sua resposta está correta, clique em{" "}
        <strong className="text-indigo-300">Verificar</strong>. O ITERA comparará o resultado
        com o objetivo da atividade e mostrará um feedback.
      </>
    ),
  },
  {
    title: "6. Leia o feedback",
    description: (
      <>
        <p className="mb-2">
          Depois de <strong className="text-indigo-300">Verificar</strong>, você pode ver:
        </p>
        <ul className="list-disc pl-4 space-y-1">
          <li>Sucesso</li>
          <li>Revisar resposta</li>
          <li>Nenhuma saída</li>
          <li>Revisão necessária</li>
          <li>Falha da plataforma</li>
        </ul>
      </>
    ),
  },
  {
    title: "7. Use as dicas",
    description: (
      <>
        Se ficar em dúvida, use o botão <strong className="text-indigo-300">Dica</strong>. As
        dicas são liberadas uma por vez para ajudar sem entregar imediatamente a resposta.
      </>
    ),
  },
  {
    title: "8. Restaurar código",
    description: (
      <>
        Use <strong className="text-indigo-300">Restaurar</strong> quando quiser voltar ao
        código inicial da atividade. Essa ação substitui o que está atualmente no editor.
      </>
    ),
  },
  {
    title: "9. Reiniciar progresso",
    description: (
      <>
        Use <strong className="text-indigo-300">Reiniciar progresso</strong> somente quando
        quiser começar novamente do zero. Essa ação apaga o progresso da unidade, tentativas,
        dicas abertas e código salvo.
      </>
    ),
  },
  {
    title: "10. Aprofundamento opcional",
    description: (
      <>
        Depois da prática, você pode abrir o aprofundamento para conhecer mais sobre o conceito
        e resolver desafios opcionais. Essa parte não é necessária para concluir a unidade.
      </>
    ),
  },
  {
    title: "11. Salvamento automático",
    description: (
      <>
        Seu código e progresso são salvos automaticamente neste navegador. Ao voltar à página,
        você poderá continuar de onde parou.
      </>
    ),
  },
];

// Modal de orientação sobre como usar a plataforma — não é conteúdo curricular,
// não executa código, não toca progresso/tentativas/dicas/aprofundamento.
export const GuideModal: React.FC<GuideModalProps> = ({ onClose }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

  // Move o foco para o modal ao abrir e devolve ao elemento que o abriu ao fechar.
  useEffect(() => {
    previouslyFocusedElementRef.current = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    return () => {
      previouslyFocusedElementRef.current?.focus();
    };
  }, []);

  // Escape fecha; Tab/Shift+Tab ficam presos dentro do modal (focus trap completo).
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const container = containerRef.current;
      if (!container) return;

      const focusable = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      ).filter((element) => !element.hasAttribute("disabled"));

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
      } else if (document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Renderizado via portal direto em document.body: o cabeçalho tem
  // backdrop-blur (backdrop-filter), que cria um novo containing block para
  // elementos fixed — sem o portal, este modal ficaria preso dentro da caixa
  // do cabeçalho em vez de cobrir a viewport inteira.
  return createPortal(
    <div
      className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="guide-title"
    >
      <div
        ref={containerRef}
        className="bg-slate-900 border border-slate-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col"
      >
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <h2 id="guide-title" className="font-bold text-slate-100 flex items-center space-x-2">
            <span className="text-indigo-400">📘</span>
            <span>Como usar o ITERA</span>
          </h2>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-200 rounded focus:ring-2 focus:ring-slate-500"
            aria-label="Fechar guia de orientação"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {GUIDE_STEPS.map((step) => (
            <div key={step.title}>
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-1">
                {step.title}
              </h3>
              <div className="text-sm text-slate-300 leading-relaxed">{step.description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default GuideModal;
