import type { UserProgress, UnitProgress, Attempt, ActivityResult, DeepDiveProgressStatus } from "../domain/types";

export function createInitialUnitProgress(unitId: string, starterCode: string = ""): UnitProgress {
  return {
    unitId,
    starterCodeRestored: false,
    code: starterCode,
    attemptsCount: 0,
    attempts: [],
    unlockedHintsCount: 0,
    completed: false,
    deepDiveStatus: "not_started",
    lastActivityAt: new Date().toISOString(),
  };
}

export function createInitialProgress(initialUnitId: string, starterCode: string = ""): UserProgress {
  return {
    currentUnitId: initialUnitId,
    units: {
      [initialUnitId]: createInitialUnitProgress(initialUnitId, starterCode),
    },
  };
}

export function getOrCreateUnitProgress(progress: UserProgress, unitId: string, starterCode: string = ""): UnitProgress {
  return progress.units[unitId] || createInitialUnitProgress(unitId, starterCode);
}

export function changeUnit(progress: UserProgress, unitId: string, starterCode: string = ""): UserProgress {
  const units = { ...progress.units };
  if (!units[unitId]) {
    units[unitId] = createInitialUnitProgress(unitId, starterCode);
  }

  return {
    ...progress,
    currentUnitId: unitId,
    units,
  };
}

export function registerAttempt(
  progress: UserProgress,
  unitId: string,
  code: string,
  result: ActivityResult,
  starterCode: string = ""
): UserProgress {
  const unitProgress = getOrCreateUnitProgress(progress, unitId, starterCode);

  const attempt: Attempt = {
    code,
    timestamp: new Date().toISOString(),
    result,
  };

  const updatedAttempts = [...unitProgress.attempts, attempt];
  const completed = result.status === "success" ? true : unitProgress.completed;

  const updatedUnit: UnitProgress = {
    ...unitProgress,
    code,
    attemptsCount: unitProgress.attemptsCount + 1,
    attempts: updatedAttempts,
    completed,
    lastActivityAt: new Date().toISOString(),
  };

  return {
    ...progress,
    units: {
      ...progress.units,
      [unitId]: updatedUnit,
    },
  };
}

export function unlockHint(progress: UserProgress, unitId: string, maxHints: number, starterCode: string = ""): UserProgress {
  const unitProgress = getOrCreateUnitProgress(progress, unitId, starterCode);

  if (unitProgress.unlockedHintsCount >= maxHints) {
    return progress;
  }

  const updatedUnit: UnitProgress = {
    ...unitProgress,
    unlockedHintsCount: unitProgress.unlockedHintsCount + 1,
    lastActivityAt: new Date().toISOString(),
  };

  return {
    ...progress,
    units: {
      ...progress.units,
      [unitId]: updatedUnit,
    },
  };
}

export function updateDeepDiveStatus(
  progress: UserProgress,
  unitId: string,
  status: DeepDiveProgressStatus,
  starterCode: string = ""
): UserProgress {
  const unitProgress = getOrCreateUnitProgress(progress, unitId, starterCode);

  const updatedUnit: UnitProgress = {
    ...unitProgress,
    deepDiveStatus: status,
    lastActivityAt: new Date().toISOString(),
  };

  return {
    ...progress,
    units: {
      ...progress.units,
      [unitId]: updatedUnit,
    },
  };
}

export function updateUnitCode(
  progress: UserProgress,
  unitId: string,
  code: string,
  starterCode: string = ""
): UserProgress {
  const unitProgress = getOrCreateUnitProgress(progress, unitId, starterCode);

  if (unitProgress.code === code) {
    return progress;
  }

  const updatedUnit: UnitProgress = {
    ...unitProgress,
    code,
    lastActivityAt: new Date().toISOString(),
  };

  return {
    ...progress,
    units: {
      ...progress.units,
      [unitId]: updatedUnit,
    },
  };
}

export function resetUnitProgress(progress: UserProgress, unitId: string, starterCode: string): UserProgress {
  const updatedUnit: UnitProgress = {
    unitId,
    starterCodeRestored: true,
    code: starterCode,
    attemptsCount: 0,
    attempts: [],
    unlockedHintsCount: 0,
    completed: false,
    deepDiveStatus: "not_started",
    lastActivityAt: new Date().toISOString(),
  };

  return {
    ...progress,
    units: {
      ...progress.units,
      [unitId]: updatedUnit,
    },
  };
}
