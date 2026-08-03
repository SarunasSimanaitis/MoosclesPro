import type { WorkoutSession } from "../types/WorkoutSession";

const STORAGE_KEY = "mooscles-workouts";

export function saveWorkout(session: WorkoutSession) {
  const workouts = getWorkouts();

  workouts.push(session);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(workouts)
  );
}

export function getWorkouts(): WorkoutSession[] {
  const workouts = localStorage.getItem(STORAGE_KEY);

  if (!workouts) {
    return [];
  }

  return JSON.parse(workouts);
}