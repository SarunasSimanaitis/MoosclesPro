import { useMemo, useRef } from "react";

import type { WorkoutExercise } from "../types/WorkoutExercise";
import type { WorkoutSession } from "../types/WorkoutSession";
import {
  addWorkoutSet,
  buildWorkoutSession,
  calculateWorkoutMetrics,
  normalizeReps,
  normalizeWeight,
  removeWorkoutSet,
  setExerciseRest,
  setExerciseSkipped,
  updateWorkoutSet,
  type PreviousPerformanceMap,
  type PreviousSet,
} from "../lib/workoutEngine";
import { isValidRpe } from "../lib/rpe";

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

  addSet: (exerciseId: string) => void;
  removeSet: (exerciseId: string, setId: string) => void;
  updateRpe: (exerciseId: string, setId: string, rpe: number | null) => void;
  fillSet: (exerciseId: string, setId: string, source: PreviousSet) => void;
  setRest: (exerciseId: string, seconds: number) => void;
  setSkipped: (exerciseId: string, skipped: boolean) => void;
  previous: PreviousPerformanceMap;

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

  const workoutExercises = useMemo(
    () => activeWorkout?.exercises ?? [],
    [activeWorkout?.exercises],
  );

  const startedAt =
    activeWorkout?.startedAt ??
    new Date().toISOString();

  const metrics = useMemo(
    () => calculateWorkoutMetrics(workoutExercises),
    [workoutExercises],
  );

  const { completedSets, totalSets, progress, totalVolume } = metrics;

  function updateWeight(
    exerciseId: string,
    setId: string,
    weight: number,
  ) {
    const normalizedWeight = normalizeWeight(weight);

    updateExercises(
      (currentExercises) =>
        updateWorkoutSet(
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
    const normalizedReps = normalizeReps(reps);

    updateExercises(
      (currentExercises) =>
        updateWorkoutSet(
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
        updateWorkoutSet(
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

  const previous = useMemo(
    () => activeWorkout?.previous ?? {},
    [activeWorkout?.previous],
  );

  function addSet(exerciseId: string) {
    updateExercises((currentExercises) =>
      addWorkoutSet(currentExercises, exerciseId, previous[exerciseId]),
    );
  }

  function removeSet(exerciseId: string, setId: string) {
    updateExercises((currentExercises) =>
      removeWorkoutSet(currentExercises, exerciseId, setId),
    );
  }

  function updateRpe(exerciseId: string, setId: string, rpe: number | null) {
    updateExercises((currentExercises) =>
      updateWorkoutSet(currentExercises, exerciseId, setId, (set) => ({
        ...set,
        rpe: isValidRpe(rpe) ? rpe : null,
      })),
    );
  }

  /** Copies last time's numbers into a set (tapping the "Previous" column). */
  function fillSet(exerciseId: string, setId: string, source: PreviousSet) {
    updateExercises((currentExercises) =>
      updateWorkoutSet(currentExercises, exerciseId, setId, (set) => ({
        ...set,
        weight: normalizeWeight(source.weight),
        reps: normalizeReps(source.reps),
      })),
    );
  }

  function setRest(exerciseId: string, seconds: number) {
    updateExercises((currentExercises) =>
      setExerciseRest(currentExercises, exerciseId, seconds),
    );
  }

  function setSkipped(exerciseId: string, skipped: boolean) {
    updateExercises((currentExercises) =>
      setExerciseSkipped(currentExercises, exerciseId, skipped),
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

    return buildWorkoutSession(current, completedAt);
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
    addSet,
    removeSet,
    updateRpe,
    fillSet,
    setRest,
    setSkipped,
    previous,
    createSession,
  };
}
