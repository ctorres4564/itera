import React from "react";

interface SidebarProps {
  currentUnitId: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentUnitId }) => {
  return (
    <nav className="p-4 md:p-6" aria-label="Navegação do curso">
      <div className="space-y-4">
        <div>
          <h2 className="heading-2 mb-2">
            Trilha 1 — Fundamentos de Programação
          </h2>
          <ul className="space-y-1">
            <li>
              <span
                className={`flex items-center px-3 py-2 text-sm font-medium rounded transition-colors ${
                  currentUnitId === "1.1-print"
                    ? "bg-surface-elevated text-brand-secondary font-semibold"
                    : "text-text-muted"
                }`}
                aria-current={currentUnitId === "1.1-print" ? "page" : undefined}
              >
                <span className="w-2 h-2 rounded-full bg-brand-primary mr-2" aria-hidden="true" />
                1.1 — print()
              </span>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
