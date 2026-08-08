import { act, render, screen, fireEvent } from "@testing-library/react";
import { beforeEach, describe, it, expect, vi } from "vitest";
import { Workspace } from "../pages/Workspace";
import { installMockWorker, latestWorker } from "./testUtils/mockWorker";

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

describe("Workspace - Interface da Unidade Pedagógica", () => {
  it("deve renderizar elementos essenciais da unidade (cabeçalho, barra de progresso, sidebar, objetivo e conteudo essencial)", () => {
    render(<Workspace />);

    // Header & Sidebar
    expect(screen.getByText("ITERA")).toBeInTheDocument();
    expect(screen.getByText("Python para iniciantes")).toBeInTheDocument();
    expect(screen.getByText("1.1 — print()")).toBeInTheDocument();

    // Objetivos e Conteúdos
    expect(screen.getByText("Exibindo mensagens com print()")).toBeInTheDocument();
    expect(screen.getByText('Exibir a mensagem "Meu diário de saúde" no painel de saída')).toBeInTheDocument();
  });

  it("deve liberar dicas graduais de forma controlada através da lógica de clique", () => {
    render(<Workspace />);

    const hintButton = screen.getByRole("button", { name: /Dica \(/i });
    expect(hintButton).toBeInTheDocument();

    // Nenhum item de dica inicialmente visível
    expect(screen.queryByText("Use uma função que exibe informações.")).not.toBeInTheDocument();

    // Primeira dica
    fireEvent.click(hintButton);
    expect(screen.getByText("Use uma função que exibe informações.")).toBeInTheDocument();
    expect(screen.queryByText("A função se chama print.")).not.toBeInTheDocument();

    // Segunda dica
    fireEvent.click(hintButton);
    expect(screen.getByText("Use uma função que exibe informações.")).toBeInTheDocument();
    expect(screen.getByText("A função se chama print.")).toBeInTheDocument();
  });

  it("deve abrir e fechar a gaveta lateral de aprofundamento opcional", () => {
    render(<Workspace />);

    const openButton = screen.getByRole("button", { name: /Quero me aprofundar/i });
    expect(openButton).toBeInTheDocument();

    // Gaveta fechada inicialmente
    expect(screen.queryByText("Aprofundamento Opcional")).not.toBeInTheDocument();

    // Clica para abrir
    fireEvent.click(openButton);
    expect(screen.getByText("Aprofundamento Opcional")).toBeInTheDocument();
    expect(screen.getByText("A exibição de mensagens textual (chamada de output ou saída de dados) é um dos recursos mais antigos do desenvolvimento de software. Computadores usam saídas na tela para que os desenvolvedores consigam entender o fluxo de execução e usuários interajam com o sistema de forma clara.")).toBeInTheDocument();

    // Clica para fechar
    const closeButton = screen.getByRole("button", { name: /Fechar aprofundamento/i });
    fireEvent.click(closeButton);
    expect(screen.queryByText("Aprofundamento Opcional")).not.toBeInTheDocument();
  });

  it("deve renderizar a área de prática com editor, painéis de saída, dicas e botões de ação", () => {
    render(<Workspace />);
    act(() => {
      latestWorker().emit({ type: "ready" });
    });

    expect(screen.getByRole("textbox", { name: /Editor de código/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Executar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Verificar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Restaurar" })).toBeInTheDocument();

    // Painel de saída
    expect(screen.getByText("Painel de Saída:")).toBeInTheDocument();
  });

  it("mantém o botão Executar desabilitado enquanto o motor Python está carregando", () => {
    render(<Workspace />);

    const executeButton = screen.getByRole("button", { name: /Carregando motor Python/i });
    expect(executeButton).toBeDisabled();
  });

  it("deve executar o código real no motor (Worker/Pyodide) e exibir a saída retornada", async () => {
    render(<Workspace />);
    act(() => {
      latestWorker().emit({ type: "ready" });
    });

    const executeButton = screen.getByRole("button", { name: "Executar" });
    fireEvent.click(executeButton);

    const worker = latestWorker();
    const request = worker.posted[0];
    expect(request.type).toBe("run");

    await act(async () => {
      worker.emit({
        type: "result",
        requestId: request.requestId,
        result: {
          status: "success",
          message: "Execução concluída.",
          output: "Meu diário de saúde",
        },
      });
    });

    expect(await screen.findByText("Meu diário de saúde")).toBeInTheDocument();
    // Executar não marca conclusão nem simula sucesso pedagógico
    expect(screen.queryByText("Concluído")).not.toBeInTheDocument();
  });

  it("preserva o código do editor quando a execução retorna um erro técnico", async () => {
    render(<Workspace />);
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
        result: { status: "runtime_error", message: "Erro em tempo de execução.", output: "" },
      });
    });

    // O editor continua presente e utilizável — nenhuma falha técnica apaga o código do aluno
    expect(screen.getByRole("textbox", { name: /Editor de código/i })).toBeInTheDocument();
    expect(await screen.findByText("Erro em tempo de execução.")).toBeInTheDocument();
  });

  it("mantém o botão Verificar desabilitado antes da primeira execução", () => {
    render(<Workspace />);
    act(() => {
      latestWorker().emit({ type: "ready" });
    });

    expect(screen.getByRole("button", { name: "Verificar" })).toBeDisabled();
  });

  it("ao verificar uma saída correta, registra a tentativa, conclui a unidade e não reexecuta o código", async () => {
    render(<Workspace />);
    act(() => {
      latestWorker().emit({ type: "ready" });
    });

    fireEvent.click(screen.getByRole("button", { name: "Executar" }));
    const worker = latestWorker();
    const runRequest = worker.posted[0];
    await act(async () => {
      worker.emit({
        type: "result",
        requestId: runRequest.requestId,
        result: { status: "success", message: "Execução concluída.", output: "Meu diário de saúde" },
      });
    });

    expect(screen.getByRole("button", { name: "Verificar" })).toBeEnabled();
    fireEvent.click(screen.getByRole("button", { name: "Verificar" }));

    expect(await screen.findByText("A mensagem foi exibida corretamente.")).toBeInTheDocument();
    expect(screen.getByText("Concluído")).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");

    // Verificar não reexecuta: nenhuma nova mensagem "run" foi postada ao worker
    expect(worker.posted).toHaveLength(1);
  });

  it("ao verificar uma saída incorreta, registra a tentativa sem concluir a unidade", async () => {
    render(<Workspace />);
    act(() => {
      latestWorker().emit({ type: "ready" });
    });

    fireEvent.click(screen.getByRole("button", { name: "Executar" }));
    const worker = latestWorker();
    const runRequest = worker.posted[0];
    await act(async () => {
      worker.emit({
        type: "result",
        requestId: runRequest.requestId,
        result: { status: "success", message: "Execução concluída.", output: "mensagem errada" },
      });
    });

    fireEvent.click(screen.getByRole("button", { name: "Verificar" }));

    expect(
      await screen.findByText("Seu programa executou, mas a mensagem exibida não corresponde ao objetivo.")
    ).toBeInTheDocument();
    expect(screen.queryByText("Concluído")).not.toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
  });
});
