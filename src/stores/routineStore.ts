import { create } from "zustand";

import type { Routine } from "../types/Routine";
import type { RoutineExercise } from "../types/RoutineExercise";

type RoutineState = {
  customRoutines: Routine[];

  setCustomRoutines: (
    routines: Routine[],
  ) => void;

  addRoutine: (
    routine: Routine,
  ) => void;

  updateRoutine: (
    routine: Routine,
  ) => void;

  deleteRoutine: (
    routineId: string,
  ) => void;

  addExerciseToRoutine: (
    routineId: string,
    exercise: RoutineExercise,
  ) => void;

  removeExerciseFromRoutine: (
    routineId: string,
    exerciseId: string,
  ) => void;
};

export const useRoutineStore =
  create<RoutineState>((set) => ({
    customRoutines: [],

    setCustomRoutines: (routines) => {
      set({
        customRoutines: routines,
      });
    },

    addRoutine: (routine) => {
      set((state) => ({
        customRoutines: [
          ...state.customRoutines,
          routine,
        ],
      }));
    },

    updateRoutine: (routine) => {
      set((state) => ({
        customRoutines:
          state.customRoutines.map(
            (existingRoutine) =>
              existingRoutine.id ===
              routine.id
                ? routine
                : existingRoutine,
          ),
      }));
    },

    deleteRoutine: (routineId) => {
      set((state) => ({
        customRoutines:
          state.customRoutines.filter(
            (routine) =>
              routine.id !== routineId,
          ),
      }));
    },

    addExerciseToRoutine: (
      routineId,
      exercise,
    ) => {
      set((state) => ({
        customRoutines:
          state.customRoutines.map(
            (routine) => {
              if (
                routine.id !==
                routineId
              ) {
                return routine;
              }

              return {
                ...routine,
                exercises: [
                  ...routine.exercises,
                  exercise,
                ],
              };
            },
          ),
      }));
    },

    removeExerciseFromRoutine: (
      routineId,
      exerciseId,
    ) => {
      set((state) => ({
        customRoutines:
          state.customRoutines.map(
            (routine) => {
              if (
                routine.id !==
                routineId
              ) {
                return routine;
              }

              return {
                ...routine,
                exercises:
                  routine.exercises.filter(
                    (routineExercise) =>
                      routineExercise.exercise.id !==
                      exerciseId,
                  ),
              };
            },
          ),
      }));
    },
  }));