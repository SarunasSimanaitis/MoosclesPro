import {
  requireSession,
  unauthorizedResponse,
  methodNotAllowedResponse,
  internalServerErrorResponse,
} from "../src/lib/api.js";

import { database } from "../src/lib/mongodb.js";

import {
  calculateExerciseStatistics,
  calculateOverview,
  calculateWeeklyActivity,
  type StoredWorkoutSession,
} from "../src/lib/workoutStats.js";

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
      const sessions =
        await database
          .collection<StoredWorkoutSession>(
            "workoutSessions",
          )
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
          .toArray();

      const overview =
        calculateOverview(
          sessions,
        );

      const exercises =
        calculateExerciseStatistics(
          sessions,
        );

      const weeklyActivity =
        calculateWeeklyActivity(
          sessions,
          8,
        );

      const topExercises =
        [...exercises]
          .sort(
            (a, b) =>
              b.workouts -
                a.workouts ||
              b.volume -
                a.volume,
          )
          .slice(0, 8);

      const topVolumeExercises =
        [...exercises]
          .sort(
            (a, b) =>
              b.volume -
              a.volume,
          )
          .slice(0, 8);

      return Response.json({
        overview,

        weeklyActivity,

        topExercises,

        topVolumeExercises,
      });
    } catch (error) {
      console.error(
        "Statistics API error:",
        error,
      );

      return internalServerErrorResponse(
        "Failed to load statistics.",
      );
    }
  },
};