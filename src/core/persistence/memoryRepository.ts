import type { ProgressRepository } from "../domain/contracts";
import type { UserProgress } from "../domain/types";
import { createInitialProgress } from "../progress/manager";

export class MemoryProgressRepository implements ProgressRepository {
  private progress: UserProgress;

  constructor(initialUnitId: string = "1.1-print", starterCode: string = "") {
    this.progress = createInitialProgress(initialUnitId, starterCode);
  }

  async load(): Promise<UserProgress> {
    return { ...this.progress };
  }

  async save(progress: UserProgress): Promise<void> {
    this.progress = { ...progress };
  }

  async reset(): Promise<void> {
    // Para simplificar, reset volta ao estado inicial vazio para a unidade 1.1-print
    this.progress = createInitialProgress("1.1-print", "");
  }
}
