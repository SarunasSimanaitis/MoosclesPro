import type { Routine } from "../types/Routine";

import { apiRequest } from "./client";

const ENDPOINT =
  "/api/routines";

export const routinesApi = {
  list(): Promise<Routine[]> {
    return apiRequest<Routine[]>(
      ENDPOINT,
    );
  },

  create(
    routine: Routine,
  ): Promise<Routine> {
    return apiRequest<Routine>(
      ENDPOINT,
      {
        method: "POST",
        body: routine,
      },
    );
  },

  update(
    routine: Routine,
  ): Promise<Routine> {
    return apiRequest<Routine>(
      ENDPOINT,
      {
        method: "PATCH",
        body: routine,
      },
    );
  },

  remove(
    routineId: string,
  ): Promise<{ success: true }> {
    return apiRequest<{
      success: true;
    }>(
      `${ENDPOINT}?id=${encodeURIComponent(
        routineId,
      )}`,
      {
        method: "DELETE",
      },
    );
  },
};