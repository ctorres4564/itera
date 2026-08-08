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
// AA sobre o fundo do editor (#100B1B, token surface-muted).
//
// Paleta independente do Design System da marca (docs/design-system.md):
// segue convenção própria de destaque de sintaxe de código (como um tema de
// editor), não os tokens de marca — nenhuma dessas cores deve ser lida como
// dependente de `accent`/`brand-*`, mesmo que algum valor coincida.
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
        // CodeMirror exige valores literais aqui (não aceita classe Tailwind) —
        // os hex abaixo são exatamente os valores dos tokens do Design System
        // (docs/design-system.md). Se um token mudar de valor lá, atualizar aqui também.
        // O editor é uma área recuada/secundária da interface (não o fundo
        // principal da aplicação) — por isso usa `surface-muted`, não `background`.
        EditorView.theme({
          "&": {
            height: "100%",
            backgroundColor: "#100B1B", // token surface-muted
            color: "#D7D0E3", // token text-secondary
            fontSize: "14px",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
          },
          // `brand-primary-hover` (#6D28D9) fica escuro demais para servir de
          // indicador visível sobre o fundo recuado do editor (< 3:1) — usa-se
          // `brand-secondary` aqui, mesma regra de fallback dos textos pequenos
          // de marca (ver docs/design-system.md).
          ".cm-content": {
            caretColor: "#A78BFA", // token brand-secondary
          },
          // basicSetup usa drawSelection(), que desenha seu próprio cursor em
          // vez do caret nativo — por padrão com borda preta, invisível sobre
          // o fundo escuro. Precisa ser sobrescrito à parte do caretColor acima.
          ".cm-cursor, .cm-cursor-primary": {
            borderLeftColor: "#A78BFA", // token brand-secondary
            borderLeftWidth: "2px",
          },
          // Também via drawSelection(): destaque de seleção de texto, tingido
          // com a cor de marca em baixa opacidade.
          "&.cm-focused .cm-selectionBackground, .cm-selectionBackground": {
            backgroundColor: "rgba(124, 58, 237, 0.35)", // token brand-primary
          },
          "&.cm-focused": {
            outline: "2px solid #A78BFA", // token focus
            outlineOffset: "-2px",
          },
          ".cm-gutters": {
            backgroundColor: "#151022", // token surface
            color: "#9F95B0", // token text-muted (contraste AA sobre a surface)
            borderRight: "1px solid #302541", // token border-default
          },
          // O overlay padrão de linha ativa é claro (pensado para tema claro)
          // e cria uma faixa acinzentada de baixo contraste sobre o fundo escuro.
          ".cm-activeLine": {
            backgroundColor: "rgba(124, 58, 237, 0.08)", // token brand-primary, bem sutil
          },
          ".cm-activeLineGutter": {
            backgroundColor: "rgba(124, 58, 237, 0.12)", // token brand-primary
            color: "#D7D0E3", // token text-secondary
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
      className="w-full h-48 border border-border-default rounded overflow-hidden"
      role="textbox"
      aria-label="Editor de código"
    />
  );
};
export default CodeEditor;
