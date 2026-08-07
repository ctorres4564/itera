import type { ActivityResult } from "../../../core/domain/types";
import { normalizeOutput } from "./normalizeOutput";

const SUCCESS_MESSAGE = "A mensagem foi exibida corretamente.";
const INCORRECT_MESSAGE =
  "Seu programa executou, mas a mensagem exibida não corresponde ao objetivo.";
const NO_OUTPUT_MESSAGE =
  "O código foi executado, mas nenhuma mensagem foi exibida.";
const SYNTAX_ERROR_MESSAGE =
  "O Python não conseguiu interpretar o código. Verifique as aspas e os parênteses.";
const NAME_ERROR_MESSAGE =
  "O Python não reconheceu esse nome. A função deve ser escrita como print, com letras minúsculas.";
// A spec não define uma mensagem genérica de erro de execução fora do caso
// de nome incorreto (NameError) — mensagem preenchida no mesmo tom das demais.
const RUNTIME_ERROR_MESSAGE =
  "Seu código executou, mas ocorreu um erro durante a execução. Revise a mensagem técnica abaixo.";
const TIMEOUT_MESSAGE =
  "A execução ultrapassou o limite permitido e foi interrompida.";
// A spec não previa o status output_limit (adicionado na Etapa 7) — mensagem
// preenchida no mesmo tom da mensagem de timeout.
const OUTPUT_LIMIT_MESSAGE =
  "A saída excedeu o limite permitido e foi interrompida.";
const INTERNAL_ERROR_MESSAGE =
  "O ambiente de execução apresentou uma falha. Seu código foi preservado.";

function isNameError(result: ActivityResult): boolean {
  return (
    (result.technicalDetails ?? "").includes("NameError") ||
    result.message.includes("NameError")
  );
}

// Traduz o ActivityResult técnico (já produzido pelo motor) em um resultado
// pedagógico. Nunca reexecuta código — só compara/reclassifica o que já veio.
export function verifyActivityResult(
  technicalResult: ActivityResult,
  expectedOutput: string
): ActivityResult {
  switch (technicalResult.status) {
    case "success": {
      const matches =
        normalizeOutput(technicalResult.output ?? "") ===
        normalizeOutput(expectedOutput);
      return matches
        ? { ...technicalResult, status: "success", message: SUCCESS_MESSAGE }
        : {
            ...technicalResult,
            status: "incorrect",
            message: INCORRECT_MESSAGE,
          };
    }
    case "no_output":
      return { ...technicalResult, message: NO_OUTPUT_MESSAGE };
    case "syntax_error":
      return { ...technicalResult, message: SYNTAX_ERROR_MESSAGE };
    case "runtime_error":
      return {
        ...technicalResult,
        message: isNameError(technicalResult)
          ? NAME_ERROR_MESSAGE
          : RUNTIME_ERROR_MESSAGE,
      };
    case "timeout":
      return { ...technicalResult, message: TIMEOUT_MESSAGE };
    case "output_limit":
      return { ...technicalResult, message: OUTPUT_LIMIT_MESSAGE };
    case "internal_error":
      return { ...technicalResult, message: INTERNAL_ERROR_MESSAGE };
    default:
      return technicalResult;
  }
}
