import type { Exercise } from "./Exercise"
import type { WorkoutSet } from "./WorkoutSet"

export interface WorkoutExercise {
  exercise: Exercise
  sets: WorkoutSet[]
}