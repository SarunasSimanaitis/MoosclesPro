export interface WorkoutSet {
  id: string;
  weight: number;
  reps: number;
  completed: boolean;
  order: number;
  /** Rate of perceived exertion (6–10 in half steps). Optional. */
  rpe?: number | null;
}
