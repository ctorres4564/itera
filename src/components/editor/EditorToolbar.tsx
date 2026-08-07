import React from "react";

export const EditorToolbar: React.FC = () => {
  return (
    <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
      <span className="text-xs font-bold text-slate-400 tracking-wider">Editor de Código</span>
      <span className="text-xs text-slate-500">Python</span>
    </div>
  );
};
export default EditorToolbar;
