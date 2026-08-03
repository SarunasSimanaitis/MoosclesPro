import { routines } from "../data/routines";
import ExerciseCard from "../components/workout/ExerciseCard";

export default function WorkoutSessionPage() {
  const routine = routines[0];

  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="text-4xl font-bold">{routine.name}</h1>

      <p className="mt-2 text-zinc-400">Complete each exercise below.</p>

      <div className="mt-8 space-y-6">
        {routine.exercises.map((routineExercise) => (
          <ExerciseCard
            key={routineExercise.exercise.id}
            exercise={routineExercise.exercise}
          />
        ))}
      </div>
    </main>
  );
}
