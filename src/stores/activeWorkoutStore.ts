import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Routine } from "../types/Routine";
import type { WorkoutExercise } from "../types/WorkoutExercise";
import { createWorkoutExercises } from "../lib/workoutEngine";

export type ActiveWorkout = {
  id: string;
  userId: string;
  routineId: string;
  startedAt: string;
  updatedAt: string;
  exercises: WorkoutExercise[];
  isPaused: boolean;
  pauseStartedAt: number | null;
  totalPausedMs: number;
};

type ActiveWorkoutState = {
  activeWorkout: ActiveWorkout | null;
  startWorkout: (routine: Routine, userId: string) => ActiveWorkout;
  updateExercises: (updater: (exercises: WorkoutExercise[]) => WorkoutExercise[]) => void;
  togglePause: () => void;
  clearActiveWorkout: () => void;
};

export const useActiveWorkoutStore = create<ActiveWorkoutState>()(
  persist(
    (set) => ({
      activeWorkout: null,

      startWorkout: (routine, userId) => {
        const now = new Date().toISOString();

        const workout: ActiveWorkout = {
          id: crypto.randomUUID(),
          userId,
          routineId: routine.id,
          startedAt: now,
          updatedAt: now,
          exercises: createWorkoutExercises(routine),
          isPaused: false,
          pauseStartedAt: null,
          totalPausedMs: 0,
        };

        set({ activeWorkout: workout });
        return workout;
      },

      updateExercises: (updater) => {
        set((state) => {
          if (!state.activeWorkout) return state;

          return {
            activeWorkout: {
              ...state.activeWorkout,
              exercises: updater(state.activeWorkout.exercises),
              updatedAt: new Date().toISOString(),
            },
          };
        });
      },

      togglePause: () => {
        set((state) => {
          const active = state.activeWorkout;
          if (!active) return state;

          const updatedAt = new Date().toISOString();

          if (active.isPaused) {
            const pauseDuration =
              active.pauseStartedAt !== null
                ? Math.max(0, Date.now() - active.pauseStartedAt)
                : 0;

            return {
              activeWorkout: {
                ...active,
                isPaused: false,
                pauseStartedAt: null,
                totalPausedMs: active.totalPausedMs + pauseDuration,
                updatedAt,
              },
            };
          }

          return {
            activeWorkout: {
              ...active,
              isPaused: true,
              pauseStartedAt: Date.now(),
              updatedAt,
            },
          };
        });
      },

      clearActiveWorkout: () => set({ activeWorkout: null }),
    }),
    {
      name: "mooscles-active-workout",
      version: 2,
      partialize: (state) => ({ activeWorkout: state.activeWorkout }),
      migrate: (persisted) => {
        const state = persisted as ActiveWorkoutState;
        if (!state?.activeWorkout) return state;

        return {
          ...state,
          activeWorkout: {
            ...state.activeWorkout,
            updatedAt:
              state.activeWorkout.updatedAt ??
              state.activeWorkout.startedAt,
          },
        };
      },
    },
  ),
);
