import { useEffect, useMemo, useRef, useState } from "react";

type WorkoutTimer = {
  elapsedSeconds: number;
  isPaused: boolean;
  formattedTime: string;
  togglePause: () => void;
};

export function useWorkoutTimer(
  startedAt: string,
): WorkoutTimer {
  const [isPaused, setIsPaused] =
    useState(false);

  const [
    elapsedSeconds,
    setElapsedSeconds,
  ] = useState(0);

  const pauseStartedAtRef =
    useRef<number | null>(null);

  const totalPausedMsRef =
    useRef(0);

  const startedAtMs = useMemo(
    () => new Date(startedAt).getTime(),
    [startedAt],
  );

  useEffect(() => {
    if (isPaused) {
      return;
    }

    function updateElapsed() {
      const now = Date.now();

      const activePauseMs =
        pauseStartedAtRef.current !== null
          ? now -
            pauseStartedAtRef.current
          : 0;

      const activeTime = Math.max(
        0,
        now -
          startedAtMs -
          totalPausedMsRef.current -
          activePauseMs,
      );

      setElapsedSeconds(
        Math.floor(activeTime / 1000),
      );
    }

    updateElapsed();

    const interval = window.setInterval(
      updateElapsed,
      1000,
    );

    return () => {
      window.clearInterval(interval);
    };
  }, [isPaused, startedAtMs]);

  function togglePause() {
    if (isPaused) {
      if (
        pauseStartedAtRef.current !==
        null
      ) {
        totalPausedMsRef.current +=
          Date.now() -
          pauseStartedAtRef.current;
      }

      pauseStartedAtRef.current = null;
      setIsPaused(false);
      return;
    }

    pauseStartedAtRef.current =
      Date.now();

    setIsPaused(true);
  }

  const formattedTime =
    formatDuration(elapsedSeconds);

  return {
    elapsedSeconds,
    isPaused,
    formattedTime,
    togglePause,
  };
}

function formatDuration(
  totalSeconds: number,
) {
  const minutes = Math.floor(
    totalSeconds / 60,
  );

  const seconds = totalSeconds % 60;

  return `${minutes
    .toString()
    .padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}