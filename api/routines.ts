import { auth } from "../src/lib/auth.js";
import { database } from "../src/lib/mongodb.js";

type RoutineRequestBody = {
  id?: string;
  name?: string;
  exercises?: unknown[];
};

export default {
  async fetch(request: Request) {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const routinesCollection =
      database.collection("routines");

    try {
      if (request.method === "GET") {
        const routines =
          await routinesCollection
            .find({
              userId: session.user.id,
            })
            .sort({ createdAt: -1 })
            .toArray();

        return Response.json(routines);
      }

      if (request.method === "POST") {
        const body =
          (await request.json()) as RoutineRequestBody;

        if (
          !body.name?.trim() ||
          !Array.isArray(body.exercises) ||
          body.exercises.length === 0
        ) {
          return Response.json(
            {
              error:
                "A routine name and at least one exercise are required.",
            },
            { status: 400 },
          );
        }

        const routine = {
          id:
            body.id ??
            `custom-${crypto.randomUUID()}`,
          userId: session.user.id,
          name: body.name.trim(),
          exercises: body.exercises,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await routinesCollection.insertOne(
          routine,
        );

        return Response.json(routine, {
          status: 201,
        });
      }

      if (request.method === "PATCH") {
        const body =
          (await request.json()) as RoutineRequestBody;

        if (!body.id) {
          return Response.json(
            { error: "Routine id is required." },
            { status: 400 },
          );
        }

        const update: {
          name?: string;
          exercises?: unknown[];
          updatedAt: Date;
        } = {
          updatedAt: new Date(),
        };

        if (typeof body.name === "string") {
          update.name = body.name.trim();
        }

        if (Array.isArray(body.exercises)) {
          update.exercises =
            body.exercises;
        }

        const result =
          await routinesCollection.updateOne(
            {
              id: body.id,
              userId: session.user.id,
            },
            {
              $set: update,
            },
          );

        if (result.matchedCount === 0) {
          return Response.json(
            { error: "Routine not found." },
            { status: 404 },
          );
        }

        const updatedRoutine =
          await routinesCollection.findOne({
            id: body.id,
            userId: session.user.id,
          });

        return Response.json(updatedRoutine);
      }

      if (request.method === "DELETE") {
        const url = new URL(request.url);
        const routineId =
          url.searchParams.get("id");

        if (!routineId) {
          return Response.json(
            { error: "Routine id is required." },
            { status: 400 },
          );
        }

        const result =
          await routinesCollection.deleteOne({
            id: routineId,
            userId: session.user.id,
          });

        if (result.deletedCount === 0) {
          return Response.json(
            { error: "Routine not found." },
            { status: 404 },
          );
        }

        return Response.json({
          success: true,
        });
      }

      return new Response(
        "Method Not Allowed",
        {
          status: 405,
          headers: {
            Allow: "GET, POST, PATCH, DELETE",
          },
        },
      );
    } catch (error) {
      console.error(
        "Routine API error:",
        error,
      );

      return Response.json(
        { error: "Internal server error." },
        { status: 500 },
      );
    }
  },
};