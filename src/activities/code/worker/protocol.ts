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
