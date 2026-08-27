import { create } from "zustand";

import type { Routine } from "../types/Routine";
import type { WorkoutExercise } from "../types/WorkoutExercise";
import type { WorkoutSession } from "../types/WorkoutSession";
import type { WorkoutSet } from "../types/WorkoutSet";

type WorkoutState = {
  activeRoutine: Routine | null;
  workoutExercises: WorkoutExercise[];
  startedAt: string | null;

  startWorkout: (routine: Routine) => void;

  updateWeight: (
    exerciseId: string,
    setId: string,
    newWeight: number,
  ) => void;

  updateReps: (
    exerciseId: string,
    setId: string,
    newReps: number,
  ) => void;

  toggleSet: (
    exerciseId: string,
    setId: string,
  ) => void;

  finishWorkout: () => WorkoutSession | null;

  resetWorkout: () => void;
};

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  activeRoutine: null,
  workoutExercises: [],
  startedAt: null,

  startWorkout: (routine) => {
    const workoutExercises: WorkoutExercise[] =
      routine.exercises.map((routineExercise) => {
        const sets: WorkoutSet[] = Array.from(
          { length: routineExercise.targetSets },
          (_, index) => ({
            id: crypto.randomUUID(),
            order: index + 1,
            weight: 0,
            reps: 0,
            completed: false,
          }),
        );

        return {
          exercise: routineExercise.exercise,
          targetSets: routineExercise.targetSets,
          targetReps: routineExercise.targetReps,
          restSeconds: routineExercise.restSeconds,
          sets,
        };
      });

    set({
      activeRoutine: routine,
      workoutExercises,
      startedAt: new Date().toISOString(),
    });
  },

  updateWeight: (exerciseId, setId, newWeight) => {
    set((state) => ({
      workoutExercises: state.workoutExercises.map(
        (exercise) => {
          if (exercise.exercise.id !== exerciseId) {
            return exercise;
          }

          return {
            ...exercise,

            sets: exercise.sets.map((workoutSet) => {
              if (workoutSet.id !== setId) {
                return workoutSet;
              }

              return {
                ...workoutSet,
                weight: Math.max(0, newWeight),
              };
            }),
          };
        },
      ),
    }));
  },

  updateReps: (exerciseId, setId, newReps) => {
    set((state) => ({
      workoutExercises: state.workoutExercises.map(
        (exercise) => {
          if (exercise.exercise.id !== exerciseId) {
            return exercise;
          }

          return {
            ...exercise,

            sets: exercise.sets.map((workoutSet) => {
              if (workoutSet.id !== setId) {
                return workoutSet;
              }

              return {
                ...workoutSet,
                reps: Math.max(0, Math.floor(newReps)),
              };
            }),
          };
        },
      ),
    }));
  },

  toggleSet: (exerciseId, setId) => {
    set((state) => ({
      workoutExercises: state.workoutExercises.map(
        (exercise) => {
          if (exercise.exercise.id !== exerciseId) {
            return exercise;
          }

          return {
            ...exercise,

            sets: exercise.sets.map((workoutSet) => {
              if (workoutSet.id !== setId) {
                return workoutSet;
              }

              return {
                ...workoutSet,
                completed: !workoutSet.completed,
              };
            }),
          };
        },
      ),
    }));
  },

  finishWorkout: () => {
    const {
      activeRoutine,
      workoutExercises,
      startedAt,
    } = get();

    if (!activeRoutine || !startedAt) {
      return null;
    }

    const session: WorkoutSession = {
      id: crypto.randomUUID(),
      routineId: activeRoutine.id,
      startedAt,
      completedAt: new Date().toISOString(),
      exercises: workoutExercises,
    };

    set({
      activeRoutine: null,
      workoutExercises: [],
      startedAt: null,
    });

    return session;
  },

  resetWorkout: () => {
    set({
      activeRoutine: null,
      workoutExercises: [],
      startedAt: null,
    });
  },
}));