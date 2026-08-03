import type { Exercise } from "./Exercise";

export interface RoutineExercise {
  exercise: Exercise;
  targetSets: number;
  targetReps: string;
  restSeconds: number;
}