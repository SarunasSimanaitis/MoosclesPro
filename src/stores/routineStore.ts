import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Routine } from "../types/Routine";
import type { RoutineExercise } from "../types/RoutineExercise";

type RoutineState = {
  customRoutines: Routine[];

  addRoutine: (routine: Routine) => void;

  updateRoutine: (routine: Routine) => void;

  deleteRoutine: (routineId: string) => void;

  duplicateRoutine: (routine: Routine) => void;

  addExerciseToRoutine: (
    routineId: string,
    exercise: RoutineExercise,
  ) => void;

  removeExerciseFromRoutine: (
    routineId: string,
    exerciseId: string,
  ) => void;
};

export const useRoutineStore = create<RoutineState>()(
  persist(
    (set) => ({
      customRoutines: [],

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
          customRoutines: state.customRoutines.map(
            (existingRoutine) =>
              existingRoutine.id === routine.id
                ? routine
                : existingRoutine,
          ),
        }));
      },

      deleteRoutine: (routineId) => {
        set((state) => ({
          customRoutines: state.customRoutines.filter(
            (routine) => routine.id !== routineId,
          ),
        }));
      },

      duplicateRoutine: (routine) => {
        const duplicatedRoutine: Routine = {
          ...routine,
          id: `custom-${crypto.randomUUID()}`,
          name: `${routine.name} Copy`,
          exercises: routine.exercises.map(
            (routineExercise) => ({
              ...routineExercise,
            }),
          ),
        };

        set((state) => ({
          customRoutines: [
            ...state.customRoutines,
            duplicatedRoutine,
          ],
        }));
      },

      addExerciseToRoutine: (
        routineId,
        exercise,
      ) => {
        set((state) => ({
          customRoutines: state.customRoutines.map(
            (routine) => {
              if (routine.id !== routineId) {
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
          customRoutines: state.customRoutines.map(
            (routine) => {
              if (routine.id !== routineId) {
                return routine;
              }

              return {
                ...routine,
                exercises: routine.exercises.filter(
                  (routineExercise) =>
                    routineExercise.exercise.id !==
                    exerciseId,
                ),
              };
            },
          ),
        }));
      },
    }),
    {
      name: "moosclespro-routines",
    },
  ),
);