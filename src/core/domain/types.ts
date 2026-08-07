export type ActivityType =
  | "code"
  | "multiple_choice"
  | "short_answer"
  | "association"
  | "ordering"
  | "case_analysis";

export interface ActivityResult {
  status:
    | "success"
    | "incorrect"
    | "syntax_error"
    | "runtime_error"
    | "timeout"
    | "no_output"
    | "output_limit"
    | "internal_error";
  message: string;
  output?: string;
  technicalDetails?: string;
}

export interface Attempt {
  code: string;
  timestamp: string;
  result: ActivityResult;
}

export type DeepDiveProgressStatus = "not_started" | "viewed" | "completed";

export interface UnitProgress {
  unitId: string;
  starterCodeRestored: boolean;
  code: string;
  attemptsCount: number;
  attempts: Attempt[];
  unlockedHintsCount: number;
  completed: boolean;
  deepDiveStatus: DeepDiveProgressStatus;
  lastActivityAt: string;
}

export interface UserProgress {
  currentUnitId: string;
  units: Record<string, UnitProgress>;
}

export interface Course {
  id: string;
  title: string;
  version: string;
  tracks: string[]; // Track IDs
}

export interface Track {
  id: string;
  courseId: string;
  title: string;
  order: number;
  units: string[]; // Unit IDs
}

export interface ActivityConfig {
  language: string;
  starterCode: string;
  expectedOutput: string;
  timeoutMs: number;
  maxOutputCharacters: number;
}

export interface ActivityDefinition {
  type: ActivityType;
  config: ActivityConfig;
}

export interface UnitEssential {
  purpose: string;
  behavior: string;
  example: string;
  application: string;
}

export interface UnitDeepDive {
  enabled: boolean;
  origin: string;
  terminal?: string;
  stdout?: string;
  evolution: string;
  internalBehavior: string;
  comparisons: string;
  goodPractices: string;
  curiosities: string;
  extraChallenge: string;
}

export interface Unit {
  id: string;
  courseId: string;
  trackId: string;
  title: string;
  order: number;
  objectives: string[];
  essential: UnitEssential;
  deepDive: UnitDeepDive;
  activity: ActivityDefinition;
  hints: string[];
}
