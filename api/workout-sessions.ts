import { database } from "../src/lib/mongodb.js";

import {
  internalServerErrorResponse,
  methodNotAllowedResponse,
  requireSession,
  unauthorizedResponse,
} from "../src/lib/api.js";

type WorkoutSessionBody = {
  id?: string;
  routineId?: string;
  startedAt?: string;
  completedAt?: string;
  exercises?: unknown[];
};

type StoredWorkoutSession = {
  id: string;
  userId: string;
  routineId: string;
  startedAt: string;
  completedAt: string;
  exercises: unknown[];
  createdAt: Date;
};

const ALLOWED_METHODS = [
  "GET",
  "POST",
];

export default {
  async fetch(request: Request) {
    const authResult =
      await requireSession(request);

    if (!authResult) {
      return unauthorizedResponse();
    }

    const { user } = authResult;

    try {
      const collection =
        database.collection<StoredWorkoutSession>(
          "workoutSessions",
        );

      switch (request.method) {
        case "GET": {
          const sessions =
            await collection
              .find({
                userId: user.id,
              })
              .sort({
                completedAt: -1,
              })
              .toArray();

          return Response.json(
            sessions,
          );
        }

        case "POST": {
          const body =
            (await request.json()) as WorkoutSessionBody;

          if (
            !body.routineId ||
            !body.startedAt ||
            !body.completedAt ||
            !Array.isArray(
              body.exercises,
            )
          ) {
            return Response.json(
              {
                error:
                  "Invalid workout session.",
              },
              {
                status: 400,
              },
            );
          }

          const startedAt =
            new Date(body.startedAt);

          const completedAt =
            new Date(
              body.completedAt,
            );

          if (
            !Number.isFinite(
              startedAt.getTime(),
            ) ||
            !Number.isFinite(
              completedAt.getTime(),
            )
          ) {
            return Response.json(
              {
                error:
                  "Workout timestamps are invalid.",
              },
              {
                status: 400,
              },
            );
          }

          if (
            completedAt.getTime() <
            startedAt.getTime()
          ) {
            return Response.json(
              {
                error:
                  "Workout completion time cannot be earlier than its start time.",
              },
              {
                status: 400,
              },
            );
          }

          const workoutSession: StoredWorkoutSession =
            {
              id:
                body.id ??
                crypto.randomUUID(),

              userId: user.id,

              routineId:
                body.routineId,

              startedAt:
                body.startedAt,

              completedAt:
                body.completedAt,

              exercises:
                body.exercises,

              createdAt:
                new Date(),
            };

          await collection.insertOne(
            workoutSession,
          );

          return Response.json(
            workoutSession,
            {
              status: 201,
            },
          );
        }

        default:
          return methodNotAllowedResponse(
            ALLOWED_METHODS,
          );
      }
    } catch (error) {
      console.error(
        "Workout session API error:",
        error,
      );

      return internalServerErrorResponse();
    }
  },
};