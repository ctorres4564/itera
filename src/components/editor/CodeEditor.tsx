import React, { useEffect, useRef } from "react";
import { EditorState, Prec } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { python } from "@codemirror/lang-python";
import { tags } from "@lezer/highlight";
import { basicSetup } from "codemirror";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
}

// O destaque de sintaxe padrão do CodeMirror foi pensado para fundo claro e
// fica com contraste ruim sobre o tema escuro do app (ex.: "print" saía num
// vermelho apagado, quase ilegível). Cores próprias, todas com contraste
// AA sobre o fundo #020617.
const pythonHighlightStyle = HighlightStyle.define([
  { tag: [tags.keyword, tags.controlKeyword, tags.operatorKeyword, tags.self], color: "#a5b4fc" }, // indigo-300
  { tag: [tags.string, tags.special(tags.string)], color: "#86efac" }, // green-300
  { tag: [tags.number, tags.bool, tags.null], color: "#fbbf24" }, // amber-400
  { tag: tags.comment, color: "#94a3b8", fontStyle: "italic" }, // slate-400
  { tag: [tags.function(tags.variableName), tags.function(tags.definition(tags.variableName)), tags.className], color: "#7dd3fc" }, // sky-300
  { tag: [tags.variableName, tags.definition(tags.variableName)], color: "#e2e8f0" }, // slate-200
  { tag: tags.propertyName, color: "#f0abfc" }, // fuchsia-300
  { tag: [tags.operator, tags.punctuation, tags.bracket], color: "#cbd5e1" }, // slate-300
]);

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
            color: "#94a3b8", // slate-400 (contraste AA sobre slate-900)
            borderRight: "1px solid #1e293b", // slate-800
          },
          // O overlay padrão de linha ativa é claro (pensado para tema claro)
          // e cria uma faixa acinzentada de baixo contraste sobre o fundo escuro.
          ".cm-activeLine": {
            backgroundColor: "rgba(99, 102, 241, 0.08)", // indigo-500 bem sutil
          },
          ".cm-activeLineGutter": {
            backgroundColor: "rgba(99, 102, 241, 0.12)",
            color: "#cbd5e1", // slate-300
          },
        }),
        Prec.highest(syntaxHighlighting(pythonHighlightStyle)),
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
