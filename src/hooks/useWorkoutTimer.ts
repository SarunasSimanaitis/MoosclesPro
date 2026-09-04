import {
  useEffect,
  useState,
} from "react";

import {
  formatElapsedTime,
  getElapsedSeconds,
} from "../lib/activeWorkout";

import { useActiveWorkoutStore } from "../stores/activeWorkoutStore";

type WorkoutTimer = {
  elapsedSeconds: number;
  isPaused: boolean;
  formattedTime: string;
  togglePause: () => void;
};

export function useWorkoutTimer(): WorkoutTimer {
  const activeWorkout =
    useActiveWorkoutStore(
      (state) => state.activeWorkout,
    );

  const togglePause =
    useActiveWorkoutStore(
      (state) => state.togglePause,
    );

  const [now, setNow] =
    useState(() => Date.now());

  useEffect(() => {
    const interval =
      window.setInterval(() => {
        setNow(Date.now());
      }, 1000);

    return () => {
      window.clearInterval(
        interval,
      );
    };
  }, []);

  const elapsedSeconds =
    getElapsedSeconds(
      activeWorkout,
      now,
    );

  return {
    elapsedSeconds,
    isPaused:
      activeWorkout?.isPaused ??
      false,
    formattedTime:
      formatElapsedTime(
        elapsedSeconds,
      ),
    togglePause,
  };
}