import type { Routine } from "../types/Routine";
import type { WorkoutExercise } from "../types/WorkoutExercise";
import type { WorkoutSession } from "../types/WorkoutSession";
import type { WorkoutSet } from "../types/WorkoutSet";

export type PreviousPerformance = Pick<WorkoutSet, "weight" | "reps">;

export type WorkoutMetrics = {
  completedSets: number;
  totalSets: number;
  progress: number;
  totalVolume: number;
};

export type PreviousSet = Pick<WorkoutSet, "weight" | "reps" | "rpe">;

/** Last time's completed sets, per exercise id, in set order. */
export type PreviousPerformanceMap = Record<string, PreviousSet[]>;

type CreateWorkoutOptions = {
  /** Pre-fill weight and reps from these sets. */
  previous?: PreviousPerformanceMap;
  /** Rest seconds the user chose for specific exercises, by exercise id. */
  restOverrides?: Record<string, number>;
};

export function createWorkoutExercises(
  routine: Routine,
  options: CreateWorkoutOptions = {},
): WorkoutExercise[] {
  const { previous = {}, restOverrides = {} } = options;

  return routine.exercises.map(
    (routineExercise) => {
      const previousSets = previous[routineExercise.exercise.id] ?? [];
      const restOverride = restOverrides[routineExercise.exercise.id];

      return {
        exercise: routineExercise.exercise,
        targetSets: routineExercise.targetSets,
        targetReps: routineExercise.targetReps,
        restSeconds: restOverride ?? routineExercise.restSeconds,
        sets: Array.from(
          { length: routineExercise.targetSets },
          (_, index) => {
            const previousSet = previousSets[index];
            return {
              id: crypto.randomUUID(),
              order: index + 1,
              weight: previousSet ? normalizeWeight(previousSet.weight) : 0,
              reps: previousSet ? normalizeReps(previousSet.reps) : 0,
              completed: false,
            };
          },
        ),
      };
    },
  );
}

/**
 * Completed sets from a previous session, grouped by exercise. Sets that were
 * skipped or left half-filled are ignored: they aren't what the user lifted.
 */
export function getPreviousPerformance(
  session: WorkoutSession | null,
): PreviousPerformanceMap {
  const map: PreviousPerformanceMap = {};
  if (!session) return map;

  for (const exercise of session.exercises) {
    if (map[exercise.exercise.id]) continue;

    const completed = [...exercise.sets]
      .filter((set) => set.completed)
      .sort((a, b) => a.order - b.order)
      .map((set) => ({ weight: set.weight, reps: set.reps, rpe: set.rpe ?? null }));

    if (completed.length > 0) map[exercise.exercise.id] = completed;
  }

  return map;
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
    totalSets += exercise.skipped
      ? exercise.sets.filter((set) => set.completed).length
      : exercise.sets.length;

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

  // Exercises skipped without a single completed set don't belong in the log.
  const exercises = activeWorkout.exercises.filter(
    (exercise) => !exercise.skipped || exercise.sets.some((set) => set.completed),
  );

  return {
    id: activeWorkout.id,
    routineId: activeWorkout.routineId,
    startedAt: activeWorkout.startedAt,
    completedAt,
    exercises,
  };
}

export function normalizeWeight(
  value: number,
): number {
  // 0.01 kg precision keeps pound conversions clean without losing accuracy.
  return Number.isFinite(value)
    ? Math.max(0, Math.round(value * 100) / 100)
    : 0;
}

export function normalizeReps(
  value: number,
): number {
  return Number.isFinite(value)
    ? Math.max(0, Math.floor(value))
    : 0;
}


export function applyPreviousPerformance(
  exercises: WorkoutExercise[],
  previousSession: WorkoutSession | null,
): WorkoutExercise[] {
  if (!previousSession) return exercises;

  const previous = getPreviousPerformance(previousSession);

  return exercises.map((exercise) => {
    const previousSets = previous[exercise.exercise.id];
    if (!previousSets) return exercise;

    return {
      ...exercise,
      sets: exercise.sets.map((set) => {
        const previousSet = previousSets[set.order - 1];
        if (!previousSet) return set;

        return {
          ...set,
          weight: normalizeWeight(previousSet.weight),
          reps: normalizeReps(previousSet.reps),
        };
      }),
    };
  });
}

function updateExercise(
  exercises: WorkoutExercise[],
  exerciseId: string,
  updater: (exercise: WorkoutExercise) => WorkoutExercise,
): WorkoutExercise[] {
  return exercises.map((exercise) =>
    exercise.exercise.id === exerciseId ? updater(exercise) : exercise,
  );
}

export function setExerciseRest(
  exercises: WorkoutExercise[],
  exerciseId: string,
  seconds: number,
): WorkoutExercise[] {
  const restSeconds = Number.isFinite(seconds) ? Math.min(600, Math.max(0, Math.round(seconds))) : 0;
  return updateExercise(exercises, exerciseId, (exercise) => ({ ...exercise, restSeconds }));
}

export function setExerciseSkipped(
  exercises: WorkoutExercise[],
  exerciseId: string,
  skipped: boolean,
): WorkoutExercise[] {
  return updateExercise(exercises, exerciseId, (exercise) => ({ ...exercise, skipped }));
}

/** Removes a set (never the last remaining one) and renumbers the rest. */
export function removeWorkoutSet(
  exercises: WorkoutExercise[],
  exerciseId: string,
  setId: string,
): WorkoutExercise[] {
  return updateExercise(exercises, exerciseId, (exercise) => {
    if (exercise.sets.length <= 1) return exercise;

    const sets = exercise.sets
      .filter((set) => set.id !== setId)
      .map((set, index) => ({ ...set, order: index + 1 }));

    return { ...exercise, sets };
  });
}

/** Adds a set that copies the previous set's numbers (or last time's, if known). */
export function addWorkoutSet(
  exercises: WorkoutExercise[],
  exerciseId: string,
  previous: PreviousSet[] = [],
): WorkoutExercise[] {
  return updateExercise(exercises, exerciseId, (exercise) => {
    const order = exercise.sets.length + 1;
    const lastSet = exercise.sets[exercise.sets.length - 1];
    const source = previous[order - 1] ?? lastSet;

    return {
      ...exercise,
      skipped: false,
      targetSets: Math.max(exercise.targetSets, order),
      sets: [
        ...exercise.sets,
        {
          id: crypto.randomUUID(),
          order,
          weight: source ? normalizeWeight(source.weight) : 0,
          reps: source ? normalizeReps(source.reps) : 0,
          completed: false,
        },
      ],
    };
  });
}
