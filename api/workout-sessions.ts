import { database, ensureWorkoutIndexes } from "../src/lib/mongodb.js";
import type { WorkoutSession } from "../src/types/WorkoutSession.js";

import {
  internalServerErrorResponse,
  methodNotAllowedResponse,
  requireSession,
  unauthorizedResponse,
} from "../src/lib/api.js";

import {
  parseWorkoutSessionRequestBody,
  validateWorkoutSessionPayload,
} from "../src/lib/validation.js";
import {
  hasCompletedWork,
  isCountableSession,
} from "../src/lib/workoutStats.js";

type StoredWorkoutSession = WorkoutSession & {
  userId: string;
  createdAt: Date;
};

const ALLOWED_METHODS = [
  "GET",
  "POST",
];

export const runtime = "nodejs";

export default {
  async fetch(request: Request) {
    const authResult =
      await requireSession(
        request,
      );

    if (!authResult) {
      return unauthorizedResponse();
    }

    const { user } = authResult;

    try {
      await ensureWorkoutIndexes();
      const collection =
        database.collection<StoredWorkoutSession>(
          "workoutSessions",
        );

      switch (request.method) {
        case "GET": {
          const url = new URL(request.url);
          const sessionId = url.searchParams.get("id");
          const routineId = url.searchParams.get("routineId");

          if (sessionId) {
            const session =
              await collection.findOne(
                {
                  id: sessionId,
                  userId: user.id,
                },
                {
                  projection: {
                    _id: 0,
                    id: 1,
                    routineId: 1,
                    startedAt: 1,
                    completedAt: 1,
                    exercises: 1,
                    createdAt: 1,
                  },
                },
              );

            if (!session || !isCountableSession(session)) {
              return Response.json(
                {
                  error:
                    "Workout session not found.",
                },
                {
                  status: 404,
                },
              );
            }

            return Response.json(
              session,
            );
          }

          if (routineId) {
            const latest = await collection
              .find(
                {
                  userId: user.id,
                  routineId,
                  "exercises.sets.completed": true,
                },
                {
                  projection: {
                    _id: 0,
                    id: 1,
                    routineId: 1,
                    startedAt: 1,
                    completedAt: 1,
                    exercises: 1,
                    createdAt: 1,
                  },
                },
              )
              .sort({ completedAt: -1 })
              .limit(1)
              .next();

            return Response.json(
              latest && isCountableSession(latest)
                ? latest
                : null,
            );
          }

          const cursor = collection
            .find(
              {
                userId: user.id,
                "exercises.sets.completed": true,
              },
              {
                projection: {
                  _id: 0,
                  id: 1,
                  routineId: 1,
                  startedAt: 1,
                  completedAt: 1,
                  exercises: 1,
                  createdAt: 1,
                },
              },
            )
            .sort({ completedAt: -1 });
          const requestedLimit = url.searchParams.get("limit");
          const sessions = await (
            requestedLimit === "all"
              ? cursor
              : cursor.limit(Math.min(
                200,
                Math.max(
                  1,
                  Number.parseInt(requestedLimit ?? "100", 10) || 100,
                ),
              ))
          ).toArray();

          return Response.json(
            sessions.filter(isCountableSession),
          );
        }

        case "POST": {
          const rawBody =
            await request.json();

          const parsed =
            parseWorkoutSessionRequestBody(
              rawBody,
            );

          if (parsed.success === false) {
            return Response.json(
              {
                error: parsed.error,
              },
              {
                status: 400,
              },
            );
          }

          const {
            routineId,
            startedAt,
            completedAt,
            exercises,
          } = parsed.data;

          if (
            !routineId ||
            !startedAt ||
            !completedAt ||
            !Array.isArray(
              exercises,
            )
          ) {
            return Response.json(
              {
                error:
                  "Routine, timestamps, and exercises are required.",
              },
              {
                status: 400,
              },
            );
          }

          const startTime =
            new Date(
              startedAt,
            ).getTime();

          const endTime =
            new Date(
              completedAt,
            ).getTime();

          if (
            endTime <
            startTime
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

          const candidate = {
            id:
              parsed.data.id ??
              crypto.randomUUID(),
            routineId,
            startedAt,
            completedAt,
            exercises,
          };

          const validation =
            validateWorkoutSessionPayload(
              candidate,
            );

          if (
            validation.success ===
            false
          ) {
            return Response.json(
              {
                error:
                  validation.error,
              },
              {
                status: 400,
              },
            );
          }

          if (!hasCompletedWork(validation.data)) {
            return Response.json(
              {
                error: "Complete at least one set before saving a workout.",
              },
              {
                status: 400,
              },
            );
          }

          const workoutSession: StoredWorkoutSession =
            {
              ...validation.data,
              userId: user.id,
              createdAt:
                new Date(),
            };

          const existingSession =
            await collection.findOne(
              {
                id: workoutSession.id,
                userId: user.id,
              },
              {
                projection: {
                  _id: 0,
                  id: 1,
                  routineId: 1,
                  startedAt: 1,
                  completedAt: 1,
                  exercises: 1,
                  createdAt: 1,
                },
              },
            );

          if (existingSession) {
            return Response.json(
              existingSession,
            );
          }

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
