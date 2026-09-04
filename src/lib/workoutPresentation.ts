import type { WorkoutSession } from "../types/WorkoutSession";

export function getCompletedSets(
  session: Pick<WorkoutSession, "exercises">,
): number {
  return session.exercises.reduce(
    (total, exercise) =>
      total +
      exercise.sets.filter(
        (set) => set.completed,
      ).length,
    0,
  );
}

export function getTotalSets(
  session: Pick<WorkoutSession, "exercises">,
): number {
  return session.exercises.reduce(
    (total, exercise) =>
      total + exercise.sets.length,
    0,
  );
}

export function getSessionVolume(
  session: Pick<WorkoutSession, "exercises">,
): number {
  return session.exercises.reduce(
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
  );
}

export function getSessionDurationSeconds(
  session: Pick<
    WorkoutSession,
    "startedAt" | "completedAt"
  >,
): number {
  const start = new Date(
    session.startedAt,
  ).getTime();

  const end = new Date(
    session.completedAt,
  ).getTime();

  if (
    !Number.isFinite(start) ||
    !Number.isFinite(end) ||
    end < start
  ) {
    return 0;
  }

  return Math.round(
    (end - start) / 1000,
  );
}

export function formatDuration(
  totalSeconds: number,
): string {
  const seconds = Math.max(
    0,
    Math.floor(totalSeconds),
  );

  const hours = Math.floor(
    seconds / 3600,
  );

  const minutes = Math.floor(
    (seconds % 3600) / 60,
  );

  const remainingSeconds =
    seconds % 60;

  if (hours > 0) {
    if (minutes === 0) {
      return `${hours} hr`;
    }

    return `${hours} hr ${minutes} min`;
  }

  if (minutes === 0) {
    return `${remainingSeconds} sec`;
  }

  if (remainingSeconds === 0) {
    return `${minutes} min`;
  }

  return `${minutes} min ${remainingSeconds} sec`;
}

export function getSessionDuration(
  session: Pick<
    WorkoutSession,
    "startedAt" | "completedAt"
  >,
): string {
  return formatDuration(
    getSessionDurationSeconds(
      session,
    ),
  );
}

export function formatWorkoutDate(
  value: string,
): string {
  const date = new Date(value);

  if (!Number.isFinite(date.getTime())) {
    return "Unknown date";
  }

  return date.toLocaleDateString(
    undefined,
    {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  );
}

export function formatWorkoutTime(
  value: string,
): string {
  const date = new Date(value);

  if (!Number.isFinite(date.getTime())) {
    return "";
  }

  return date.toLocaleTimeString(
    undefined,
    {
      hour: "numeric",
      minute: "2-digit",
    },
  );
}

export function formatNumber(
  value: number,
  maximumFractionDigits = 0,
): string {
  return value.toLocaleString(
    undefined,
    {
      maximumFractionDigits,
    },
  );
}