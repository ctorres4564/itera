import { vi } from "vitest";
import type {
  WorkerRequest,
  WorkerResponse,
} from "../../activities/code/worker/protocol";

export class MockWorker {
  static instances: MockWorker[] = [];
  onmessage: ((event: MessageEvent<WorkerResponse>) => void) | null = null;
  onerror: (() => void) | null = null;
  terminated = false;
  posted: WorkerRequest[] = [];

  constructor() {
    MockWorker.instances.push(this);
  }

  postMessage(message: WorkerRequest) {
    this.posted.push(message);
  }

  terminate() {
    this.terminated = true;
  }

  emit(data: WorkerResponse) {
    this.onmessage?.({ data } as MessageEvent<WorkerResponse>);
  }

  emitError() {
    this.onerror?.();
  }
}

export function installMockWorker(): void {
  MockWorker.instances = [];
  vi.stubGlobal("Worker", MockWorker);
}

export function latestWorker(): MockWorker {
  const worker = MockWorker.instances[MockWorker.instances.length - 1];
  if (!worker) throw new Error("Nenhum MockWorker foi criado.");
  return worker;
}
