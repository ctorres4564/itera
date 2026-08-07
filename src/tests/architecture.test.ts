import { describe, expect, it } from "vitest";

describe("Arquitetura — acesso a localStorage", () => {
  it("nenhum componente React (src/components, src/pages) acessa localStorage diretamente", () => {
    const files = {
      ...import.meta.glob("../components/**/*.{ts,tsx}", {
        query: "?raw",
        import: "default",
        eager: true,
      }),
      ...import.meta.glob("../pages/**/*.{ts,tsx}", {
        query: "?raw",
        import: "default",
        eager: true,
      }),
    } as Record<string, string>;

    const entries = Object.entries(files);
    expect(entries.length).toBeGreaterThan(0);

    // Detecta uso real da API (localStorage.getItem/setItem/... ou acesso via
    // colchetes), não apenas menções textuais em comentários/nomes de import.
    const localStorageUsagePattern = /\blocalStorage\s*[.[]/;
    const offenders = entries
      .filter(([, content]) => localStorageUsagePattern.test(content))
      .map(([path]) => path);

    expect(offenders).toEqual([]);
  });
});
