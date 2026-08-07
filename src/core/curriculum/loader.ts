import { courseSchema, trackSchema, unitSchema } from "../../schemas/curriculum";
import type { Course, Track, Unit } from "../domain/types";

export function loadCourse(courseJson: unknown): Course {
  return courseSchema.parse(courseJson) as Course;
}

export function loadTrack(trackJson: unknown): Track {
  return trackSchema.parse(trackJson) as Track;
}

export function loadUnit(unitJson: unknown): Unit {
  return unitSchema.parse(unitJson) as Unit;
}
