import type { WorkoutSession } from "../types/WorkoutSession";

import { apiRequest } from "./client";

const ENDPOINT =
  "/api/workout-sessions";

export const workoutSessionsApi = {
  list(): Promise<WorkoutSession[]> {
    return apiRequest<WorkoutSession[]>(
      ENDPOINT,
    );
  },

  get(sessionId: string): Promise<WorkoutSession> {
    return apiRequest<WorkoutSession>(
      `${ENDPOINT}?id=${encodeURIComponent(sessionId)}`,
    );
  },

  latestForRoutine(routineId: string): Promise<WorkoutSession | null> {
    return apiRequest<WorkoutSession | null>(
      `${ENDPOINT}?routineId=${encodeURIComponent(routineId)}&limit=1`,
    );
  },

  create(
    session: WorkoutSession,
  ): Promise<WorkoutSession> {
    return apiRequest<WorkoutSession>(
      ENDPOINT,
      {
        method: "POST",
        body: session,
      },
    );
  },
};