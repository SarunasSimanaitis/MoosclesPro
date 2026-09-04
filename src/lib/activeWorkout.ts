import type { ActiveWorkout } from "../stores/activeWorkoutStore";

export function getElapsedSeconds(
  workout: ActiveWorkout | null,
  now = Date.now(),
): number {
  if (!workout) {
    return 0;
  }

  const startedAt =
    new Date(workout.startedAt).getTime();

  if (!Number.isFinite(startedAt)) {
    return 0;
  }

  const endTime =
    workout.isPaused &&
    workout.pauseStartedAt !== null
      ? workout.pauseStartedAt
      : now;

  const elapsedMs = Math.max(
    0,
    endTime -
      startedAt -
      workout.totalPausedMs,
  );

  return Math.floor(
    elapsedMs / 1000,
  );
}

export function formatElapsedTime(
  totalSeconds: number,
): string {
  const safeSeconds = Math.max(
    0,
    Math.floor(totalSeconds),
  );

  const hours = Math.floor(
    safeSeconds / 3600,
  );

  const minutes = Math.floor(
    (safeSeconds % 3600) / 60,
  );

  const seconds =
    safeSeconds % 60;

  if (hours > 0) {
    return `${hours
      .toString()
      .padStart(2, "0")}:${minutes
      .toString()
      .padStart(
        2,
        "0",
      )}:${seconds
      .toString()
      .padStart(
        2,
        "0",
      )}`;
  }

  return `${minutes
    .toString()
    .padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

export function getActiveWorkoutCompletedSets(
  workout: ActiveWorkout | null,
): number {
  if (!workout) {
    return 0;
  }

  return workout.exercises.reduce(
    (total, exercise) =>
      total +
      exercise.sets.filter(
        (set) => set.completed,
      ).length,
    0,
  );
}

export function getActiveWorkoutTotalSets(
  workout: ActiveWorkout | null,
): number {
  if (!workout) {
    return 0;
  }

  return workout.exercises.reduce(
    (total, exercise) =>
      total + exercise.sets.length,
    0,
  );
}

export function getActiveWorkoutVolume(
  workout: ActiveWorkout | null,
): number {
  if (!workout) {
    return 0;
  }

  return workout.exercises.reduce(
    (total, exercise) =>
      total +
      exercise.sets.reduce(
        (
          exerciseTotal,
          set,
        ) =>
          exerciseTotal +
          (set.completed
            ? set.weight * set.reps
            : 0),
        0,
      ),
    0,
  );
}