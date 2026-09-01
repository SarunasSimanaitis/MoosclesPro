import type { WorkoutSession } from "../types/WorkoutSession";

import {
  workoutSessionsApi,
} from "../api/workoutSessions";

export function getWorkoutSessions(): Promise<
  WorkoutSession[]
> {
  return workoutSessionsApi.list();
}

export function saveWorkoutSession(
  session: WorkoutSession,
): Promise<WorkoutSession> {
  return workoutSessionsApi.create(
    session,
  );
}