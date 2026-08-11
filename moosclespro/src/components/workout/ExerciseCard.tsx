import type { WorkoutExercise } from "../../types/WorkoutExercise";
import SetRow from "./SetRow";

type ExerciseCardProps = {
  workoutExercise: WorkoutExercise;
  updateWeight: (exerciseId: string, setId: string, newWeight: number) => void;
  updateReps: (exerciseId: string, setId: string, newReps: number) => void;
  updateCompleted: (exerciseId: string, setId: string) => void;
};

export default function ExerciseCard({
  workoutExercise,
  updateWeight,
  updateReps,
  updateCompleted,
}: ExerciseCardProps) {
  const { exercise, targetSets, targetReps, restSeconds, sets } =
    workoutExercise;

  const completedSets = sets.filter((set) => set.completed).length;
  const isCompleted = completedSets === sets.length;

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm">
      {/* Header */}

      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">{exercise.name}</h2>

          <p className="mt-1 text-sm text-zinc-500">
            {exercise.muscleGroup} • {exercise.equipment}
          </p>

          <p className="mt-3 text-sm font-medium text-indigo-400">
            {targetSets} sets • {targetReps} reps • {restSeconds}s rest
          </p>
        </div>

        <div
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            isCompleted
              ? "bg-green-500/20 text-green-400"
              : "bg-zinc-800 text-zinc-400"
          }`}
        >
          {completedSets}/{sets.length}
        </div>
      </div>

      {/* Table Header */}

      <div className="mb-3 grid grid-cols-[60px_1fr_1fr_70px] gap-4 px-4 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
        <div className="text-center">Set</div>
        <div className="text-center">Weight</div>
        <div className="text-center">Reps</div>
        <div className="text-center">Done</div>
      </div>

      {/* Rows */}

      <div className="space-y-3">
        {sets.map((set) => (
          <SetRow
            key={set.id}
            workoutSet={set}
            onToggle={() => updateCompleted(exercise.id, set.id)}
            onWeightChange={(weight) =>
              updateWeight(exercise.id, set.id, weight)
            }
            onRepsChange={(reps) => updateReps(exercise.id, set.id, reps)}
          />
        ))}
      </div>
    </div>
  );
}
