import { z } from "zod";

export const activityTypeSchema = z.enum([
  "code",
  "multiple_choice",
  "short_answer",
  "association",
  "ordering",
  "case_analysis",
]);

export const activityConfigSchema = z.object({
  language: z.string(),
  starterCode: z.string(),
  expectedOutput: z.string(),
  timeoutMs: z.number().int().positive(),
  maxOutputCharacters: z.number().int().positive(),
});

export const activityDefinitionSchema = z.object({
  type: activityTypeSchema,
  config: activityConfigSchema,
});

export const unitEssentialSchema = z.object({
  purpose: z.string(),
  behavior: z.string(),
  example: z.string(),
  application: z.string(),
});

export const unitDeepDiveSchema = z.object({
  enabled: z.boolean(),
  origin: z.string(),
  evolution: z.string(),
  internalBehavior: z.string(),
  comparisons: z.string(),
  goodPractices: z.string(),
  curiosities: z.string(),
  extraChallenge: z.string(),
});

export const unitSchema = z.object({
  id: z.string(),
  courseId: z.string(),
  trackId: z.string(),
  title: z.string(),
  order: z.number().int().positive(),
  objectives: z.array(z.string()),
  essential: unitEssentialSchema,
  deepDive: unitDeepDiveSchema,
  activity: activityDefinitionSchema,
  hints: z.array(z.string()),
});

export const courseSchema = z.object({
  id: z.string(),
  title: z.string(),
  version: z.string(),
  tracks: z.array(z.string()),
});

export const trackSchema = z.object({
  id: z.string(),
  courseId: z.string(),
  title: z.string(),
  order: z.number().int().positive(),
  units: z.array(z.string()),
});
