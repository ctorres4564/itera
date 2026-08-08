import type { ActivityResult } from "../../../core/domain/types";
import type { EngineStatus, WorkerRequest, WorkerResponse } from "./protocol";
import { isWorkerResponse } from "./protocol";

function createRequestId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function createWorkerInstance(): Worker {
  return new Worker(new URL("./pythonWorker.ts", import.meta.url), {
    type: "module",
  });
}

interface PendingRun {
  requestId: string;
  resolve: (result: ActivityResult) => void;
  timeoutHandle: ReturnType<typeof setTimeout>;
}

export interface RunConfig {
  timeoutMs: number;
  maxOutputCharacters: number;
}

export class PythonWorkerClient {
  private worker: Worker;
  private status: EngineStatus = "loading";
  private pending: PendingRun | null = null;
  private readonly onStatusChange?: (status: EngineStatus) => void;

  constructor(onStatusChange?: (status: EngineStatus) => void) {
    this.onStatusChange = onStatusChange;
    this.worker = this.spawnWorker();
  }

  getStatus(): EngineStatus {
    return this.status;
  }

  isBusy(): boolean {
    return this.pending !== null;
  }

  run(code: string, config: RunConfig): Promise<ActivityResult> {
    if (this.status !== "ready") {
      return Promise.resolve({
        status: "internal_error",
        message: "O motor Python ainda não está pronto.",
      });
    }
    if (this.pending) {
      return Promise.resolve({
        status: "internal_error",
        message: "Já existe uma execução em andamento.",
      });
    }

    const requestId = createRequestId();

    return new Promise<ActivityResult>((resolve) => {
      const timeoutHandle = setTimeout(() => {
        this.handleTimeout(requestId);
      }, config.timeoutMs);

      this.pending = { requestId, resolve, timeoutHandle };

      const request: WorkerRequest = {
        type: "run",
        requestId,
        code,
        maxOutputCharacters: config.maxOutputCharacters,
      };
      this.worker.postMessage(request);
    });
  }

  dispose(): void {
    this.resolvePending({
      status: "internal_error",
      message: "O motor Python foi descartado antes de concluir a execução.",
    });
    this.worker.terminate();
  }

  private spawnWorker(): Worker {
    this.setStatus("loading");
    const worker = createWorkerInstance();
    worker.onmessage = (event: MessageEvent<unknown>) => {
      if (!isWorkerResponse(event.data)) {
        this.recoverFromWorkerFailure(
          "O motor Python enviou uma mensagem inesperada."
        );
        return;
      }
      this.handleMessage(event.data);
    };
    worker.onerror = () => {
      this.recoverFromWorkerFailure("O motor Python falhou de forma inesperada.");
    };
    return worker;
  }

  private setStatus(status: EngineStatus): void {
    this.status = status;
    this.onStatusChange?.(status);
  }

  // Resolve a execução pendente (se houver) com o resultado dado, limpando o
  // timeout e o estado interno. Sem efeito se não há nada pendente.
  private resolvePending(result: ActivityResult): void {
    if (!this.pending) return;
    const { resolve, timeoutHandle } = this.pending;
    clearTimeout(timeoutHandle);
    this.pending = null;
    resolve(result);
  }

  // Encerra o worker atual e cria um novo, resolvendo qualquer execução
  // pendente com internal_error antes — usado tanto para erro do worker
  // quanto para mensagens que não batem com o protocolo esperado.
  private recoverFromWorkerFailure(message: string): void {
    this.resolvePending({ status: "internal_error", message });
    this.worker.terminate();
    this.worker = this.spawnWorker();
  }

  private handleMessage(message: WorkerResponse): void {
    if (message.type === "ready") {
      this.setStatus("ready");
      return;
    }
    if (message.type === "load_error") {
      this.setStatus("error");
      return;
    }
    if (!this.pending || this.pending.requestId !== message.requestId) {
      return;
    }
    this.resolvePending(message.result);
  }

  private handleTimeout(requestId: string): void {
    if (!this.pending || this.pending.requestId !== requestId) {
      return;
    }
    this.resolvePending({
      status: "timeout",
      message: "A execução excedeu o tempo limite.",
    });
    this.worker.terminate();
    this.worker = this.spawnWorker();
  }
}
