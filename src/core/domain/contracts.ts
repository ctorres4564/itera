import type { ActivityResult, ActivityType, UserProgress } from "./types";

export interface ActivityEngine<TConfig, TResponse> {
  type: ActivityType;

  validate(
    response: TResponse,
    config: TConfig
  ): Promise<ActivityResult>;

  reset(): Promise<void>;
}

export interface ProgressRepository {
  load(): Promise<UserProgress>;
  save(progress: UserProgress): Promise<void>;
  reset(): Promise<void>;
}
