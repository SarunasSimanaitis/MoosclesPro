import type { WorkoutSession } from "../types/WorkoutSession";

import { apiRequest } from "./client";
import { cachedRequest, invalidateCached, readCached } from "./cache";

const ENDPOINT =
  "/api/workout-sessions";

export const workoutSessionsApi = {
  list(): Promise<WorkoutSession[]> {
    return cachedRequest("workout-sessions:list", () => apiRequest<WorkoutSession[]>(ENDPOINT));
  },

  cachedList(): WorkoutSession[] | undefined {
    return readCached<WorkoutSession[]>("workout-sessions:list");
  },

  clearCache() {
    invalidateCached("workout-sessions:list");
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

  async create(
    session: WorkoutSession,
  ): Promise<WorkoutSession> {
    const created = await apiRequest<WorkoutSession>(
      ENDPOINT,
      {
        method: "POST",
        body: session,
      },
    );
    invalidateCached("workout-sessions:list", "statistics:get", "dashboard:get");
    return created;
  },
};
