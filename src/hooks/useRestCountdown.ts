import { useEffect, useState } from "react";

import { getRestRemainingSeconds, useRestTimerStore } from "../stores/restTimerStore";

/** Live view of the rest timer, re-rendering a few times a second while it runs. */
export function useRestCountdown() {
  const endsAt = useRestTimerStore((state) => state.endsAt);
  const durationSeconds = useRestTimerStore((state) => state.durationSeconds);
  const label = useRestTimerStore((state) => state.label);
  const finishedAt = useRestTimerStore((state) => state.finishedAt);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (endsAt === null) return;

    const tick = () => setNow(Date.now());
    const first = window.setTimeout(tick, 0);
    const interval = window.setInterval(tick, 250);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(interval);
    };
  }, [endsAt]);

  const running = endsAt !== null;
  const remaining = getRestRemainingSeconds(endsAt, now);
  const exactRemaining = endsAt === null ? 0 : Math.max(0, (endsAt - now) / 1000);
  const progress = running && durationSeconds > 0 ? Math.min(1, exactRemaining / durationSeconds) : 0;

  return { running, remaining, durationSeconds, progress, label, finishedAt };
}
