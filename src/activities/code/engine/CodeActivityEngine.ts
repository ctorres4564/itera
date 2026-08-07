import type { ActivityResult } from "../../../core/domain/types";
import type { EngineStatus } from "../worker/protocol";
import { PythonWorkerClient, type RunConfig } from "../worker/workerClient";

// Contrato técnico de execução, separado de ActivityEngine.validate() (Etapa 8
// usará validate() para lógica pedagógica; execute() só roda código e captura saída/erro).
export class CodeActivityEngine {
  private readonly client: PythonWorkerClient;

  constructor(onStatusChange?: (status: EngineStatus) => void) {
    this.client = new PythonWorkerClient(onStatusChange);
  }

  getStatus(): EngineStatus {
    return this.client.getStatus();
  }

  execute(code: string, config: RunConfig): Promise<ActivityResult> {
    return this.client.run(code, config);
  }

  dispose(): void {
    this.client.dispose();
  }
}
