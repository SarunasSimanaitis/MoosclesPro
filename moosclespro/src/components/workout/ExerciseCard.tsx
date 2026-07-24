import type { Exercise } from "../../types/Exercise";
import SetRow from "./SetRow";

type ExerciseCardProps = {
  exercise: Exercise;
};

export default function ExerciseCard({ exercise }: ExerciseCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      <div className="mb-5">
        <h2 className="text-xl font-semibold">{exercise.name}</h2>

        <p className="text-sm text-zinc-500">
          {exercise.muscleGroup} • {exercise.equipment}
        </p>
      </div>

      <div className="space-y-3">
        <SetRow setNumber={1} />
        <SetRow setNumber={2} />
        <SetRow setNumber={3} />
      </div>
    </div>
  );
}