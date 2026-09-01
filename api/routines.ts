import { database } from "../src/lib/mongodb.js";

import {
  internalServerErrorResponse,
  methodNotAllowedResponse,
  requireSession,
  unauthorizedResponse,
} from "../src/lib/api.js";

type RoutineRequestBody = {
  id?: string;
  name?: string;
  exercises?: unknown[];
};

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
      await requireSession(request);

    if (!authResult) {
      return unauthorizedResponse();
    }

    const { user } = authResult;

    try {
      const routinesCollection =
        database.collection<StoredRoutine>(
          "routines",
        );

      switch (request.method) {
        case "GET": {
          const routines =
            await routinesCollection
              .find({
                userId: user.id,
              })
              .sort({
                updatedAt: -1,
              })
              .toArray();

          return Response.json(
            routines,
          );
        }

        case "POST": {
          const body =
            (await request.json()) as RoutineRequestBody;

          const name =
            body.name?.trim();

          if (
            !name ||
            !Array.isArray(
              body.exercises,
            ) ||
            body.exercises.length ===
              0
          ) {
            return Response.json(
              {
                error:
                  "A routine name and at least one exercise are required.",
              },
              {
                status: 400,
              },
            );
          }

          const now = new Date();

          const routine: StoredRoutine = {
            id:
              body.id ??
              `custom-${crypto.randomUUID()}`,

            userId: user.id,

            name,

            exercises:
              body.exercises,

            createdAt: now,
            updatedAt: now,
          };

          await routinesCollection.insertOne(
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
          const body =
            (await request.json()) as RoutineRequestBody;

          if (!body.id) {
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
            typeof body.name ===
            "string"
          ) {
            const name =
              body.name.trim();

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
            Array.isArray(
              body.exercises,
            )
          ) {
            if (
              body.exercises.length ===
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

            update.exercises =
              body.exercises;
          }

          const result =
            await routinesCollection.updateOne(
              {
                id: body.id,
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
            await routinesCollection.findOne(
              {
                id: body.id,
                userId: user.id,
              },
            );

          if (!updatedRoutine) {
            return Response.json(
              {
                error:
                  "Routine could not be loaded after update.",
              },
              {
                status: 500,
              },
            );
          }

          return Response.json(
            updatedRoutine,
          );
        }

        case "DELETE": {
          const url = new URL(
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
            await routinesCollection.deleteOne(
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