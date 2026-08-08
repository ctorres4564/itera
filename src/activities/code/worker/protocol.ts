import type { ActivityResult } from "../../../core/domain/types";

export type EngineStatus = "loading" | "ready" | "error";

export interface WorkerRunRequest {
  type: "run";
  requestId: string;
  code: string;
  maxOutputCharacters: number;
}

export type WorkerRequest = WorkerRunRequest;

export interface WorkerReadyMessage {
  type: "ready";
}

export interface WorkerResultMessage {
  type: "result";
  requestId: string;
  result: ActivityResult;
}

export interface WorkerLoadErrorMessage {
  type: "load_error";
  message: string;
}

export type WorkerResponse =
  | WorkerReadyMessage
  | WorkerResultMessage
  | WorkerLoadErrorMessage;

const ACTIVITY_RESULT_STATUSES = new Set([
  "success",
  "incorrect",
  "syntax_error",
  "runtime_error",
  "timeout",
  "no_output",
  "output_limit",
  "internal_error",
]);

function isActivityResult(value: unknown): value is ActivityResult {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.status === "string" &&
    ACTIVITY_RESULT_STATUSES.has(candidate.status) &&
    typeof candidate.message === "string" &&
    (candidate.output === undefined || typeof candidate.output === "string") &&
    (candidate.technicalDetails === undefined ||
      typeof candidate.technicalDetails === "string")
  );
}

// Valida mensagens vindas do Worker antes de confiar nelas — o postMessage
// não garante em tempo de compilação que o payload realmente tem esse shape.
export function isWorkerResponse(value: unknown): value is WorkerResponse {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;

  if (candidate.type === "ready") return true;

  if (candidate.type === "load_error") {
    return typeof candidate.message === "string";
  }

  if (candidate.type === "result") {
    return (
      typeof candidate.requestId === "string" &&
      isActivityResult(candidate.result)
    );
  }

  return false;
}
