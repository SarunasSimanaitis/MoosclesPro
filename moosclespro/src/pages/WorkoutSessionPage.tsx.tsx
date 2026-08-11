import { useState } from "react";

import ExerciseCard from "../components/workout/ExerciseCard";

import { routines } from "../data/routines";

import type { WorkoutExercise } from "../types/WorkoutExercise";
import type { WorkoutSet } from "../types/WorkoutSet";
import { saveWorkoutSession } from "../utils/workoutStorage";

export default function WorkoutSessionPage() {
  const routine = routines[0];
  const [startedAt] = useState(() => new Date().toISOString());
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>(
    routine.exercises.map((routineExercise) => {
      const sets: WorkoutSet[] = Array.from(
        { length: routineExercise.targetSets },
        (_, index) => ({
          id: crypto.randomUUID(),
          order: index + 1,
          weight: 0,
          reps: 0,
          completed: false,
        }),
      );

      return {
        exercise: routineExercise.exercise,
        targetSets: routineExercise.targetSets,
        targetReps: routineExercise.targetReps,
        restSeconds: routineExercise.restSeconds,
        sets,
      };
    }),
  );

  function updateWeight(exerciseId: string, setId: string, newWeight: number) {
    setWorkoutExercises((previousExercises) =>
      previousExercises.map((exercise) => {
        if (exercise.exercise.id !== exerciseId) {
          return exercise;
        }

        return {
          ...exercise,
          sets: exercise.sets.map((set) => {
            if (set.id !== setId) {
              return set;
            }

            return {
              ...set,
              weight: newWeight,
            };
          }),
        };
      }),
    );
  }

  function updateReps(exerciseId: string, setId: string, newReps: number) {
    setWorkoutExercises((previousExercises) => {
      return previousExercises.map((exercise) => {
        if (exercise.exercise.id !== exerciseId) {
          return exercise;
        }

        return {
          ...exercise,
          sets: exercise.sets.map((set) => {
            if (set.id !== setId) {
              return set;
            }

            return {
              ...set,
              reps: newReps,
            };
          }),
        };
      });
    });
  }

  function updateCompleted(exerciseId: string, setId: string) {
    setWorkoutExercises((previousExercises) =>
      previousExercises.map((exercise) => {
        if (exercise.exercise.id !== exerciseId) {
          return exercise;
        }

        return {
          ...exercise,
          sets: exercise.sets.map((set) => {
            if (set.id !== setId) {
              return set;
            }

            return {
              ...set,
              completed: !set.completed,
            };
          }),
        };
      }),
    );
  }

  function finishWorkout() {
    const completedAt = new Date().toISOString();

    const session = {
      id: crypto.randomUUID(),
      routineId: routine.id,
      startedAt,
      completedAt,
      exercises: workoutExercises,
    };

    saveWorkoutSession(session);
  }

  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="text-4xl font-bold">{routine.name}</h1>

      <p className="mt-2 text-zinc-400">Complete each exercise below.</p>

      <div className="mt-8 space-y-6">
        {workoutExercises.map((workoutExercise) => (
          <ExerciseCard
            key={workoutExercise.exercise.id}
            workoutExercise={workoutExercise}
            updateWeight={updateWeight}
            updateReps={updateReps}
            updateCompleted={updateCompleted}
          />
        ))}
      </div>

      <div className="mt-10 flex justify-end">
        <button
          onClick={finishWorkout}
          className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-indigo-500"
        >
          Finish Workout
        </button>
      </div>
    </main>
  );
}
