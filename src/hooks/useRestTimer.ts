import { useEffect, useState } from "react";

type RestTimer = {
  restTime: number | null;
  restDuration: number;
  start: (seconds: number) => void;
  stop: () => void;
  addTime: (seconds: number) => void;
  removeTime: (seconds: number) => void;
};

export function useRestTimer(): RestTimer {
  const [restTime, setRestTime] =
    useState<number | null>(null);

  const [restDuration, setRestDuration] =
    useState(0);

  useEffect(() => {
    if (restTime === null) {
      return;
    }

    const interval =
      window.setInterval(() => {
        setRestTime((current) => {
          if (current === null) {
            return null;
          }

          if (current <= 1) {
            setRestDuration(0);
            return null;
          }

          return current - 1;
        });
      }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [restTime]);

  function start(seconds: number) {
    if (
      !Number.isFinite(seconds) ||
      seconds <= 0
    ) {
      return;
    }

    setRestDuration(seconds);
    setRestTime(seconds);
  }

  function stop() {
    setRestTime(null);
    setRestDuration(0);
  }

  function addTime(seconds: number) {
    if (!Number.isFinite(seconds)) {
      return;
    }

    setRestTime((current) =>
      current === null
        ? null
        : Math.max(0, current + seconds),
    );
  }

  function removeTime(seconds: number) {
    if (!Number.isFinite(seconds)) {
      return;
    }

    setRestTime((current) =>
      current === null
        ? null
        : Math.max(0, current - seconds),
    );
  }

  return {
    restTime,
    restDuration,
    start,
    stop,
    addTime,
    removeTime,
  };
}