import { database } from "../src/lib/mongodb.js";

import {
  internalServerErrorResponse,
  methodNotAllowedResponse,
  requireSession,
  unauthorizedResponse,
} from "../src/lib/api.js";

import {
  parseRoutineRequestBody,
  validateRoutinePayload,
} from "../src/lib/validation.js";

type StoredRoutine = {
  id: string;
  userId: string;
  name: string;
  exercises: unknown[];
  createdAt: Date;
  updatedAt: Date;
};

const ALLOWED_METHODS = [
  "GET",
  "POST",
  "PATCH",
  "DELETE",
];

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
      const collection =
        database.collection<StoredRoutine>(
          "routines",
        );

      switch (request.method) {
        case "GET": {
          const routines =
            await collection
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
                    createdAt: 1,
                    updatedAt: 1,
                  },
                },
              )
              .sort({
                updatedAt: -1,
              })
              .toArray();

          return Response.json(
            routines,
          );
        }

        case "POST": {
          const rawBody =
            await request.json();

          const parsed =
            parseRoutineRequestBody(
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

          const name =
            parsed.data.name?.trim();

          if (!name) {
            return Response.json(
              {
                error:
                  "A routine name is required.",
              },
              {
                status: 400,
              },
            );
          }

          if (
            !Array.isArray(
              parsed.data.exercises,
            ) ||
            parsed.data.exercises.length ===
              0
          ) {
            return Response.json(
              {
                error:
                  "A routine must contain at least one exercise.",
              },
              {
                status: 400,
              },
            );
          }

          const candidate = {
            id:
              parsed.data.id ??
              `custom-${crypto.randomUUID()}`,
            name,
            exercises:
              parsed.data.exercises,
          };

          const validation =
            validateRoutinePayload(
              candidate,
            );

          if (validation.success === false) {
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

          const now =
            new Date();

          const routine: StoredRoutine =
            {
              ...validation.data,
              userId: user.id,
              createdAt: now,
              updatedAt: now,
            };

          await collection.insertOne(
            routine,
          );

          return Response.json(
            routine,
            {
              status: 201,
            },
          );
        }

        case "PATCH": {
          const rawBody =
            await request.json();

          const parsed =
            parseRoutineRequestBody(
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

          if (!parsed.data.id) {
            return Response.json(
              {
                error:
                  "Routine id is required.",
              },
              {
                status: 400,
              },
            );
          }

          const update: {
            updatedAt: Date;
            name?: string;
            exercises?: unknown[];
          } = {
            updatedAt: new Date(),
          };

          if (
            parsed.data.name !==
            undefined
          ) {
            const name =
              parsed.data.name.trim();

            if (!name) {
              return Response.json(
                {
                  error:
                    "Routine name cannot be empty.",
                },
                {
                  status: 400,
                },
              );
            }

            update.name = name;
          }

          if (
            parsed.data.exercises !==
            undefined
          ) {
            if (
              parsed.data.exercises.length ===
              0
            ) {
              return Response.json(
                {
                  error:
                    "A routine must contain at least one exercise.",
                },
                {
                  status: 400,
                },
              );
            }

            const candidate: RoutineCandidate =
              {
                id:
                  parsed.data.id,
                name:
                  update.name ??
                  "existing",
                exercises:
                  parsed.data.exercises,
              };

            const exercisesValid =
              validateRoutinePayload(
                candidate,
              );

            if (
              exercisesValid.success ===
              false
            ) {
              return Response.json(
                {
                  error:
                    exercisesValid.error,
                },
                {
                  status: 400,
                },
              );
            }

            update.exercises =
              exercisesValid.data
                .exercises;
          }

          if (
            !update.name &&
            !update.exercises
          ) {
            return Response.json(
              {
                error:
                  "At least one routine field must be provided.",
              },
              {
                status: 400,
              },
            );
          }

          const result =
            await collection.updateOne(
              {
                id: parsed.data.id,
                userId: user.id,
              },
              {
                $set: update,
              },
            );

          if (
            result.matchedCount ===
            0
          ) {
            return Response.json(
              {
                error:
                  "Routine not found.",
              },
              {
                status: 404,
              },
            );
          }

          const updatedRoutine =
            await collection.findOne(
              {
                id: parsed.data.id,
                userId: user.id,
              },
            );

          if (!updatedRoutine) {
            return internalServerErrorResponse(
              "Routine could not be loaded after update.",
            );
          }

          return Response.json(
            updatedRoutine,
          );
        }

        case "DELETE": {
          const url =
            new URL(
              request.url,
            );

          const routineId =
            url.searchParams.get(
              "id",
            );

          if (!routineId) {
            return Response.json(
              {
                error:
                  "Routine id is required.",
              },
              {
                status: 400,
              },
            );
          }

          const result =
            await collection.deleteOne(
              {
                id: routineId,
                userId: user.id,
              },
            );

          if (
            result.deletedCount ===
            0
          ) {
            return Response.json(
              {
                error:
                  "Routine not found.",
              },
              {
                status: 404,
              },
            );
          }

          return Response.json({
            success: true,
          });
        }

        default:
          return methodNotAllowedResponse(
            ALLOWED_METHODS,
          );
      }
    } catch (error) {
      console.error(
        "Routine API error:",
        error,
      );

      return internalServerErrorResponse();
    }
  },
};

type RoutineCandidate = {
  id: string;
  name: string;
  exercises: unknown[];
};