import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ConceptChallenge } from "../components/deep-dive/ConceptChallenge";
import { DeepDivePanel } from "../components/deep-dive/DeepDivePanel";
import type { ConceptualChallenge } from "../core/domain/types";
import { unitSchema } from "../schemas/curriculum";
import unitData from "../content/courses/python-iniciante/units/1.1-print.json";

const unit = unitSchema.parse(unitData);

describe("DeepDivePanel — desafios conceituais da Unidade 1.1 (conteúdo real)", () => {
  it("mostra os 3 desafios em ordem, cada um com 4 alternativas", () => {
    render(<DeepDivePanel deepDive={unit.deepDive} onClose={() => {}} />);

    expect(screen.getByText(/1\. Reconheça o código correto/)).toBeInTheDocument();
    expect(screen.getByText(/2\. Encontre o erro/)).toBeInTheDocument();
    expect(screen.getByText(/3\. Qual código produz exatamente esta saída\?/)).toBeInTheDocument();

    [0, 1, 2].forEach((index) => {
      const card = screen.getByTestId(`concept-challenge-${index}`);
      expect(within(card).getAllByRole("button", { name: /^[A-D]\)/ })).toHaveLength(4);
    });
  });

  it("desafio 3 mostra a saída desejada em exatamente 2 linhas", () => {
    render(<DeepDivePanel deepDive={unit.deepDive} onClose={() => {}} />);

    const expectedOutput = unit.deepDive.conceptualChallenges[2]?.expectedOutputDisplay ?? "";
    expect(expectedOutput.split("\n")).toHaveLength(2);

    const card = screen.getByTestId("concept-challenge-2");
    expect(within(card).getByText("Saída desejada")).toBeInTheDocument();
  });

  it("no desafio 3, a alternativa B (índice 1) é a reconhecida como correta", () => {
    render(<DeepDivePanel deepDive={unit.deepDive} onClose={() => {}} />);

    const card = screen.getByTestId("concept-challenge-2");
    fireEvent.click(within(card).getByRole("button", { name: /^B\)/ }));

    expect(within(card).getByText("Correto!")).toBeInTheDocument();
  });
});

describe("ConceptChallenge — comportamento genérico (fixture isolada)", () => {
  const fixtureChallenge: ConceptualChallenge = {
    title: "Desafio de teste",
    question: "Qual é a resposta certa?",
    options: ["Errada 1", "Certa", "Errada 2", "Errada 3"],
    optionsAreCode: false,
    correctOptionIndex: 1,
    feedback: "Explicação de por que a certa é a certa.",
  };

  it("mostra feedback de acerto ao selecionar a opção correta", () => {
    render(<ConceptChallenge challenge={fixtureChallenge} index={0} />);

    fireEvent.click(screen.getByRole("button", { name: /^B\)/ }));

    expect(screen.getByText("Correto!")).toBeInTheDocument();
    expect(screen.getByText(fixtureChallenge.feedback)).toBeInTheDocument();
  });

  it("mostra feedback de erro ao selecionar uma opção incorreta", () => {
    render(<ConceptChallenge challenge={fixtureChallenge} index={0} />);

    fireEvent.click(screen.getByRole("button", { name: /^A\)/ }));

    expect(screen.getByText("Incorreto")).toBeInTheDocument();
  });

  it('"Tentar novamente" reseta a seleção e permite responder de novo', () => {
    render(<ConceptChallenge challenge={fixtureChallenge} index={0} />);

    fireEvent.click(screen.getByRole("button", { name: /^A\)/ }));
    expect(screen.getByText("Incorreto")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Tentar novamente" }));
    expect(screen.queryByText("Incorreto")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /^B\)/ }));
    expect(screen.getByText("Correto!")).toBeInTheDocument();
  });

  it("mostra a explicação depois de responder, quando o desafio tiver uma", () => {
    const withExplanation: ConceptualChallenge = {
      ...fixtureChallenge,
      explanation: 'print("Bom dia")',
    };
    render(<ConceptChallenge challenge={withExplanation} index={0} />);

    fireEvent.click(screen.getByRole("button", { name: /^A\)/ }));

    expect(screen.getByText('print("Bom dia")')).toBeInTheDocument();
  });
});
