declare module "https://cdn.jsdelivr.net/pyodide/v314.0.3/full/pyodide.mjs" {
  export interface PyodideInterface {
    runPython(code: string): unknown;
    globals: {
      set(name: string, value: unknown): void;
      get(name: string): unknown;
    };
  }

  export function loadPyodide(options?: {
    indexURL?: string;
  }): Promise<PyodideInterface>;
}
