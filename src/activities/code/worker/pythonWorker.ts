import {
  loadPyodide,
  type PyodideInterface,
} from "https://cdn.jsdelivr.net/pyodide/v314.0.3/full/pyodide.mjs";
import type { ActivityResult } from "../../../core/domain/types";
import type { WorkerRequest, WorkerResponse } from "./protocol";

const PYODIDE_INDEX_URL = "https://cdn.jsdelivr.net/pyodide/v314.0.3/full/";

// Redireciona sys.stdout para um writer que interrompe a execução do aluno
// assim que o limite de caracteres é ultrapassado, em vez de só truncar no final.
const RUNNER_PY_SOURCE = `
import sys
import json

class _OutputLimitExceeded(Exception):
    pass

class _LimitedWriter:
    def __init__(self, limit):
        self.limit = limit
        self.chunks = []
        self.length = 0

    def write(self, s):
        remaining = self.limit - self.length
        if remaining <= 0:
            raise _OutputLimitExceeded()
        if len(s) > remaining:
            self.chunks.append(s[:remaining])
            self.length = self.limit
            raise _OutputLimitExceeded()
        self.chunks.append(s)
        self.length += len(s)
        return len(s)

    def flush(self):
        pass

    def getvalue(self):
        return "".join(self.chunks)


def _run_user_code(code, max_output_characters):
    writer = _LimitedWriter(max_output_characters)
    original_stdout = sys.stdout
    sys.stdout = writer
    try:
        try:
            compiled = compile(code, "<string>", "exec")
        except SyntaxError as error:
            return json.dumps({
                "status": "syntax_error",
                "message": str(error),
                "output": writer.getvalue(),
            })
        try:
            exec(compiled, {"__name__": "__main__"})
        except _OutputLimitExceeded:
            return json.dumps({
                "status": "output_limit",
                "message": "A saída excedeu o limite de %d caracteres." % max_output_characters,
                "output": writer.getvalue(),
            })
        except Exception as error:
            return json.dumps({
                "status": "runtime_error",
                "message": str(error),
                "output": writer.getvalue(),
            })
        output = writer.getvalue()
        if output == "":
            return json.dumps({
                "status": "no_output",
                "message": "O código não produziu nenhuma saída.",
                "output": output,
            })
        return json.dumps({
            "status": "success",
            "message": "Execução concluída.",
            "output": output,
        })
    finally:
        sys.stdout = original_stdout
`;

function postResponse(response: WorkerResponse): void {
  self.postMessage(response);
}

async function initPyodide(): Promise<PyodideInterface> {
  const pyodide = await loadPyodide({ indexURL: PYODIDE_INDEX_URL });
  pyodide.runPython(RUNNER_PY_SOURCE);
  return pyodide;
}

const pyodideReadyPromise: Promise<PyodideInterface | null> = initPyodide()
  .then((pyodide) => {
    postResponse({ type: "ready" });
    return pyodide;
  })
  .catch((error: unknown) => {
    postResponse({
      type: "load_error",
      message: error instanceof Error ? error.message : String(error),
    });
    return null;
  });

self.onmessage = async (event: MessageEvent) => {
  const request = event.data as WorkerRequest;
  if (request.type !== "run") return;

  try {
    const pyodide = await pyodideReadyPromise;
    if (!pyodide) {
      throw new Error("Pyodide não está disponível.");
    }
    pyodide.globals.set("__student_code__", request.code);
    pyodide.globals.set("__max_output__", request.maxOutputCharacters);
    const resultJson = pyodide.runPython(
      "_run_user_code(__student_code__, __max_output__)"
    ) as string;
    const result = JSON.parse(resultJson) as ActivityResult;
    postResponse({ type: "result", requestId: request.requestId, result });
  } catch (error) {
    postResponse({
      type: "result",
      requestId: request.requestId,
      result: {
        status: "internal_error",
        message: "Falha interna ao executar o código.",
        technicalDetails:
          error instanceof Error ? error.message : String(error),
      },
    });
  }
};
