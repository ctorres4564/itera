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

describe("Arquitetura — desafios conceituais são autocontidos", () => {
  it("ConceptChallenge.tsx não importa motor Python, Worker, verificador ou persistência de progresso", () => {
    const files = import.meta.glob("../components/deep-dive/ConceptChallenge.tsx", {
      query: "?raw",
      import: "default",
      eager: true,
    }) as Record<string, string>;

    const [content] = Object.values(files);
    expect(content).toBeTruthy();

    const forbiddenPatterns = [
      /pyodide/i,
      /\/worker\//,
      /CodeActivityEngine/,
      /OutputVerifier/,
      /ProgressRepository/,
    ];
    forbiddenPatterns.forEach((pattern) => {
      expect(content).not.toMatch(pattern);
    });
  });
});
