import { useMemo, useRef } from "react";

import type { WorkoutExercise } from "../types/WorkoutExercise";
import type { WorkoutSession } from "../types/WorkoutSession";
import type { WorkoutSet } from "../types/WorkoutSet";

import {
  getActiveWorkoutCompletedSets,
  getActiveWorkoutTotalSets,
  getActiveWorkoutVolume,
} from "../lib/activeWorkout";

import { useActiveWorkoutStore } from "../stores/activeWorkoutStore";

type UseWorkoutSessionResult = {
  startedAt: string;
  workoutExercises: WorkoutExercise[];

  completedSets: number;
  totalSets: number;
  progress: number;
  totalVolume: number;

  updateWeight: (
    exerciseId: string,
    setId: string,
    weight: number,
  ) => void;

  commitWeight: (
    exerciseId: string,
    setId: string,
  ) => void;

  updateReps: (
    exerciseId: string,
    setId: string,
    reps: number,
  ) => void;

  commitReps: (
    exerciseId: string,
    setId: string,
  ) => void;

  toggleSet: (
    exerciseId: string,
    setId: string,
  ) => void;

  createSession: (
    completedAt?: string,
  ) => WorkoutSession;
};

export function useWorkoutSession(): UseWorkoutSessionResult {
  const activeWorkout =
    useActiveWorkoutStore(
      (state) => state.activeWorkout,
    );

  const updateExercises =
    useActiveWorkoutStore(
      (state) => state.updateExercises,
    );

  const autoFilledWeightExercises =
    useRef(new Set<string>());

  const autoFilledRepExercises =
    useRef(new Set<string>());

  const workoutExercises =
    activeWorkout?.exercises ?? [];

  const startedAt =
    activeWorkout?.startedAt ??
    new Date().toISOString();

  const completedSets = useMemo(
    () =>
      getActiveWorkoutCompletedSets(
        activeWorkout,
      ),
    [activeWorkout],
  );

  const totalSets = useMemo(
    () =>
      getActiveWorkoutTotalSets(
        activeWorkout,
      ),
    [activeWorkout],
  );

  const progress =
    totalSets > 0
      ? (completedSets /
          totalSets) *
        100
      : 0;

  const totalVolume = useMemo(
    () =>
      getActiveWorkoutVolume(
        activeWorkout,
      ),
    [activeWorkout],
  );

  function updateWeight(
    exerciseId: string,
    setId: string,
    weight: number,
  ) {
    const normalizedWeight =
      Number.isFinite(weight)
        ? Math.max(0, weight)
        : 0;

    updateExercises(
      (currentExercises) =>
        updateSet(
          currentExercises,
          exerciseId,
          setId,
          (set) => ({
            ...set,
            weight:
              normalizedWeight,
          }),
        ),
    );
  }

  function commitWeight(
    exerciseId: string,
    setId: string,
  ) {
    if (
      autoFilledWeightExercises.current.has(
        exerciseId,
      )
    ) {
      return;
    }

    updateExercises(
      (currentExercises) =>
        currentExercises.map(
          (exercise) => {
            if (
              exercise.exercise.id !==
              exerciseId
            ) {
              return exercise;
            }

            const sourceSet =
              exercise.sets.find(
                (set) =>
                  set.id === setId,
              );

            if (
              !sourceSet ||
              sourceSet.weight <= 0
            ) {
              return exercise;
            }

            const hasEmptyWeights =
              exercise.sets.some(
                (set) =>
                  set.id !== setId &&
                  set.weight === 0,
              );

            if (!hasEmptyWeights) {
              return exercise;
            }

            autoFilledWeightExercises.current.add(
              exerciseId,
            );

            return {
              ...exercise,
              sets: exercise.sets.map(
                (set) =>
                  set.id === setId ||
                  set.weight !== 0
                    ? set
                    : {
                        ...set,
                        weight:
                          sourceSet.weight,
                      },
              ),
            };
          },
        ),
    );
  }

  function updateReps(
    exerciseId: string,
    setId: string,
    reps: number,
  ) {
    const normalizedReps =
      Number.isFinite(reps)
        ? Math.max(
            0,
            Math.floor(reps),
          )
        : 0;

    updateExercises(
      (currentExercises) =>
        updateSet(
          currentExercises,
          exerciseId,
          setId,
          (set) => ({
            ...set,
            reps: normalizedReps,
          }),
        ),
    );
  }

  function commitReps(
    exerciseId: string,
    setId: string,
  ) {
    if (
      autoFilledRepExercises.current.has(
        exerciseId,
      )
    ) {
      return;
    }

    updateExercises(
      (currentExercises) =>
        currentExercises.map(
          (exercise) => {
            if (
              exercise.exercise.id !==
              exerciseId
            ) {
              return exercise;
            }

            const sourceSet =
              exercise.sets.find(
                (set) =>
                  set.id === setId,
              );

            if (
              !sourceSet ||
              sourceSet.reps <= 0
            ) {
              return exercise;
            }

            const hasEmptyReps =
              exercise.sets.some(
                (set) =>
                  set.id !== setId &&
                  set.reps === 0,
              );

            if (!hasEmptyReps) {
              return exercise;
            }

            autoFilledRepExercises.current.add(
              exerciseId,
            );

            return {
              ...exercise,
              sets: exercise.sets.map(
                (set) =>
                  set.id === setId ||
                  set.reps !== 0
                    ? set
                    : {
                        ...set,
                        reps:
                          sourceSet.reps,
                      },
              ),
            };
          },
        ),
    );
  }

  function toggleSet(
    exerciseId: string,
    setId: string,
  ) {
    updateExercises(
      (currentExercises) =>
        updateSet(
          currentExercises,
          exerciseId,
          setId,
          (set) => ({
            ...set,
            completed:
              !set.completed,
          }),
        ),
    );
  }

  function createSession(
    completedAt = new Date().toISOString(),
  ): WorkoutSession {
    const current =
      useActiveWorkoutStore.getState()
        .activeWorkout;

    if (!current) {
      throw new Error(
        "No active workout is available.",
      );
    }

    return {
      id: current.id,
      routineId: current.routineId,
      startedAt: current.startedAt,
      completedAt,
      exercises:
        current.exercises,
    };
  }

  return {
    startedAt,
    workoutExercises,
    completedSets,
    totalSets,
    progress,
    totalVolume,
    updateWeight,
    commitWeight,
    updateReps,
    commitReps,
    toggleSet,
    createSession,
  };
}

function updateSet(
  exercises: WorkoutExercise[],
  exerciseId: string,
  setId: string,
  updater: (
    set: WorkoutSet,
  ) => WorkoutSet,
): WorkoutExercise[] {
  return exercises.map(
    (exercise) => {
      if (
        exercise.exercise.id !==
        exerciseId
      ) {
        return exercise;
      }

      return {
        ...exercise,
        sets: exercise.sets.map(
          (set) =>
            set.id === setId
              ? updater(set)
              : set,
        ),
      };
    },
  );
}