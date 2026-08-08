import React from "react";

export const EditorToolbar: React.FC = () => {
  return (
    <div className="bg-surface px-4 py-3 border-b border-border-default flex items-center justify-between">
      <span className="text-xs font-bold text-text-muted tracking-wider">Editor de Código</span>
      <span className="text-xs text-text-muted">Python</span>
    </div>
  );
};
export default EditorToolbar;
