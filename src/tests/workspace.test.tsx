import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Workspace } from "../pages/Workspace";

describe("Workspace - Interface da Unidade Pedagógica", () => {
  it("deve renderizar elementos essenciais da unidade (cabeçalho, barra de progresso, sidebar, objetivo e conteudo essencial)", () => {
    render(<Workspace />);

    // Header & Sidebar
    expect(screen.getByText("ITERA")).toBeInTheDocument();
    expect(screen.getByText("Python para iniciantes")).toBeInTheDocument();
    expect(screen.getByText("1.1 — print()")).toBeInTheDocument();

    // Objetivos e Conteúdos
    expect(screen.getByText("Exibindo mensagens com print()")).toBeInTheDocument();
    expect(screen.getByText("Exibir uma mensagem no painel de saída")).toBeInTheDocument();
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

    expect(screen.getByRole("textbox", { name: /Editor de código/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Executar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Verificar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Restaurar" })).toBeInTheDocument();

    // Painel de saída
    expect(screen.getByText("Painel de Saída:")).toBeInTheDocument();
  });

  it("deve garantir que clicar em Executar não produz saída simulada", () => {
    render(<Workspace />);
    const executeButton = screen.getByRole("button", { name: "Executar" });
    fireEvent.click(executeButton);

    // Deve continuar exibindo a mensagem inicial e não a saída simulada anterior
    expect(screen.queryByText("Meu diário de saúde")).not.toBeInTheDocument();
    expect(screen.getByText("(Aguardando execução...)")).toBeInTheDocument();
  });

  it("deve garantir que clicar em Verificar não registra tentativa e não conclui a unidade", () => {
    render(<Workspace />);
    const verifyButton = screen.getByRole("button", { name: "Verificar" });
    fireEvent.click(verifyButton);

    // Não deve registrar progresso simulado ou marcar como concluído
    expect(screen.queryByText("A mensagem foi exibida corretamente.")).not.toBeInTheDocument();
    expect(screen.queryByText("Concluído")).not.toBeInTheDocument();
  });
});
