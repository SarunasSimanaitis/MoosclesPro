import { useEffect, useState } from "react";

import { routinesApi } from "../api/routines";
import { useRoutineStore } from "../stores/routineStore";

type LoadStatus = "loading" | "ready" | "error";

/**
 * Makes sure the signed-in user's own routines are in the routine store.
 *
 * Any screen that can be opened directly (a refresh, a deep link, the
 * "Up next" card) and needs a custom routine must call this, otherwise the
 * routine only exists after the Workouts page has been visited.
 * The request is shared and cached, so calling it from several places is cheap.
 */
export function useCustomRoutines(enabled = true) {
  const customRoutines = useRoutineStore((state) => state.customRoutines);
  const setCustomRoutines = useRoutineStore((state) => state.setCustomRoutines);
  const [status, setStatus] = useState<LoadStatus>(() =>
    routinesApi.cachedList() ? "ready" : "loading",
  );

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    routinesApi
      .list()
      .then((data) => {
        if (cancelled) return;
        setCustomRoutines(data);
        setStatus("ready");
      })
      .catch((error: unknown) => {
        console.error("Failed to load routines:", error);
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [enabled, setCustomRoutines]);

  return {
    customRoutines,
    status: enabled ? status : ("ready" as LoadStatus),
  };
}
