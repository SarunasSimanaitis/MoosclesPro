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

  let streak = 0;
  let currentDay = today;

  /*
   * If the user hasn't trained today,
   * allow the streak to continue from yesterday.
   */
  if (!workoutDays.has(getDateKey(currentDay))) {
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

    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 },
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
        getCurrentStreak(workoutSessions);

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

      const trainingHours = Math.round(
        (totalTrainingSeconds / 3600) *
          10,
      ) / 10;

      return Response.json({
        stats: {
          streak: currentStreak,
          workouts,
          volume: totalVolume,
          hours: trainingHours,
        },
        weeklyGoal: {
          completed: weeklyWorkouts,
          target: 5,
        },
      });
    } catch (error) {
      console.error(
        "Dashboard API error:",
        error,
      );

      return Response.json(
        {
          error:
            "Failed to load dashboard statistics.",
        },
        { status: 500 },
      );
    }
  },
};