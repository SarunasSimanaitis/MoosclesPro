import type { Routine } from "../types/Routine";

import { apiRequest } from "./client";
import { cachedRequest, invalidateCached, readCached } from "./cache";

const ENDPOINT = "/api/routines";

export const routinesApi = {
  list(): Promise<Routine[]> {
    return cachedRequest("routines:list", () => apiRequest<Routine[]>(ENDPOINT));
  },

  cachedList(): Routine[] | undefined {
    return readCached<Routine[]>("routines:list");
  },

  clearCache() {
    invalidateCached("routines:list");
  },

  async create(
    routine: Routine,
  ): Promise<Routine> {
    const created = await apiRequest<Routine>(
      ENDPOINT,
      {
        method: "POST",
        body: routine,
      },
    );
    invalidateCached("routines:list");
    return created;
  },

  async update(
    routine: Routine,
  ): Promise<Routine> {
    const updated = await apiRequest<Routine>(
      ENDPOINT,
      {
        method: "PATCH",
        body: routine,
      },
    );
    invalidateCached("routines:list");
    return updated;
  },

  async remove(
    routineId: string,
  ): Promise<{ success: true }> {
    const result = await apiRequest<{
      success: true;
    }>(
      `${ENDPOINT}?id=${encodeURIComponent(
        routineId,
      )}`,
      {
        method: "DELETE",
      },
    );
    invalidateCached("routines:list");
    return result;
  },
};
