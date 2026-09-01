export type StoredWorkoutSet = {
  weight: number;
  reps: number;
  completed: boolean;
};

export type StoredWorkoutExercise = {
  exercise: {
    id: string;
    name: string;
  };

  sets: StoredWorkoutSet[];
};

export type StoredWorkoutSession = {
  id: string;
  userId: string;
  routineId: string;
  startedAt: string;
  completedAt: string;
  exercises: StoredWorkoutExercise[];
};

export type ExerciseStatistic = {
  exerciseId: string;
  name: string;
  workouts: number;
  sets: number;
  volume: number;
};

export type WeeklyStatistic = {
  label: string;
  start: string;
  workouts: number;
};

function getValidTimestamp(
  value: string,
): number | null {
  const timestamp =
    new Date(value).getTime();

  return Number.isFinite(timestamp)
    ? timestamp
    : null;
}

export function startOfDay(
  date: Date,
): Date {
  const result = new Date(date);

  result.setHours(
    0,
    0,
    0,
    0,
  );

  return result;
}

export function startOfWeek(
  date: Date,
): Date {
  const result =
    startOfDay(date);

  const day =
    result.getDay();

  const daysSinceMonday =
    day === 0
      ? 6
      : day - 1;

  result.setDate(
    result.getDate() -
      daysSinceMonday,
  );

  return result;
}

export function getDateKey(
  date: Date,
): string {
  const year =
    date.getFullYear();

  const month = String(
    date.getMonth() + 1,
  ).padStart(2, "0");

  const day = String(
    date.getDate(),
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getCurrentStreak(
  sessions: StoredWorkoutSession[],
): number {
  if (sessions.length === 0) {
    return 0;
  }

  const workoutDays =
    new Set<string>();

  for (const session of sessions) {
    const timestamp =
      getValidTimestamp(
        session.completedAt,
      );

    if (timestamp === null) {
      continue;
    }

    workoutDays.add(
      getDateKey(
        new Date(timestamp),
      ),
    );
  }

  if (workoutDays.size === 0) {
    return 0;
  }

  const currentDay =
    startOfDay(new Date());

  /*
   * A workout today counts immediately.
   * Otherwise continue from yesterday.
   */
  if (
    !workoutDays.has(
      getDateKey(currentDay),
    )
  ) {
    currentDay.setDate(
      currentDay.getDate() - 1,
    );
  }

  let streak = 0;

  while (
    workoutDays.has(
      getDateKey(currentDay),
    )
  ) {
    streak += 1;

    currentDay.setDate(
      currentDay.getDate() - 1,
    );
  }

  return streak;
}

export function getSessionDurationSeconds(
  session: StoredWorkoutSession,
): number {
  const start =
    getValidTimestamp(
      session.startedAt,
    );

  const end =
    getValidTimestamp(
      session.completedAt,
    );

  if (
    start === null ||
    end === null ||
    end < start
  ) {
    return 0;
  }

  return Math.floor(
    (end - start) / 1000,
  );
}

export function getSessionVolume(
  session: StoredWorkoutSession,
): number {
  let volume = 0;

  for (const exercise of session.exercises) {
    for (const set of exercise.sets) {
      if (!set.completed) {
        continue;
      }

      volume +=
        set.weight * set.reps;
    }
  }

  return volume;
}

export function calculateOverview(
  sessions: StoredWorkoutSession[],
) {
  let totalVolume = 0;
  let totalTrainingSeconds = 0;

  for (const session of sessions) {
    totalVolume +=
      getSessionVolume(session);

    totalTrainingSeconds +=
      getSessionDurationSeconds(
        session,
      );
  }

  return {
    workouts: sessions.length,

    volume: totalVolume,

    trainingHours:
      Math.round(
        (totalTrainingSeconds /
          3600) *
          10,
      ) / 10,

    streak:
      getCurrentStreak(sessions),
  };
}

export function calculateExerciseStatistics(
  sessions: StoredWorkoutSession[],
): ExerciseStatistic[] {
  const statistics =
    new Map<
      string,
      ExerciseStatistic
    >();

  for (const session of sessions) {
    const seenInWorkout =
      new Set<string>();

    for (const exercise of session.exercises) {
      const exerciseId =
        exercise.exercise.id;

      let completedSets = 0;
      let volume = 0;

      for (const set of exercise.sets) {
        if (!set.completed) {
          continue;
        }

        completedSets += 1;

        volume +=
          set.weight * set.reps;
      }

      if (!statistics.has(exerciseId)) {
        statistics.set(
          exerciseId,
          {
            exerciseId,
            name: exercise.exercise.name,
            workouts: 0,
            sets: 0,
            volume: 0,
          },
        );
      }

      const statistic =
        statistics.get(
          exerciseId,
        )!;

      statistic.sets +=
        completedSets;

      statistic.volume +=
        volume;

      if (completedSets > 0) {
        seenInWorkout.add(
          exerciseId,
        );
      }
    }

    for (const exerciseId of seenInWorkout) {
      const statistic =
        statistics.get(
          exerciseId,
        );

      if (statistic) {
        statistic.workouts += 1;
      }
    }
  }

  return Array.from(
    statistics.values(),
  );
}

export function calculateWeeklyActivity(
  sessions: StoredWorkoutSession[],
  weeks = 8,
): WeeklyStatistic[] {
  const currentWeek =
    startOfWeek(new Date());

  const weekStarts: Date[] = [];

  for (
    let index = weeks - 1;
    index >= 0;
    index -= 1
  ) {
    const weekStart =
      new Date(currentWeek);

    weekStart.setDate(
      weekStart.getDate() -
        index * 7,
    );

    weekStarts.push(
      weekStart,
    );
  }

  /*
   * Build one map of week -> workout
   * count instead of filtering the entire
   * sessions array once per week.
   */
  const workoutCounts =
    new Map<string, number>();

  for (const session of sessions) {
    const timestamp =
      getValidTimestamp(
        session.completedAt,
      );

    if (timestamp === null) {
      continue;
    }

    const completedAt =
      new Date(timestamp);

    const weekStart =
      startOfWeek(
        completedAt,
      );

    const key =
      getDateKey(
        weekStart,
      );

    workoutCounts.set(
      key,
      (workoutCounts.get(key) ??
        0) + 1,
    );
  }

  return weekStarts.map(
    (weekStart) => {
      const key =
        getDateKey(
          weekStart,
        );

      return {
        label:
          weekStart.toLocaleDateString(
            undefined,
            {
              month: "short",
              day: "numeric",
            },
          ),

        start:
          weekStart.toISOString(),

        workouts:
          workoutCounts.get(key) ??
          0,
      };
    },
  );
}

export function getRoutineDuration(
  exerciseCount: number,
): number {
  return Math.max(
    20,
    exerciseCount * 10,
  );
}