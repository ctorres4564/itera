import { describe, it, expect } from "vitest";
import { loadCourse, loadTrack, loadUnit } from "../core/curriculum/loader";
import {
  createInitialProgress,
  changeUnit,
  registerAttempt,
  unlockHint,
  updateDeepDiveStatus,
  resetUnitProgress,
} from "../core/progress/manager";
import { MemoryProgressRepository } from "../core/persistence/memoryRepository";
import type { ActivityResult } from "../core/domain/types";

// Importa os JSONs reais para validação de conteúdo no carregador do núcleo
import courseJson from "../content/courses/python-iniciante/course.json";
import trackJson from "../content/courses/python-iniciante/tracks/fundamentos-interacao.json";
import unitJson from "../content/courses/python-iniciante/units/1.1-print.json";

describe("Núcleo da Plataforma - Carregamento do Currículo", () => {
  it("deve carregar e validar o course.json real pelo loader", () => {
    const course = loadCourse(courseJson);
    expect(course.id).toBe("python-iniciante");
    expect(course.tracks).toContain("fundamentos-interacao");
  });

  it("deve carregar e validar a trilha real pelo loader", () => {
    const track = loadTrack(trackJson);
    expect(track.id).toBe("fundamentos-interacao");
    expect(track.units).toContain("1.1-print");
  });

  it("deve carregar e validar a unidade 1.1 real pelo loader", () => {
    const unit = loadUnit(unitJson);
    expect(unit.id).toBe("1.1-print");
    expect(unit.activity.config.expectedOutput).toBe("Meu diário de saúde");
  });
});

describe("Núcleo da Plataforma - Gerenciamento de Progresso e Dicas", () => {
  it("deve iniciar o progresso de forma adequada", () => {
    const progress = createInitialProgress("1.1-print", "# Code");
    expect(progress.currentUnitId).toBe("1.1-print");
    expect(progress.units["1.1-print"]).toBeDefined();
    expect(progress.units["1.1-print"].code).toBe("# Code");
    expect(progress.units["1.1-print"].completed).toBe(false);
    expect(progress.units["1.1-print"].unlockedHintsCount).toBe(0);
    expect(progress.units["1.1-print"].deepDiveStatus).toBe("not_started");
  });

  it("deve alterar a unidade atual", () => {
    let progress = createInitialProgress("1.1-print", "# print");
    progress = changeUnit(progress, "1.2-variables", "# var");
    expect(progress.currentUnitId).toBe("1.2-variables");
    expect(progress.units["1.2-variables"]).toBeDefined();
    expect(progress.units["1.2-variables"].code).toBe("# var");
  });

  it("deve registrar tentativas, incrementar contagem e marcar conclusão sob sucesso", () => {
    let progress = createInitialProgress("1.1-print", "# inicial");
    const failureResult: ActivityResult = {
      status: "incorrect",
      message: "Saída incorreta",
    };

    progress = registerAttempt(progress, "1.1-print", "print('Ola')", failureResult);
    expect(progress.units["1.1-print"].attemptsCount).toBe(1);
    expect(progress.units["1.1-print"].attempts[0].code).toBe("print('Ola')");
    expect(progress.units["1.1-print"].completed).toBe(false);

    const successResult: ActivityResult = {
      status: "success",
      message: "Sucesso!",
    };
    progress = registerAttempt(progress, "1.1-print", "print('Meu diário de saúde')", successResult);
    expect(progress.units["1.1-print"].attemptsCount).toBe(2);
    expect(progress.units["1.1-print"].completed).toBe(true);
  });

  it("deve liberar dicas gradualmente e respeitar o limite total", () => {
    let progress = createInitialProgress("1.1-print", "");
    const maxHints = 5;

    // Libera a primeira dica
    progress = unlockHint(progress, "1.1-print", maxHints);
    expect(progress.units["1.1-print"].unlockedHintsCount).toBe(1);

    // Desbloqueia as restantes até o limite
    for (let i = 0; i < 6; i++) {
      progress = unlockHint(progress, "1.1-print", maxHints);
    }
    expect(progress.units["1.1-print"].unlockedHintsCount).toBe(5); // Limita em 5
  });

  it("deve gerenciar estados do aprofundamento opcional sem alterar a conclusão principal", () => {
    let progress = createInitialProgress("1.1-print", "");
    expect(progress.units["1.1-print"].deepDiveStatus).toBe("not_started");

    progress = updateDeepDiveStatus(progress, "1.1-print", "viewed");
    expect(progress.units["1.1-print"].deepDiveStatus).toBe("viewed");
    expect(progress.units["1.1-print"].completed).toBe(false); // Mantém conclusão inalterada
  });

  it("deve restaurar o código inicial ao resetar o progresso", () => {
    let progress = createInitialProgress("1.1-print", "print('codigo modificado')");
    progress = resetUnitProgress(progress, "1.1-print", "# código inicial restaurado");
    expect(progress.units["1.1-print"].code).toBe("# código inicial restaurado");
    expect(progress.units["1.1-print"].starterCodeRestored).toBe(true);
    expect(progress.units["1.1-print"].attemptsCount).toBe(0);
    expect(progress.units["1.1-print"].completed).toBe(false);
  });
});

describe("Núcleo da Plataforma - Integração com ProgressRepository Abstrato", () => {
  it("deve salvar, carregar e reiniciar o progresso de forma consistente no repositório", async () => {
    const repository = new MemoryProgressRepository("1.1-print", "# start");
    let progress = await repository.load();
    expect(progress.currentUnitId).toBe("1.1-print");
    expect(progress.units["1.1-print"].code).toBe("# start");

    // Simula alteração e gravação
    progress = registerAttempt(progress, "1.1-print", "print('teste')", {
      status: "success",
      message: "OK",
    });
    await repository.save(progress);

    // Carrega novamente para verificar consistência
    const reloaded = await repository.load();
    expect(reloaded.units["1.1-print"].completed).toBe(true);
    expect(reloaded.units["1.1-print"].attemptsCount).toBe(1);

    // Testa o reinício do repositório
    await repository.reset();
    const afterReset = await repository.load();
    expect(afterReset.units["1.1-print"].completed).toBe(false);
    expect(afterReset.units["1.1-print"].attemptsCount).toBe(0);
  });
});
