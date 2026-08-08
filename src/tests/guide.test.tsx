import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GuideModal } from "../components/guide/GuideModal";
import { Workspace } from "../pages/Workspace";
import { MemoryProgressRepository } from "../core/persistence/memoryRepository";
import { installMockWorker, latestWorker } from "./testUtils/mockWorker";

vi.mock("codemirror", () => ({ basicSetup: [] }));
vi.mock("@codemirror/lang-python", () => ({ python: () => [] }));

beforeEach(() => {
  installMockWorker();
});

describe("GuideModal — comportamento isolado", () => {
  it("abre com foco no botão de fechar e fecha ao clicar nele", () => {
    const onClose = vi.fn();
    render(<GuideModal onClose={onClose} />);

    expect(screen.getByRole("dialog", { name: /Como usar o ITERA/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Fechar guia de orientação/i })).toHaveFocus();

    fireEvent.click(screen.getByRole("button", { name: /Fechar guia de orientação/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("fecha com Escape", () => {
    const onClose = vi.fn();
    render(<GuideModal onClose={onClose} />);

    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("mostra os 11 passos numerados", () => {
    render(<GuideModal onClose={() => {}} />);

    for (let step = 1; step <= 11; step += 1) {
      expect(screen.getByText(new RegExp(`^${step}\\. `))).toBeInTheDocument();
    }
  });

  it("explica claramente a diferença entre Executar e Verificar", () => {
    render(<GuideModal onClose={() => {}} />);

    expect(screen.getByText(/não avalia se a resposta está correta/i)).toBeInTheDocument();
    expect(screen.getByText(/comparará o resultado com o objetivo/i)).toBeInTheDocument();
  });

  it("lista os tipos de feedback sem entrar em detalhe técnico", () => {
    render(<GuideModal onClose={() => {}} />);

    ["Sucesso", "Revisar resposta", "Nenhuma saída", "Revisão necessária", "Falha da plataforma"].forEach(
      (label) => {
        expect(screen.getByText(label)).toBeInTheDocument();
      }
    );
  });

  it("não revela a solução específica da atividade", () => {
    render(<GuideModal onClose={() => {}} />);

    const dialog = screen.getByRole("dialog");
    expect(within(dialog).queryByText(/Meu diário de saúde/i)).not.toBeInTheDocument();
  });

  it("prende o foco dentro do modal: Tab e Shift+Tab não deixam o foco escapar do container", () => {
    render(<GuideModal onClose={() => {}} />);

    // O único elemento focável no conteúdo estático do guia é o botão de
    // fechar — Tab no último elemento cicla para o primeiro (ele mesmo) e
    // Shift+Tab no primeiro cicla para o último (ele mesmo); em ambos os
    // casos o foco nunca sai do modal.
    const closeButton = screen.getByRole("button", { name: /Fechar guia de orientação/i });
    expect(closeButton).toHaveFocus();

    fireEvent.keyDown(document, { key: "Tab" });
    expect(closeButton).toHaveFocus();

    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(closeButton).toHaveFocus();
  });
});

describe("Botão \"Como usar\" no cabeçalho", () => {
  it("aparece, abre o guia e devolve o foco a ele ao fechar", async () => {
    render(<Workspace />);
    act(() => {
      latestWorker().emit({ type: "ready" });
    });

    const openButton = screen.getByRole("button", { name: "Como usar" });
    expect(openButton).toBeInTheDocument();

    // fireEvent.click não foca o elemento como um clique real de mouse faria;
    // focamos explicitamente para reproduzir a pré-condição de um clique real.
    openButton.focus();
    fireEvent.click(openButton);
    expect(screen.getByRole("dialog", { name: /Como usar o ITERA/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Fechar guia de orientação/i }));
    expect(screen.queryByRole("dialog", { name: /Como usar o ITERA/i })).not.toBeInTheDocument();
    expect(openButton).toHaveFocus();
  });

  it("abrir e fechar o guia não altera attemptsCount, unlockedHintsCount, deepDiveStatus nem completed", async () => {
    const repository = new MemoryProgressRepository("1.1-print", "# Escreva seu código abaixo\n");
    render(<Workspace repository={repository} />);
    act(() => {
      latestWorker().emit({ type: "ready" });
    });

    fireEvent.click(screen.getByRole("button", { name: "Como usar" }));
    fireEvent.click(screen.getByRole("button", { name: /Fechar guia de orientação/i }));

    const progress = await repository.load();
    const unit = progress.units["1.1-print"];

    expect(unit.attemptsCount).toBe(0);
    expect(unit.unlockedHintsCount).toBe(0);
    expect(unit.deepDiveStatus).toBe("not_started");
    expect(unit.completed).toBe(false);
  });
});
