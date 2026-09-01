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