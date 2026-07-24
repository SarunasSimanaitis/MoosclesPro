import type { Exercise } from "./Exercise"

export interface Routine {
  id: string
  name: string
  exercises: Exercise[]
}