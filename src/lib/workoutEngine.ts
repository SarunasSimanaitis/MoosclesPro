import type { Routine } from "../types/Routine";
import type { WorkoutExercise } from "../types/WorkoutExercise";
import type { WorkoutSession } from "../types/WorkoutSession";
import type { WorkoutSet } from "../types/WorkoutSet";

export type WorkoutMetrics = {
  completedSets: number;
  totalSets: number;
  progress: number;
  totalVolume: number;
};

export function createWorkoutExercises(
  routine: Routine,
): WorkoutExercise[] {
  return routine.exercises.map(
    (routineExercise) => ({
      exercise: routineExercise.exercise,
      targetSets: routineExercise.targetSets,
      targetReps: routineExercise.targetReps,
      restSeconds: routineExercise.restSeconds,
      sets: Array.from(
        { length: routineExercise.targetSets },
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

export function updateWorkoutSet(
  exercises: WorkoutExercise[],
  exerciseId: string,
  setId: string,
  updater: (set: WorkoutSet) => WorkoutSet,
): WorkoutExercise[] {
  return exercises.map((exercise) => {
    if (exercise.exercise.id !== exerciseId) {
      return exercise;
    }

    return {
      ...exercise,
      sets: exercise.sets.map((set) =>
        set.id === setId ? updater(set) : set,
      ),
    };
  });
}

export function calculateWorkoutMetrics(
  exercises: WorkoutExercise[],
): WorkoutMetrics {
  let completedSets = 0;
  let totalSets = 0;
  let totalVolume = 0;

  for (const exercise of exercises) {
    totalSets += exercise.sets.length;

    for (const set of exercise.sets) {
      if (!set.completed) {
        continue;
      }

      completedSets += 1;
      totalVolume += set.weight * set.reps;
    }
  }

  return {
    completedSets,
    totalSets,
    progress:
      totalSets > 0
        ? (completedSets / totalSets) * 100
        : 0,
    totalVolume,
  };
}

export function buildWorkoutSession(
  activeWorkout: {
    id: string;
    routineId: string;
    startedAt: string;
    exercises: WorkoutExercise[];
  },
  completedAt = new Date().toISOString(),
): WorkoutSession {
  const startedAtMs = new Date(
    activeWorkout.startedAt,
  ).getTime();

  const completedAtMs = new Date(
    completedAt,
  ).getTime();

  if (
    !Number.isFinite(startedAtMs) ||
    !Number.isFinite(completedAtMs)
  ) {
    throw new Error(
      "Workout timestamps must be valid dates.",
    );
  }

  if (completedAtMs < startedAtMs) {
    throw new Error(
      "Workout completion time cannot be earlier than its start time.",
    );
  }

  return {
    id: activeWorkout.id,
    routineId: activeWorkout.routineId,
    startedAt: activeWorkout.startedAt,
    completedAt,
    exercises: activeWorkout.exercises,
  };
}

export function normalizeWeight(
  value: number,
): number {
  return Number.isFinite(value)
    ? Math.max(0, value)
    : 0;
}

export function normalizeReps(
  value: number,
): number {
  return Number.isFinite(value)
    ? Math.max(0, Math.floor(value))
    : 0;
}
