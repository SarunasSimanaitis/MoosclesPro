import { useState } from "react";
import type { Exercise } from "../../types/Exercise";
import SetRow from "./SetRow";

type ExerciseCardProps = {
  exercise: Exercise;
};

type Set = {
  completed: boolean;
};

export default function ExerciseCard({ exercise }: ExerciseCardProps) {
  const [sets, setSets] = useState<Set[]>([
    { completed: false },
    { completed: false },
    { completed: false },
  ]);

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