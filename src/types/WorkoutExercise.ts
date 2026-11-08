import type { Exercise } from "./Exercise";
import type { WorkoutSet } from "./WorkoutSet";

export interface WorkoutExercise {
  exercise: Exercise;

  targetSets: number;
  targetReps: string;
  restSeconds: number;

  sets: WorkoutSet[];

  /** Skipped during the workout: its unfinished sets don't count toward progress. */
  skipped?: boolean;
}
