import type { WorkoutExercise } from "./WorkoutExercise";

export interface WorkoutSession {
  id: string;
  routineId: string;
  startedAt: string;
  completedAt: string;
  exercises: WorkoutExercise[];
}