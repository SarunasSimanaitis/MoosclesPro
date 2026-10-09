import {
  CheckCircle2,
  Circle,
  Clock3,
  Plus,
} from "lucide-react";

import type { WorkoutExercise } from "../../types/WorkoutExercise";
import type { WeightUnit } from "../../lib/units";
import { toKilograms } from "../../lib/units";

import Badge from "../ui/Badge";
import Card from "../ui/Card";
import SetRow from "./SetRow";

type ExerciseCardProps = {
  workoutExercise: WorkoutExercise;
  weightUnit: WeightUnit;

  updateWeight: (
    exerciseId: string,
    setId: string,
    weight: number,
  ) => void;

  commitWeight: (
    exerciseId: string,
    setId: string,
  ) => void;

  updateReps: (
    exerciseId: string,
    setId: string,
    reps: number,
  ) => void;

  commitReps: (
    exerciseId: string,
    setId: string,
  ) => void;

  updateCompleted: (
    exerciseId: string,
    setId: string,
  ) => void;

  onAddSet: (exerciseId: string) => void;
};

export default function ExerciseCard({
  workoutExercise,
  weightUnit,
  updateWeight,
  commitWeight,
  updateReps,
  commitReps,
  updateCompleted,
  onAddSet,
}: ExerciseCardProps) {
  const {
    exercise,
    targetSets,
    targetReps,
    restSeconds,
    sets,
  } = workoutExercise;

  const completedSets =
    sets.filter(
      (set) => set.completed,
    ).length;

  const isCompleted =
    sets.length > 0 &&
    completedSets === sets.length;

  const progress =
    sets.length > 0
      ? Math.round(
          (completedSets /
            sets.length) *
            100,
        )
      : 0;

  return (
    <Card
      className={`
        overflow-hidden
        transition-[border-color,box-shadow]
        duration-200
        ${
          isCompleted
            ? "border-[var(--success)]/30"
            : ""
        }
      `}
    >
      {/* Header */}
      <div className="p-4 sm:p-5 md:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-start gap-3">
              <div
                className={`
                  mt-0.5
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  ${
                    isCompleted
                      ? "bg-[var(--success-soft)] text-[var(--success)]"
                      : "bg-[var(--surface-soft)] text-[var(--text-muted)]"
                  }
                `}
              >
                {isCompleted ? (
                  <CheckCircle2
                    size={19}
                  />
                ) : (
                  <Circle
                    size={19}
                  />
                )}
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-lg font-black sm:text-xl tracking-tight text-[var(--text)] md:text-2xl">
                  {exercise.name}
                </h2>

                <p className="mt-1 text-sm text-[var(--text-muted)]">
                  {exercise.muscleGroup}{" "}
                  · {exercise.equipment}
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="primary">
                {targetSets} sets
              </Badge>

              <Badge>
                {targetReps} reps
              </Badge>

              <Badge>
                <Clock3
                  size={12}
                  className="mr-1"
                />
                {formatRest(restSeconds)}
              </Badge>
            </div>
          </div>

          <div className="shrink-0">
            <div
              className={`
                rounded-full
                px-3
                py-1.5
                text-xs
                font-bold
                ${
                  isCompleted
                    ? "bg-[var(--success-soft)] text-[var(--success)]"
                    : "bg-[var(--surface-soft)] text-[var(--text-muted)]"
                }
              `}
            >
              {completedSets}/
              {sets.length} complete
            </div>
          </div>
        </div>

        <div className="mt-5 h-1 overflow-hidden rounded-full bg-[var(--surface-soft)]">
          <div
            className={`
              h-full
              rounded-full
              transition-[width]
              duration-300
              ${
                isCompleted
                  ? "bg-[var(--success)]"
                  : "bg-[var(--primary)]"
              }
            `}
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>

      {/* Set controls */}
      <div className="border-t border-[var(--border)] p-3 sm:p-4 md:p-6">
        <div className="mb-3 hidden grid-cols-[44px_1fr_1fr_56px] items-center gap-3 px-3 text-center text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--text-muted)] sm:grid md:grid-cols-[52px_1fr_1fr_64px] md:gap-4">
          <span>Set</span>
          <span>Weight ({weightUnit})</span>
          <span>Reps</span>
          <span>Done</span>
        </div>

        <div className="space-y-2.5">
          {sets.map((set) => (
            <SetRow
              key={set.id}
              workoutSet={set}
              weightUnit={weightUnit}
              onToggle={() =>
                updateCompleted(
                  exercise.id,
                  set.id,
                )
              }
              onWeightChange={(weight) =>
                updateWeight(
                  exercise.id,
                  set.id,
                  toKilograms(weight, weightUnit),
                )
              }
              onWeightCommit={() =>
                commitWeight(
                  exercise.id,
                  set.id,
                )
              }
              onRepsChange={(reps) =>
                updateReps(
                  exercise.id,
                  set.id,
                  reps,
                )
              }
              onRepsCommit={() =>
                commitReps(
                  exercise.id,
                  set.id,
                )
              }
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => onAddSet(exercise.id)}
          className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full border border-dashed border-[var(--border-strong)] px-4 text-sm font-bold text-[var(--text-muted)] transition-colors hover:border-[var(--primary)] hover:bg-[var(--primary-soft)] hover:text-[var(--primary)]"
        >
          <Plus size={16} aria-hidden="true" />
          Add set
        </button>
      </div>
    </Card>
  );
}

function formatRest(seconds: number) {
  const minutes = Math.floor(
    seconds / 60,
  );

  const remaining =
    seconds % 60;

  if (minutes === 0) {
    return `${remaining}s rest`;
  }

  return remaining === 0
    ? `${minutes}m rest`
    : `${minutes}m ${remaining}s`;
}
