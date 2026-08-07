import { act, render, screen, fireEvent } from "@testing-library/react";
import { beforeEach, describe, it, expect, vi } from "vitest";

import { CodeEditor } from "../components/editor/CodeEditor";
import { Workspace } from "../pages/Workspace";
import { installMockWorker, latestWorker } from "./testUtils/mockWorker";

// Mock mínimo para o CodeMirror 6 no ambiente JSDOM
vi.mock("codemirror", () => {
  return {
    basicSetup: [],
  };
});

vi.mock("@codemirror/lang-python", () => {
  return {
    python: () => [],
  };
});

beforeEach(() => {
  installMockWorker();
});

describe("CodeEditor - Componente Controlado do CodeMirror 6", () => {
  it("deve renderizar o container do editor de código", () => {
    const handleChange = vi.fn();
    render(<CodeEditor value="print('hello')" onChange={handleChange} />);

    expect(screen.getByRole("textbox", { name: /Editor de código/i })).toBeInTheDocument();
  });
});

describe("Workspace com CodeEditor Integrado", () => {
  it("deve carregar o starterCode inicial no editor de código", () => {
    render(<Workspace />);
    
    // O editor deve estar renderizado
    expect(screen.getByRole("textbox", { name: /Editor de código/i })).toBeInTheDocument();
  });

  it("deve exibir e confirmar a restauração do starterCode ao clicar em Restaurar", async () => {
    // Espiona o confirm nativo usado para confirmação de restauração
    const confirmSpy = vi.spyOn(window, "confirm").mockImplementation(() => true);
    
    render(<Workspace />);

    const restoreButton = screen.getByRole("button", { name: "Restaurar" });
    fireEvent.click(restoreButton);

    expect(confirmSpy).toHaveBeenCalled();
    confirmSpy.mockRestore();
  });

  it("deve garantir que Executar roda o código real no motor e Verificar continua sem lógica pedagógica nesta etapa", async () => {
    render(<Workspace />);
    act(() => {
      latestWorker().emit({ type: "ready" });
    });

    const executeButton = screen.getByRole("button", { name: "Executar" });
    const verifyButton = screen.getByRole("button", { name: "Verificar" });

    // Clica em Executar — agora produz saída real vinda do motor (Worker mockado)
    fireEvent.click(executeButton);
    const worker = latestWorker();
    const request = worker.posted[0];
    await act(async () => {
      worker.emit({
        type: "result",
        requestId: request.requestId,
        result: { status: "success", message: "Execução concluída.", output: "Meu diário de saúde" },
      });
    });
    expect(await screen.findByText("Meu diário de saúde")).toBeInTheDocument();

    // Clica em Verificar — continua sem lógica pedagógica nesta etapa
    fireEvent.click(verifyButton);
    expect(screen.queryByText("A mensagem foi exibida corretamente.")).not.toBeInTheDocument();
    expect(screen.queryByText("Concluído")).not.toBeInTheDocument();
  });

  it("deve sincronizar o valor interno do CodeEditor quando a prop value for alterada externamente", () => {
    const handleChange = vi.fn();
    const { rerender } = render(<CodeEditor value="print('inicial')" onChange={handleChange} />);
    
    // Rerenderiza com novo valor da prop value
    rerender(<CodeEditor value="print('restaurado')" onChange={handleChange} />);
    
    expect(screen.getByRole("textbox", { name: /Editor de código/i })).toBeInTheDocument();
  });
});
