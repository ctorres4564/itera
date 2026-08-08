/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Marca
        "brand-primary": "#6366F1",
        "brand-primary-hover": "#818CF8",
        "brand-secondary": "#8B5CF6",
        accent: "#7DD3FC",
        // Fundos
        background: "#020617",
        surface: "#0F172A",
        "surface-elevated": "#1E293B",
        "surface-muted": "rgba(2,6,23,0.6)",
        // Texto
        "text-primary": "#F1F5F9",
        "text-secondary": "#CBD5E1",
        "text-muted": "#94A3B8",
        "text-inverse": "#FFFFFF",
        // Bordas
        "border-default": "#1E293B",
        "border-strong": "#475569",
        // Estados
        success: "#6EE7B7",
        "success-surface": "rgba(2,44,34,0.3)",
        warning: "#FCD34D",
        "warning-surface": "rgba(69,26,3,0.2)",
        error: "#FCA5A5",
        "error-surface": "rgba(69,10,10,0.2)",
        info: "#7DD3FC",
        focus: "#6366F1",
        // Ação destrutiva sólida (exclusivo — não usar para texto/superfície de feedback)
        "danger-solid": "#DC2626",
        "danger-solid-hover": "#EF4444",
      },
      boxShadow: {
        modal: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
      },
    },
  },
  plugins: [],
}

