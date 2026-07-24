import { routines } from "../data/routines";

export default function WorkoutSessionPage() {
  const routine = routines[0];

  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="text-4xl font-bold">{routine.name}</h1>

      <p className="mt-2 text-zinc-400">
        Complete each exercise below.
      </p>

      <div className="mt-8 space-y-6">
        {routine.exercises.map((exercise) => (
          <div
            key={exercise.id}
            className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
          >
            <h2 className="text-xl font-semibold">{exercise.name}</h2>

            <p className="mt-1 text-sm text-zinc-500">
              {exercise.muscleGroup} • {exercise.equipment}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}