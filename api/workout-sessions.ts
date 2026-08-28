import { auth } from "../src/lib/auth.js";
import { database } from "../src/lib/mongodb.js";

type WorkoutSessionBody = {
  id?: string;
  routineId?: string;
  startedAt?: string;
  completedAt?: string;
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

    const collection =
      database.collection("workoutSessions");

    try {
      if (request.method === "GET") {
        const sessions =
          await collection
            .find({
              userId: session.user.id,
            })
            .sort({
              completedAt: -1,
            })
            .toArray();

        return Response.json(sessions);
      }

      if (request.method === "POST") {
        const body =
          (await request.json()) as WorkoutSessionBody;

        if (
          !body.routineId ||
          !body.startedAt ||
          !body.completedAt ||
          !Array.isArray(body.exercises)
        ) {
          return Response.json(
            {
              error:
                "Invalid workout session.",
            },
            { status: 400 },
          );
        }

        const workoutSession = {
          id:
            body.id ??
            crypto.randomUUID(),
          userId: session.user.id,
          routineId: body.routineId,
          startedAt: body.startedAt,
          completedAt: body.completedAt,
          exercises: body.exercises,
          createdAt: new Date(),
        };

        await collection.insertOne(
          workoutSession,
        );

        return Response.json(
          workoutSession,
          { status: 201 },
        );
      }

      return new Response(
        "Method Not Allowed",
        {
          status: 405,
          headers: {
            Allow: "GET, POST",
          },
        },
      );
    } catch (error) {
      console.error(
        "Workout session API error:",
        error,
      );

      return Response.json(
        {
          error: "Internal server error.",
        },
        { status: 500 },
      );
    }
  },
};