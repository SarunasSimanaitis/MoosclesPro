import {
  requireSession,
  unauthorizedResponse,
  methodNotAllowedResponse,
  internalServerErrorResponse,
} from "../src/lib/api.js";

import { database } from "../src/lib/mongodb.js";

import {
  calculateOverview,
  getRoutineDuration,
  type StoredWorkoutSession,
} from "../src/lib/workoutStats.js";

type StoredRoutine = {
  id: string;
  userId: string;
  name: string;
  exercises: unknown[];
  updatedAt: Date;
};

const ALLOWED_METHODS = [
  "GET",
];

export default {
  async fetch(request: Request) {
    if (request.method !== "GET") {
      return methodNotAllowedResponse(
        ALLOWED_METHODS,
      );
    }

    const authResult =
      await requireSession(
        request,
      );

    if (!authResult) {
      return unauthorizedResponse();
    }

    const { user } = authResult;

    try {
      const sessionsCollection =
        database.collection<StoredWorkoutSession>(
          "workoutSessions",
        );

      const routinesCollection =
        database.collection<StoredRoutine>(
          "routines",
        );

      /*
       * These queries are independent,
       * so don't wait for them sequentially.
       */
      const [
        workoutSessions,
        userRoutines,
      ] = await Promise.all([
        sessionsCollection
          .find(
            {
              userId: user.id,
            },
            {
              projection: {
                _id: 0,
                id: 1,
                userId: 1,
                routineId: 1,
                startedAt: 1,
                completedAt: 1,
                exercises: 1,
              },
            },
          )
          .sort({
            completedAt: -1,
          })
          .toArray(),

        routinesCollection
          .find(
            {
              userId: user.id,
            },
            {
              projection: {
                _id: 0,
                id: 1,
                userId: 1,
                name: 1,
                exercises: 1,
                updatedAt: 1,
              },
            },
          )
          .sort({
            updatedAt: -1,
          })
          .toArray(),
      ]);

      const overview =
        calculateOverview(
          workoutSessions,
        );

      /*
       * Prefer the routine from the most
       * recently completed workout.
       * Otherwise use the user's most
       * recently updated custom routine.
       */
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

      const todayWorkout =
        selectedRoutine
          ? {
              routineId:
                selectedRoutine.id,

              title:
                selectedRoutine.name,

              duration: `${getRoutineDuration(
                selectedRoutine
                  .exercises.length,
              )} min`,

              exercises:
                selectedRoutine
                  .exercises.length,
            }
          : null;

      const weekStart =
        getMondayStart(new Date());

      const weeklyWorkouts =
        workoutSessions.filter(
          (workout) => {
            const completedAt =
              new Date(
                workout.completedAt,
              ).getTime();

            return (
              Number.isFinite(
                completedAt,
              ) &&
              completedAt >=
                weekStart.getTime()
            );
          },
        ).length;

      return Response.json({
        stats: {
          streak:
            overview.streak,

          workouts:
            overview.workouts,

          volume:
            overview.volume,

          hours:
            overview.trainingHours,
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

      return internalServerErrorResponse(
        "Failed to load dashboard data.",
      );
    }
  },
};

function getMondayStart(
  date: Date,
): Date {
  const result =
    new Date(date);

  result.setHours(
    0,
    0,
    0,
    0,
  );

  const day =
    result.getDay();

  const daysSinceMonday =
    day === 0 ? 6 : day - 1;

  result.setDate(
    result.getDate() -
      daysSinceMonday,
  );

  return result;
}