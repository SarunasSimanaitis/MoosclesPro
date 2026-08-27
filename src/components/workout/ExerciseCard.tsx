import { CheckCircle2, Circle } from "lucide-react";
import type { WorkoutExercise } from "../../types/WorkoutExercise";
import SetRow from "./SetRow";

type ExerciseCardProps = {
  workoutExercise: WorkoutExercise;
  updateWeight: (
    exerciseId: string,
    setId: string,
    newWeight: number,
  ) => void;
  updateReps: (
    exerciseId: string,
    setId: string,
    newReps: number,
  ) => void;
  updateCompleted: (
    exerciseId: string,
    setId: string,
  ) => void;
};

export default function ExerciseCard({
  workoutExercise,
  updateWeight,
  updateReps,
  updateCompleted,
}: ExerciseCardProps) {
  const {
    exercise,
    targetSets,
    targetReps,
    restSeconds,
    sets,
  } = workoutExercise;

  const completedSets = sets.filter(
    (set) => set.completed,
  ).length;

  const isCompleted =
    sets.length > 0 && completedSets === sets.length;

  return (
    <article className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm md:p-7">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
        <div>
          <div className="flex items-center gap-3">
            {isCompleted ? (
              <CheckCircle2
                size={22}
                className="text-[var(--success)]"
              />
            ) : (
              <Circle
                size={22}
                className="text-[var(--text-muted)]"
              />
            )}

            <h2 className="text-2xl font-black text-[var(--text)]">
              {exercise.name}
            </h2>
          </div>

          <p className="mt-2 text-sm text-[var(--text-muted)]">
            {exercise.muscleGroup} · {exercise.equipment}
          </p>

          <p className="mt-4 text-sm font-semibold text-[var(--primary)]">
            {targetSets} sets · {targetReps} reps · {restSeconds}s rest
          </p>
        </div>

        <div
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            isCompleted
              ? "bg-[var(--success)]/15 text-[var(--success)]"
              : "bg-[var(--surface-soft)] text-[var(--text-muted)]"
          }`}
        >
          {completedSets}/{sets.length} complete
        </div>
      </div>

      <div className="mt-7">
        <div className="mb-3 grid grid-cols-[48px_1fr_1fr_58px] gap-3 px-3 text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-muted)] md:grid-cols-[60px_1fr_1fr_70px] md:gap-4 md:px-4">
          <div className="text-center">Set</div>
          <div className="text-center">Weight</div>
          <div className="text-center">Reps</div>
          <div className="text-center">Done</div>
        </div>

        <div className="space-y-2">
          {sets.map((set) => (
            <SetRow
              key={set.id}
              workoutSet={set}
              onToggle={() =>
                updateCompleted(exercise.id, set.id)
              }
              onWeightChange={(weight) =>
                updateWeight(exercise.id, set.id, weight)
              }
              onRepsChange={(reps) =>
                updateReps(exercise.id, set.id, reps)
              }
            />
          ))}
        </div>
      </div>
    </article>
  );
}