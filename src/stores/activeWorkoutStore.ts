import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Routine } from "../types/Routine";
import type { WorkoutExercise } from "../types/WorkoutExercise";

export type ActiveWorkout = {
  id: string;
  userId: string;
  routineId: string;
  startedAt: string;
  exercises: WorkoutExercise[];
  isPaused: boolean;
  pauseStartedAt: number | null;
  totalPausedMs: number;
};

type ActiveWorkoutState = {
  activeWorkout: ActiveWorkout | null;

  startWorkout: (
    routine: Routine,
    userId: string,
  ) => ActiveWorkout;

  updateExercises: (
    updater: (
      exercises: WorkoutExercise[],
    ) => WorkoutExercise[],
  ) => void;

  togglePause: () => void;

  clearActiveWorkout: () => void;
};

export const useActiveWorkoutStore =
  create<ActiveWorkoutState>()(
    persist(
      (set) => ({
        activeWorkout: null,

        startWorkout: (
          routine,
          userId,
        ) => {
          const workout: ActiveWorkout = {
            id: crypto.randomUUID(),
            userId,
            routineId: routine.id,
            startedAt:
              new Date().toISOString(),
            exercises:
              createWorkoutExercises(
                routine,
              ),
            isPaused: false,
            pauseStartedAt: null,
            totalPausedMs: 0,
          };

          set({
            activeWorkout: workout,
          });

          return workout;
        },

        updateExercises: (
          updater,
        ) => {
          set((state) => {
            if (!state.activeWorkout) {
              return state;
            }

            return {
              activeWorkout: {
                ...state.activeWorkout,
                exercises: updater(
                  state.activeWorkout
                    .exercises,
                ),
              },
            };
          });
        },

        togglePause: () => {
          set((state) => {
            const active =
              state.activeWorkout;

            if (!active) {
              return state;
            }

            if (active.isPaused) {
              const pauseDuration =
                active.pauseStartedAt !==
                null
                  ? Date.now() -
                    active.pauseStartedAt
                  : 0;

              return {
                activeWorkout: {
                  ...active,
                  isPaused: false,
                  pauseStartedAt: null,
                  totalPausedMs:
                    active.totalPausedMs +
                    pauseDuration,
                },
              };
            }

            return {
              activeWorkout: {
                ...active,
                isPaused: true,
                pauseStartedAt:
                  Date.now(),
              },
            };
          });
        },

        clearActiveWorkout: () => {
          set({
            activeWorkout: null,
          });
        },
      }),
      {
        name: "mooscles-active-workout",
        partialize: (state) => ({
          activeWorkout:
            state.activeWorkout,
        }),
      },
    ),
  );

function createWorkoutExercises(
  routine: Routine,
): WorkoutExercise[] {
  return routine.exercises.map(
    (routineExercise) => ({
      exercise:
        routineExercise.exercise,

      targetSets:
        routineExercise.targetSets,

      targetReps:
        routineExercise.targetReps,

      restSeconds:
        routineExercise.restSeconds,

      sets: Array.from(
        {
          length:
            routineExercise.targetSets,
        },
        (_, index) => ({
          id: crypto.randomUUID(),
          order: index + 1,
          weight: 0,
          reps: 0,
          completed: false,
        }),
      ),
    }),
  );
}