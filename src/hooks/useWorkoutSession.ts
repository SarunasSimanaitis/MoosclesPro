import {
  useMemo,
  useRef,
  useState,
} from "react";

import type { Routine } from "../types/Routine";
import type { WorkoutExercise } from "../types/WorkoutExercise";
import type { WorkoutSession } from "../types/WorkoutSession";
import type { WorkoutSet } from "../types/WorkoutSet";

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

export function useWorkoutSession(
  routine: Routine,
): UseWorkoutSessionResult {
  const [startedAt] = useState(
    () => new Date().toISOString(),
  );

  const [
    workoutExercises,
    setWorkoutExercises,
  ] = useState<WorkoutExercise[]>(() =>
    createWorkoutExercises(routine),
  );

  /*
   * These refs make auto-fill a one-time
   * action for each exercise.
   *
   * Once the initial values are committed,
   * later edits affect only the selected set.
   */
  const autoFilledWeightExercises =
    useRef(new Set<string>());

  const autoFilledRepExercises =
    useRef(new Set<string>());

  const completedSets = useMemo(
    () =>
      workoutExercises.reduce(
        (total, exercise) =>
          total +
          exercise.sets.filter(
            (set) => set.completed,
          ).length,
        0,
      ),
    [workoutExercises],
  );

  const totalSets = useMemo(
    () =>
      workoutExercises.reduce(
        (total, exercise) =>
          total + exercise.sets.length,
        0,
      ),
    [workoutExercises],
  );

  const progress =
    totalSets > 0
      ? (completedSets / totalSets) *
        100
      : 0;

  const totalVolume = useMemo(
    () =>
      workoutExercises.reduce(
        (total, exercise) =>
          total +
          exercise.sets.reduce(
            (exerciseTotal, set) =>
              exerciseTotal +
              (set.completed
                ? set.weight * set.reps
                : 0),
            0,
          ),
        0,
      ),
    [workoutExercises],
  );

  function updateWeight(
    exerciseId: string,
    setId: string,
    weight: number,
  ) {
    const normalizedWeight = Number.isFinite(
      weight,
    )
      ? Math.max(0, weight)
      : 0;

    updateSet(
      exerciseId,
      setId,
      (set) => ({
        ...set,
        weight: normalizedWeight,
      }),
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

    setWorkoutExercises(
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

            const shouldAutoFill =
              exercise.sets.some(
                (set) =>
                  set.id !== setId &&
                  set.weight === 0,
              );

            if (!shouldAutoFill) {
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
    const normalizedReps = Number.isFinite(
      reps,
    )
      ? Math.max(
          0,
          Math.floor(reps),
        )
      : 0;

    updateSet(
      exerciseId,
      setId,
      (set) => ({
        ...set,
        reps: normalizedReps,
      }),
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

    setWorkoutExercises(
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

            const shouldAutoFill =
              exercise.sets.some(
                (set) =>
                  set.id !== setId &&
                  set.reps === 0,
              );

            if (!shouldAutoFill) {
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
    updateSet(
      exerciseId,
      setId,
      (set) => ({
        ...set,
        completed: !set.completed,
      }),
    );
  }

  function createSession(
    completedAt = new Date().toISOString(),
  ): WorkoutSession {
    return {
      id: crypto.randomUUID(),
      routineId: routine.id,
      startedAt,
      completedAt,
      exercises: workoutExercises,
    };
  }

  function updateSet(
    exerciseId: string,
    setId: string,
    updater: (
      set: WorkoutSet,
    ) => WorkoutSet,
  ) {
    setWorkoutExercises(
      (currentExercises) =>
        currentExercises.map(
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
        ),
    );
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