import { act, render, screen, fireEvent } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Workspace } from "../pages/Workspace";
import { installMockWorker, latestWorker } from "./testUtils/mockWorker";

vi.mock("codemirror", () => ({ basicSetup: [] }));
vi.mock("@codemirror/lang-python", () => ({ python: () => [] }));

beforeEach(() => {
  installMockWorker();
});

async function executeAndVerifySuccessfully() {
  act(() => {
    latestWorker().emit({ type: "ready" });
  });

  fireEvent.click(screen.getByRole("button", { name: "Executar" }));
  const worker = latestWorker();
  const request = worker.posted[0];
  await act(async () => {
    worker.emit({
      type: "result",
      requestId: request.requestId,
      result: { status: "success", message: "Execução concluída.", output: "Meu diário de saúde" },
    });
  });

  fireEvent.click(screen.getByRole("button", { name: "Verificar" }));
  await screen.findByText("Concluído");
}

describe("Persistência local (LocalStorageProgressRepository real via Workspace)", () => {
  it("carrega o progresso inicial (starterCode, nada concluído) quando não há nada persistido", async () => {
    const { unmount } = render(<Workspace />);
    act(() => {
      latestWorker().emit({ type: "ready" });
    });

    expect(screen.getByRole("button", { name: "Verificar" })).toBeDisabled();
    expect(screen.queryByText("Concluído")).not.toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
    unmount();
  });

  it("preserva progresso e conclusão entre um unmount/remount (equivalente a fechar e reabrir o navegador)", async () => {
    const { unmount } = render(<Workspace />);
    await executeAndVerifySuccessfully();
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
    unmount();

    render(<Workspace />);
    expect(await screen.findByText("Concluído")).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
  });

  it("reiniciar progresso limpa a persistência: um remount seguinte volta ao estado inicial", async () => {
    const confirmSpy = vi.spyOn(window, "confirm").mockImplementation(() => true);

    const { unmount } = render(<Workspace />);
    await executeAndVerifySuccessfully();

    fireEvent.click(screen.getByRole("button", { name: "Restaurar" }));
    confirmSpy.mockRestore();
    unmount();

    render(<Workspace />);
    act(() => {
      latestWorker().emit({ type: "ready" });
    });
    expect(screen.queryByText("Concluído")).not.toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
  });
});
