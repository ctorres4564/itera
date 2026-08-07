import type { ProgressRepository } from "../domain/contracts";
import type { UserProgress } from "../domain/types";
import { createInitialProgress } from "../progress/manager";
import {
  PERSISTED_PROGRESS_VERSION,
  persistedProgressEnvelopeSchema,
} from "../../schemas/progress";

export const PROGRESS_STORAGE_KEY = "itera.progress";

// Acessar window.localStorage pode lançar (navegação privada, ambientes
// restritos) mesmo antes de chamar getItem/setItem — por isso o acesso em si
// também fica protegido, não só as chamadas nele.
function getStorage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

// Único ponto de acesso ao localStorage da aplicação. Nenhum componente React
// deve acessar localStorage diretamente — sempre através deste repositório.
export class LocalStorageProgressRepository implements ProgressRepository {
  private readonly initialUnitId: string;
  private readonly starterCode: string;

  constructor(initialUnitId: string, starterCode: string = "") {
    this.initialUnitId = initialUnitId;
    this.starterCode = starterCode;
  }

  private initialProgress(): UserProgress {
    return createInitialProgress(this.initialUnitId, this.starterCode);
  }

  async load(): Promise<UserProgress> {
    const storage = getStorage();
    if (!storage) return this.initialProgress();

    try {
      const raw = storage.getItem(PROGRESS_STORAGE_KEY);
      if (!raw) return this.initialProgress();

      const parsed: unknown = JSON.parse(raw);
      const result = persistedProgressEnvelopeSchema.safeParse(parsed);
      if (!result.success) return this.initialProgress();

      return result.data.progress;
    } catch {
      // JSON inválido ou qualquer outra falha de leitura: nunca derruba a
      // aplicação, apenas volta ao progresso inicial.
      return this.initialProgress();
    }
  }

  async save(progress: UserProgress): Promise<void> {
    const storage = getStorage();
    if (!storage) return;

    try {
      storage.setItem(
        PROGRESS_STORAGE_KEY,
        JSON.stringify({ version: PERSISTED_PROGRESS_VERSION, progress })
      );
    } catch {
      // localStorage indisponível/quota excedida: falha silenciosa. O
      // código visível no editor vive só no state React e não é afetado.
    }
  }

  async reset(): Promise<void> {
    const storage = getStorage();
    if (!storage) return;

    try {
      storage.removeItem(PROGRESS_STORAGE_KEY);
    } catch {
      // idem save(): falha silenciosa, não derruba a aplicação.
    }
  }
}
