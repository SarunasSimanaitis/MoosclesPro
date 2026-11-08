import { useEffect } from "react";

import { restFinishedAlert } from "../../lib/feedback";
import { useRestTimerStore } from "../../stores/restTimerStore";

/** If a rest ended longer ago than this (e.g. the app was closed), finish it quietly. */
const STALE_ALERT_MS = 10_000;
/** How long the "rest over" message stays up. */
const FINISHED_FLASH_MS = 3_000;

/**
 * Lives in the app shell so a rest that ends while you're on another page
 * still chimes and vibrates exactly once.
 */
export default function RestTimerWatcher() {
  const endsAt = useRestTimerStore((state) => state.endsAt);
  const complete = useRestTimerStore((state) => state.complete);
  const stop = useRestTimerStore((state) => state.stop);
  const finishedAt = useRestTimerStore((state) => state.finishedAt);
  const clearFinished = useRestTimerStore((state) => state.clearFinished);

  useEffect(() => {
    if (endsAt === null) return;

    const delay = endsAt - Date.now();

    if (delay <= -STALE_ALERT_MS) {
      stop();
      return;
    }

    const timeout = window.setTimeout(() => {
      restFinishedAlert();
      complete();
    }, Math.max(0, delay));

    return () => window.clearTimeout(timeout);
  }, [endsAt, complete, stop]);

  useEffect(() => {
    if (finishedAt === null) return;

    const timeout = window.setTimeout(clearFinished, FINISHED_FLASH_MS);
    return () => window.clearTimeout(timeout);
  }, [finishedAt, clearFinished]);

  return null;
}
