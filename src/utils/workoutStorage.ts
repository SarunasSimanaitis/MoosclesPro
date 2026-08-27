import type { WorkoutSession } from "../types/WorkoutSession";

const STORAGE_KEY = "mooscles-workout-sessions";

export function getWorkoutSessions(): WorkoutSession[] {
  const storedSessions = localStorage.getItem(STORAGE_KEY);

  if (!storedSessions) {
    return [];
  }

  return JSON.parse(storedSessions) as WorkoutSession[];
}

export function saveWorkoutSession(session: WorkoutSession): void {
  const existingSessions = getWorkoutSessions();

  const updatedSessions = [...existingSessions, session];

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedSessions),
  );
}