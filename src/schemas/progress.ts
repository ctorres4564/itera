import { z } from "zod";

export const activityResultStatusSchema = z.enum([
  "success",
  "incorrect",
  "syntax_error",
  "runtime_error",
  "timeout",
  "no_output",
  "output_limit",
  "internal_error",
]);

export const activityResultSchema = z.object({
  status: activityResultStatusSchema,
  message: z.string(),
  output: z.string().optional(),
  technicalDetails: z.string().optional(),
});

export const attemptSchema = z.object({
  code: z.string(),
  timestamp: z.string(),
  result: activityResultSchema,
});

export const deepDiveProgressStatusSchema = z.enum([
  "not_started",
  "viewed",
  "completed",
]);

export const unitProgressSchema = z.object({
  unitId: z.string(),
  starterCodeRestored: z.boolean(),
  code: z.string(),
  attemptsCount: z.number().int().nonnegative(),
  attempts: z.array(attemptSchema),
  unlockedHintsCount: z.number().int().nonnegative(),
  completed: z.boolean(),
  deepDiveStatus: deepDiveProgressStatusSchema,
  lastActivityAt: z.string(),
});

export const userProgressSchema = z.object({
  currentUnitId: z.string(),
  units: z.record(z.string(), unitProgressSchema),
});

export const PERSISTED_PROGRESS_VERSION = 1;

export const persistedProgressEnvelopeSchema = z.object({
  version: z.literal(PERSISTED_PROGRESS_VERSION),
  progress: userProgressSchema,
});

export type PersistedProgressEnvelope = z.infer<
  typeof persistedProgressEnvelopeSchema
>;
