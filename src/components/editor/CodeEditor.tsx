import React, { useEffect, useRef } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import { python } from "@codemirror/lang-python";
import { basicSetup } from "codemirror";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ value, onChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);

  // Mantém a última referência de onChange sempre atualizada para evitar recriação do state do editor
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Inicialização do CodeMirror 6
  useEffect(() => {
    if (!containerRef.current) return;

    const startState = EditorState.create({
      doc: value,
      extensions: [
        basicSetup, // Inclui numeração de linhas, indentação, undo/redo, seleção múltipla e atalhos básicos
        python(),   // Destacamento de sintaxe Python
        EditorView.lineWrapping, // Quebra automática de linhas
        EditorView.theme({
          "&": {
            height: "100%",
            backgroundColor: "#020617", // slate-950
            color: "#cbd5e1", // slate-300
            fontSize: "14px",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
          },
          ".cm-content": {
            caretColor: "#6366f1", // indigo-500
          },
          "&.cm-focused": {
            outline: "2px solid #6366f1", // Foco visível nítido
            outlineOffset: "-2px",
          },
          ".cm-gutters": {
            backgroundColor: "#0f172a", // slate-900
            color: "#475569", // slate-600
            borderRight: "1px solid #1e293b", // slate-800
          },
        }),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const currentContent = update.state.doc.toString();
            onChangeRef.current(currentContent);
          }
        }),
        // Acessibilidade: Escape tira o foco do editor para liberar navegação por teclado
        keymap.of([
          {
            key: "Escape",
            run: (view) => {
              view.contentDOM.blur();
              return true;
            },
          },
        ]),
      ],
    });

    const view = new EditorView({
      state: startState,
      parent: containerRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Apenas monta uma única vez

  // Sincroniza alterações externas do prop 'value' (ex: botão Restaurar) com o documento interno do CodeMirror
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;

    const currentDocValue = view.state.doc.toString();
    if (value !== currentDocValue) {
      view.dispatch({
        changes: {
          from: 0,
          to: currentDocValue.length,
          insert: value,
        },
      });
    }
  }, [value]);

  return (
    <div
      ref={containerRef}
      className="w-full h-48 border border-slate-800 rounded overflow-hidden"
      role="textbox"
      aria-label="Editor de código"
    />
  );
};
export default CodeEditor;
