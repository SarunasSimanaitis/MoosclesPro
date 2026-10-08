import { useCallback, useEffect, useState } from "react";

type RestTimer = {
  restTime: number | null;
  restDuration: number;
  start: (seconds: number) => void;
  stop: () => void;
  addTime: (seconds: number) => void;
  removeTime: (seconds: number) => void;
};

export function useRestTimer(): RestTimer {
  const [endAt, setEndAt] = useState<number | null>(null);
  const [restDuration, setRestDuration] = useState(0);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (endAt === null) return;

    const interval = window.setInterval(() => {
      const current = Date.now();
      setNow(current);

      if (current >= endAt) {
        setEndAt(null);
        setRestDuration(0);
      }
    }, 1000);

    return () => window.clearInterval(interval);
  }, [endAt]);

  const stop = useCallback(() => {
    setEndAt(null);
    setRestDuration(0);
  }, []);

  const start = useCallback((seconds: number) => {
    if (!Number.isFinite(seconds) || seconds <= 0) return;

    const duration = Math.floor(seconds);
    setRestDuration(duration);
    setEndAt(Date.now() + duration * 1000);
    setNow(Date.now());
  }, []);

  const adjust = useCallback((seconds: number) => {
    setEndAt((currentEndAt) => {
      if (currentEndAt === null || !Number.isFinite(seconds)) {
        return currentEndAt;
      }

      return Math.max(Date.now(), currentEndAt + seconds * 1000);
    });
    setNow(Date.now());
  }, []);

  const restTime =
    endAt === null
      ? null
      : Math.max(0, Math.ceil((endAt - now) / 1000));


  return {
    restTime,
    restDuration,
    start,
    stop,
    addTime: (seconds) => adjust(Math.max(0, seconds)),
    removeTime: (seconds) => adjust(-Math.max(0, seconds)),
  };
}
