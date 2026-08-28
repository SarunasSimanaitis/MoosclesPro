import type { WorkoutSession } from "../types/WorkoutSession";

export async function getWorkoutSessions(): Promise<
  WorkoutSession[]
> {
  const response = await fetch(
    "/api/workout-sessions",
    {
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error(
      "Failed to load workout sessions.",
    );
  }

  return (await response.json()) as WorkoutSession[];
}

export async function saveWorkoutSession(
  session: WorkoutSession,
): Promise<WorkoutSession> {
  const response = await fetch(
    "/api/workout-sessions",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      credentials: "include",
      body: JSON.stringify(session),
    },
  );

  if (!response.ok) {
    let message =
      "Failed to save workout session.";

    try {
      const result =
        (await response.json()) as {
          error?: string;
        };

      if (result.error) {
        message = result.error;
      }
    } catch {
      // Keep default error message.
    }

    throw new Error(message);
  }

  return (await response.json()) as WorkoutSession;
}