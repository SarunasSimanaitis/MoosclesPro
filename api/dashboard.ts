import { auth } from "../src/lib/auth.js";
import { database } from "../src/lib/mongodb.js";

type StoredWorkoutSession = {
  id: string;
  userId: string;
  routineId: string;
  startedAt: string;
  completedAt: string;
  exercises: {
    sets: {
      weight: number;
      reps: number;
      completed: boolean;
    }[];
  }[];
};

type StoredRoutine = {
  id: string;
  userId: string;
  name: string;
  exercises: unknown[];
};

function startOfDay(date: Date) {
  const result = new Date(date);

  result.setHours(0, 0, 0, 0);

  return result;
}

function getDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(
    date.getMonth() + 1,
  ).padStart(2, "0");
  const day = String(
    date.getDate(),
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getCurrentStreak(
  sessions: StoredWorkoutSession[],
) {
  if (sessions.length === 0) {
    return 0;
  }

  const workoutDays = new Set(
    sessions.map((session) =>
      getDateKey(
        new Date(session.completedAt),
      ),
    ),
  );

  const today = startOfDay(new Date());

  let currentDay = today;
  let streak = 0;

  /*
   * If the user hasn't trained today,
   * continue the streak from yesterday.
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

function getWeekStart(date: Date) {
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

function getRoutineDuration(
  exerciseCount: number,
) {
  /*
   * Temporary estimate until routines have
   * their own duration metadata.
   */
  return Math.max(
    20,
    exerciseCount * 10,
  );
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
      const workoutSessions =
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

      const userRoutines =
        await database
          .collection<StoredRoutine>(
            "routines",
          )
          .find({
            userId: session.user.id,
          })
          .sort({
            updatedAt: -1,
          })
          .toArray();

      const workouts =
        workoutSessions.length;

      let totalVolume = 0;
      let totalTrainingSeconds = 0;

      for (const workout of workoutSessions) {
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

        for (const exercise of workout.exercises) {
          for (const set of exercise.sets) {
            if (!set.completed) {
              continue;
            }

            totalVolume +=
              set.weight * set.reps;
          }
        }
      }

      const currentStreak =
        getCurrentStreak(
          workoutSessions,
        );

      const weekStart =
        getWeekStart(new Date());

      const weeklyWorkouts =
        workoutSessions.filter(
          (workout) =>
            new Date(
              workout.completedAt,
            ).getTime() >=
            weekStart.getTime(),
        ).length;

      const trainingHours =
        Math.round(
          (totalTrainingSeconds /
            3600) *
            10,
        ) / 10;

      /*
       * Select today's workout.
       *
       * Prefer the routine from the most
       * recently completed workout.
       *
       * If the user has never completed a
       * workout, fall back to the most recently
       * updated custom routine.
       */
      let todayWorkout:
        | {
            routineId: string;
            title: string;
            duration: string;
            exercises: number;
          }
        | null = null;

      const mostRecentWorkout =
        workoutSessions[0];

      const recentRoutine =
        mostRecentWorkout
          ? userRoutines.find(
              (routine) =>
                routine.id ===
                mostRecentWorkout.routineId,
            )
          : undefined;

      const selectedRoutine =
        recentRoutine ??
        userRoutines[0];

      if (selectedRoutine) {
        const exerciseCount =
          selectedRoutine.exercises
            .length;

        const duration =
          getRoutineDuration(
            exerciseCount,
          );

        todayWorkout = {
          routineId:
            selectedRoutine.id,
          title:
            selectedRoutine.name,
          duration: `${duration} min`,
          exercises:
            exerciseCount,
        };
      }

      return Response.json({
        stats: {
          streak: currentStreak,
          workouts,
          volume: totalVolume,
          hours: trainingHours,
        },

        weeklyGoal: {
          completed:
            weeklyWorkouts,
          target: 5,
        },

        todayWorkout,
      });
    } catch (error) {
      console.error(
        "Dashboard API error:",
        error,
      );

      return Response.json(
        {
          error:
            "Failed to load dashboard data.",
        },
        {
          status: 500,
        },
      );
    }
  },
};