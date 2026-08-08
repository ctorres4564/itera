/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Marca — violeta profundo, identidade autoral do ITERA
        "brand-primary": "#7C3AED",
        "brand-primary-hover": "#6D28D9",
        "brand-secondary": "#A78BFA",
        accent: "#F472B6",
        // Fundos
        background: "#0B0714",
        surface: "#151022",
        "surface-elevated": "#21182F",
        "surface-muted": "#100B1B",
        // Texto
        "text-primary": "#F8F7FC",
        "text-secondary": "#D7D0E3",
        "text-muted": "#9F95B0",
        "text-inverse": "#FFFFFF",
        // Bordas
        "border-default": "#302541",
        "border-strong": "#55436D",
        // Estados (independentes da marca — não usar violeta aqui)
        success: "#6EE7B7",
        "success-surface": "#0D2A23",
        warning: "#FCD34D",
        "warning-surface": "#33260A",
        error: "#FCA5A5",
        "error-surface": "#351010",
        info: "#C4B5FD",
        focus: "#A78BFA",
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

