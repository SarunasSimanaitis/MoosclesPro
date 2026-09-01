import { auth } from "../src/lib/auth.js";
import { database } from "../src/lib/mongodb.js";

type StoredWorkoutSession = {
  id: string;
  userId: string;
  routineId: string;
  startedAt: string;
  completedAt: string;
  exercises: {
    exercise: {
      id: string;
      name: string;
    };
    sets: {
      weight: number;
      reps: number;
      completed: boolean;
    }[];
  }[];
};

type ExerciseStatistic = {
  exerciseId: string;
  name: string;
  workouts: number;
  sets: number;
  volume: number;
};

type WeeklyStatistic = {
  label: string;
  start: string;
  workouts: number;
};

function startOfDay(date: Date) {
  const result = new Date(date);

  result.setHours(0, 0, 0, 0);

  return result;
}

function startOfWeek(date: Date) {
  const result = startOfDay(date);

  const day = result.getDay();

  const daysSinceMonday =
    day === 0 ? 6 : day - 1;

  result.setDate(
    result.getDate() -
      daysSinceMonday,
  );

  return result;
}

function formatWeekLabel(date: Date) {
  return date.toLocaleDateString(
    undefined,
    {
      month: "short",
      day: "numeric",
    },
  );
}

function getCurrentStreak(
  sessions: StoredWorkoutSession[],
) {
  if (sessions.length === 0) {
    return 0;
  }

  const workoutDays = new Set(
    sessions.map((session) => {
      const date = new Date(
        session.completedAt,
      );

      return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    }),
  );

  const today = startOfDay(
    new Date(),
  );

  let currentDay = today;
  let streak = 0;

  const getKey = (date: Date) =>
    `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

  if (!workoutDays.has(getKey(currentDay))) {
    currentDay.setDate(
      currentDay.getDate() - 1,
    );
  }

  while (
    workoutDays.has(
      getKey(currentDay),
    )
  ) {
    streak += 1;

    currentDay.setDate(
      currentDay.getDate() - 1,
    );
  }

  return streak;
}

export default {
  async fetch(request: Request) {
    if (request.method !== "GET") {
      return new Response(
        "Method Not Allowed",
        {
          status: 405,
          headers: {
            Allow: "GET",
          },
        },
      );
    }

    const session =
      await auth.api.getSession({
        headers: request.headers,
      });

    if (!session?.user) {
      return Response.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    try {
      const sessions =
        await database
          .collection<StoredWorkoutSession>(
            "workoutSessions",
          )
          .find({
            userId: session.user.id,
          })
          .sort({
            completedAt: -1,
          })
          .toArray();

      let totalVolume = 0;
      let totalTrainingSeconds = 0;

      const exerciseMap =
        new Map<
          string,
          ExerciseStatistic
        >();

      for (const workout of sessions) {
        const start = new Date(
          workout.startedAt,
        ).getTime();

        const end = new Date(
          workout.completedAt,
        ).getTime();

        if (
          Number.isFinite(start) &&
          Number.isFinite(end) &&
          end >= start
        ) {
          totalTrainingSeconds +=
            Math.floor(
              (end - start) / 1000,
            );
        }

        const exercisesSeenInWorkout =
          new Set<string>();

        for (const exercise of workout.exercises) {
          let exerciseVolume = 0;
          let completedSets = 0;

          for (const set of exercise.sets) {
            if (!set.completed) {
              continue;
            }

            completedSets += 1;

            const setVolume =
              set.weight * set.reps;

            exerciseVolume += setVolume;
            totalVolume += setVolume;
          }

          const exerciseId =
            exercise.exercise.id;

          const existing =
            exerciseMap.get(
              exerciseId,
            );

          if (existing) {
            existing.sets +=
              completedSets;
            existing.volume +=
              exerciseVolume;
          } else {
            exerciseMap.set(
              exerciseId,
              {
                exerciseId,
                name: exercise.exercise.name,
                workouts: 0,
                sets: completedSets,
                volume: exerciseVolume,
              },
            );
          }

          if (
            completedSets > 0
          ) {
            exercisesSeenInWorkout.add(
              exerciseId,
            );
          }
        }

        for (const exerciseId of exercisesSeenInWorkout) {
          const statistic =
            exerciseMap.get(
              exerciseId,
            );

          if (statistic) {
            statistic.workouts += 1;
          }
        }
      }

      const currentStreak =
        getCurrentStreak(sessions);

      const trainingHours =
        Math.round(
          (totalTrainingSeconds /
            3600) *
            10,
        ) / 10;

      /*
       * Last 8 weeks.
       */
      const currentWeek =
        startOfWeek(new Date());

      const weeklyActivity: WeeklyStatistic[] =
        [];

      for (let index = 7; index >= 0; index -= 1) {
        const weekStart =
          new Date(currentWeek);

        weekStart.setDate(
          weekStart.getDate() -
            index * 7,
        );

        const nextWeekStart =
          new Date(weekStart);

        nextWeekStart.setDate(
          nextWeekStart.getDate() + 7,
        );

        const workouts =
          sessions.filter(
            (workout) => {
              const completedAt =
                new Date(
                  workout.completedAt,
                ).getTime();

              return (
                completedAt >=
                  weekStart.getTime() &&
                completedAt <
                  nextWeekStart.getTime()
              );
            },
          ).length;

        weeklyActivity.push({
          label:
            formatWeekLabel(
              weekStart,
            ),
          start:
            weekStart.toISOString(),
          workouts,
        });
      }

      const exercises =
        Array.from(
          exerciseMap.values(),
        )
          .sort(
            (a, b) =>
              b.workouts -
                a.workouts ||
              b.volume - a.volume,
          );

      const topExercises =
        exercises.slice(0, 8);

      const topVolumeExercises =
        [...exercises]
          .sort(
            (a, b) =>
              b.volume - a.volume,
          )
          .slice(0, 8);

      return Response.json({
        overview: {
          workouts:
            sessions.length,
          volume: totalVolume,
          trainingHours,
          streak: currentStreak,
        },

        weeklyActivity,

        topExercises,

        topVolumeExercises,
      });
    } catch (error) {
      console.error(
        "Statistics API error:",
        error,
      );

      return Response.json(
        {
          error:
            "Failed to load statistics.",
        },
        {
          status: 500,
        },
      );
    }
  },
};