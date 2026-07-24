import type { WorkoutExercise } from "./WorkoutExercise"

export interface WorkoutSession {
  id: string
  routineId: string
  startedAt: Date
  finishedAt?: Date
  exercises: WorkoutExercise[]
}