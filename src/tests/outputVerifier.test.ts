import { describe, it, expect } from "vitest";
import { normalizeOutput } from "../activities/code/verifier/normalizeOutput";
import { verifyActivityResult } from "../activities/code/verifier/OutputVerifier";
import type { ActivityResult } from "../core/domain/types";

function technical(overrides: Partial<ActivityResult>): ActivityResult {
  return {
    status: "success",
    message: "Execução concluída.",
    output: "",
    ...overrides,
  };
}

describe("normalizeOutput", () => {
  it("remove espaços/tabs finais de cada linha", () => {
    expect(normalizeOutput("Meu diário de saúde   \n")).toBe(
      "Meu diário de saúde"
    );
  });

  it("normaliza CRLF e CR isolado para LF", () => {
    expect(normalizeOutput("linha 1\r\nlinha 2\rlinha 3")).toBe(
      "linha 1\nlinha 2\nlinha 3"
    );
  });

  it("remove linhas vazias no final da string", () => {
    expect(normalizeOutput("Meu diário de saúde\n\n\n")).toBe(
      "Meu diário de saúde"
    );
  });

  it("preserva espaços internos e conteúdo significativo", () => {
    expect(normalizeOutput("Meu   diário   de saúde")).toBe(
      "Meu   diário   de saúde"
    );
  });

  it("preserva linhas vazias no meio do texto", () => {
    expect(normalizeOutput("linha 1\n\nlinha 2\n")).toBe("linha 1\n\nlinha 2");
  });
});

describe("verifyActivityResult", () => {
  const expectedOutput = "Meu diário de saúde";

  it("mapeia saída correta para success", () => {
    const result = verifyActivityResult(
      technical({ status: "success", output: "Meu diário de saúde\n" }),
      expectedOutput
    );
    expect(result.status).toBe("success");
    expect(result.message).toBe("A mensagem foi exibida corretamente.");
  });

  it("mapeia saída incorreta para incorrect", () => {
    const result = verifyActivityResult(
      technical({ status: "success", output: "mensagem errada\n" }),
      expectedOutput
    );
    expect(result.status).toBe("incorrect");
    expect(result.message).toBe(
      "Seu programa executou, mas a mensagem exibida não corresponde ao objetivo."
    );
  });

  it("mapeia no_output preservando o status técnico", () => {
    const result = verifyActivityResult(
      technical({ status: "no_output", output: "" }),
      expectedOutput
    );
    expect(result.status).toBe("no_output");
    expect(result.message).toBe(
      "O código foi executado, mas nenhuma mensagem foi exibida."
    );
  });

  it("mapeia syntax_error", () => {
    const result = verifyActivityResult(
      technical({ status: "syntax_error", message: "SyntaxError" }),
      expectedOutput
    );
    expect(result.status).toBe("syntax_error");
    expect(result.message).toBe(
      "O Python não conseguiu interpretar o código. Verifique as aspas e os parênteses."
    );
  });

  it("mapeia runtime_error genérico", () => {
    const result = verifyActivityResult(
      technical({
        status: "runtime_error",
        message: "ZeroDivisionError: division by zero",
      }),
      expectedOutput
    );
    expect(result.status).toBe("runtime_error");
    expect(result.message).toBe(
      "Seu código executou, mas ocorreu um erro durante a execução. Revise a mensagem técnica abaixo."
    );
  });

  it("mapeia runtime_error com NameError para a mensagem de nome incorreto", () => {
    const result = verifyActivityResult(
      technical({
        status: "runtime_error",
        message: "NameError: name 'Print' is not defined",
      }),
      expectedOutput
    );
    expect(result.status).toBe("runtime_error");
    expect(result.message).toBe(
      "O Python não reconheceu esse nome. A função deve ser escrita como print, com letras minúsculas."
    );
  });

  it("detecta NameError também via technicalDetails", () => {
    const result = verifyActivityResult(
      technical({
        status: "runtime_error",
        message: "Erro em tempo de execução.",
        technicalDetails: "NameError: name 'Print' is not defined",
      }),
      expectedOutput
    );
    expect(result.message).toBe(
      "O Python não reconheceu esse nome. A função deve ser escrita como print, com letras minúsculas."
    );
  });

  it("mapeia timeout", () => {
    const result = verifyActivityResult(
      technical({ status: "timeout" }),
      expectedOutput
    );
    expect(result.status).toBe("timeout");
    expect(result.message).toBe(
      "A execução ultrapassou o limite permitido e foi interrompida."
    );
  });

  it("mapeia output_limit", () => {
    const result = verifyActivityResult(
      technical({ status: "output_limit", output: "x".repeat(5000) }),
      expectedOutput
    );
    expect(result.status).toBe("output_limit");
    expect(result.message).toBe(
      "A saída excedeu o limite permitido e foi interrompida."
    );
  });

  it("mapeia internal_error", () => {
    const result = verifyActivityResult(
      technical({ status: "internal_error" }),
      expectedOutput
    );
    expect(result.status).toBe("internal_error");
    expect(result.message).toBe(
      "O ambiente de execução apresentou uma falha. Seu código foi preservado."
    );
  });

  it("aceita soluções alternativas com o mesmo comportamento (CRLF e linha em branco extra no final)", () => {
    const result = verifyActivityResult(
      technical({ status: "success", output: "Meu diário de saúde  \r\n\n" }),
      expectedOutput
    );
    expect(result.status).toBe("success");
  });
});
