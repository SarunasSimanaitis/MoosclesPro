import type { RoutineExercise } from "./RoutineExercise";

export interface Routine {
  id: string;
  name: string;
  exercises: RoutineExercise[];
}