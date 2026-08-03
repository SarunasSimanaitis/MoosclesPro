import { useState } from "react";
import type { RoutineExercise } from "../../types/RoutineExercise";
import SetRow from "./SetRow";

type ExerciseCardProps = {
  routineExercise: RoutineExercise;
};

type Set = {
  completed: boolean;
};

export default function ExerciseCard({
  routineExercise,
}: ExerciseCardProps) {
  const { exercise, targetSets, targetReps, restSeconds } = routineExercise;

  const [sets, setSets] = useState<Set[]>(
    Array.from({ length: targetSets }, () => ({
      completed: false,
    }))
  );

  const toggleSet = (index: number) => {
    setSets((previousSets) =>
      previousSets.map((set, i) =>
        i === index
          ? { ...set, completed: !set.completed }
          : set
      )
    );
  };

  const completedSets = sets.filter((set) => set.completed).length;
  const isCompleted = completedSets === sets.length;

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">{exercise.name}</h2>

          <p className="text-sm text-zinc-500">
            {exercise.muscleGroup} • {exercise.equipment}
          </p>

          <p className="mt-2 text-sm text-indigo-400">
            {targetSets} sets • {targetReps} reps • {restSeconds}s rest
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-sm font-medium ${
            isCompleted
              ? "bg-green-500/20 text-green-400"
              : "bg-zinc-800 text-zinc-400"
          }`}
        >
          {completedSets}/{sets.length}
        </span>
      </div>

      <div className="space-y-3">
        {sets.map((set, index) => (
          <SetRow
            key={index}
            setNumber={index + 1}
            completed={set.completed}
            onToggle={() => toggleSet(index)}
          />
        ))}
      </div>
    </div>
  );
}