import React from "react";

interface MainLayoutProps {
  header: React.ReactNode;
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ header, sidebar, children }) => {
  return (
    <div className="min-h-screen bg-surface text-text-primary flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-border-default bg-background/80 backdrop-blur sticky top-0 z-50">
        {header}
      </header>

      <div className="flex flex-1 flex-col md:flex-row">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 border-r border-border-default bg-background/40 flex-shrink-0">
          {sidebar}
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};
