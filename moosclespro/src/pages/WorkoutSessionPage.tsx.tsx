import { useState } from "react";

import { routines } from "../data/routines";

import ExerciseCard from "../components/workout/ExerciseCard";

import type { WorkoutExercise } from "../types/WorkoutExercise";
import type { WorkoutSet } from "../types/WorkoutSet";

export default function WorkoutSessionPage() {
  const routine = routines[0];

  const [workoutExercises] = useState<WorkoutExercise[]>(
    routine.exercises.map((routineExercise) => ({
      exercise: routineExercise.exercise,

      sets: Array.from(
        { length: routineExercise.targetSets },
        (_, index): WorkoutSet => ({
          id: crypto.randomUUID(),
          order: index + 1,
          weight: 0,
          reps: 0,
          completed: false,
        })
      ),
    }))
  );

  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="text-4xl font-bold">
        {routine.name}
      </h1>

      <p className="mt-2 text-zinc-400">
        Complete each exercise below.
      </p>

      <div className="mt-8 space-y-6">
        {workoutExercises.map((workoutExercise, index) => (
          <ExerciseCard
            key={workoutExercise.exercise.id}
            routineExercise={routine.exercises[index]}
          />
        ))}
      </div>

      <div className="mt-10 flex justify-end">
        <button className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-indigo-500">
          Finish Workout
        </button>
      </div>
    </main>
  );
}