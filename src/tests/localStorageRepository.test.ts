import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  LocalStorageProgressRepository,
  PROGRESS_STORAGE_KEY,
} from "../core/persistence/LocalStorageProgressRepository";
import { registerAttempt, unlockHint, updateDeepDiveStatus, updateUnitCode } from "../core/progress/manager";
import type { ActivityResult } from "../core/domain/types";

const UNIT_ID = "1.1-print";
const STARTER_CODE = "# Escreva seu código abaixo\n";

const successResult: ActivityResult = {
  status: "success",
  message: "A mensagem foi exibida corretamente.",
  output: "Meu diário de saúde",
};

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  window.localStorage.clear();
});

describe("LocalStorageProgressRepository", () => {
  it("carrega o progresso inicial (com starterCode) quando não existe nada persistido", async () => {
    const repo = new LocalStorageProgressRepository(UNIT_ID, STARTER_CODE);
    const progress = await repo.load();

    expect(progress.currentUnitId).toBe(UNIT_ID);
    expect(progress.units[UNIT_ID].code).toBe(STARTER_CODE);
    expect(progress.units[UNIT_ID].completed).toBe(false);
  });

  it("salva e restaura o progresso (round-trip)", async () => {
    const repo = new LocalStorageProgressRepository(UNIT_ID, STARTER_CODE);
    const initial = await repo.load();

    await repo.save(initial);

    const reloaded = await repo.load();
    expect(reloaded).toEqual(initial);
  });

  it("salva e restaura o código do editor (progress.units[id].code)", async () => {
    const repo = new LocalStorageProgressRepository(UNIT_ID, STARTER_CODE);
    const initial = await repo.load();

    const withCode = updateUnitCode(initial, UNIT_ID, "print('Meu diário de saúde')", STARTER_CODE);
    await repo.save(withCode);

    const reloaded = await repo.load();
    expect(reloaded.units[UNIT_ID].code).toBe("print('Meu diário de saúde')");
  });

  it("persiste tentativas (attempts/attemptsCount)", async () => {
    const repo = new LocalStorageProgressRepository(UNIT_ID, STARTER_CODE);
    const initial = await repo.load();

    const withAttempt = registerAttempt(initial, UNIT_ID, "print(1)", successResult, STARTER_CODE);
    await repo.save(withAttempt);

    const reloaded = await repo.load();
    expect(reloaded.units[UNIT_ID].attemptsCount).toBe(1);
    expect(reloaded.units[UNIT_ID].attempts).toHaveLength(1);
    expect(reloaded.units[UNIT_ID].attempts[0].result.status).toBe("success");
  });

  it("persiste a conclusão da unidade", async () => {
    const repo = new LocalStorageProgressRepository(UNIT_ID, STARTER_CODE);
    const initial = await repo.load();

    const completed = registerAttempt(initial, UNIT_ID, "print(1)", successResult, STARTER_CODE);
    await repo.save(completed);

    const reloaded = await repo.load();
    expect(reloaded.units[UNIT_ID].completed).toBe(true);
  });

  it("persiste dicas desbloqueadas", async () => {
    const repo = new LocalStorageProgressRepository(UNIT_ID, STARTER_CODE);
    const initial = await repo.load();

    const withHint = unlockHint(initial, UNIT_ID, 5, STARTER_CODE);
    await repo.save(withHint);

    const reloaded = await repo.load();
    expect(reloaded.units[UNIT_ID].unlockedHintsCount).toBe(1);
  });

  it("persiste o status do aprofundamento", async () => {
    const repo = new LocalStorageProgressRepository(UNIT_ID, STARTER_CODE);
    const initial = await repo.load();

    const withDeepDive = updateDeepDiveStatus(initial, UNIT_ID, "viewed", STARTER_CODE);
    await repo.save(withDeepDive);

    const reloaded = await repo.load();
    expect(reloaded.units[UNIT_ID].deepDiveStatus).toBe("viewed");
  });

  it("reset() limpa a chave e o próximo load() volta ao estado inicial", async () => {
    const repo = new LocalStorageProgressRepository(UNIT_ID, STARTER_CODE);
    const withHint = unlockHint(await repo.load(), UNIT_ID, 5, STARTER_CODE);
    await repo.save(withHint);

    await repo.reset();

    expect(window.localStorage.getItem(PROGRESS_STORAGE_KEY)).toBeNull();
    const reloaded = await repo.load();
    expect(reloaded.units[UNIT_ID].unlockedHintsCount).toBe(0);
    expect(reloaded.units[UNIT_ID].code).toBe(STARTER_CODE);
  });

  it("ignora dados com versão incompatível e volta ao estado inicial", async () => {
    window.localStorage.setItem(
      PROGRESS_STORAGE_KEY,
      JSON.stringify({
        version: 2,
        progress: { currentUnitId: UNIT_ID, units: {} },
      })
    );

    const repo = new LocalStorageProgressRepository(UNIT_ID, STARTER_CODE);
    const progress = await repo.load();
    expect(progress.units[UNIT_ID].code).toBe(STARTER_CODE);
  });

  it("ignora JSON inválido e volta ao estado inicial, sem lançar", async () => {
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, "{ isto não é json válido");

    const repo = new LocalStorageProgressRepository(UNIT_ID, STARTER_CODE);
    await expect(repo.load()).resolves.toMatchObject({ currentUnitId: UNIT_ID });
  });

  it("ignora dados corrompidos (JSON válido, formato incompatível com o schema)", async () => {
    window.localStorage.setItem(
      PROGRESS_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        progress: { currentUnitId: 123, units: "isto deveria ser um objeto" },
      })
    );

    const repo = new LocalStorageProgressRepository(UNIT_ID, STARTER_CODE);
    const progress = await repo.load();
    expect(progress.units[UNIT_ID].code).toBe(STARTER_CODE);
  });

  it("nunca lança quando localStorage está indisponível (ex.: navegação privada)", async () => {
    const original = Object.getOwnPropertyDescriptor(window, "localStorage");
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      get() {
        throw new Error("SecurityError: localStorage indisponível");
      },
    });

    try {
      const repo = new LocalStorageProgressRepository(UNIT_ID, STARTER_CODE);
      await expect(repo.load()).resolves.toMatchObject({ currentUnitId: UNIT_ID });
      await expect(repo.save(await repo.load())).resolves.toBeUndefined();
      await expect(repo.reset()).resolves.toBeUndefined();
    } finally {
      if (original) Object.defineProperty(window, "localStorage", original);
    }
  });
});
