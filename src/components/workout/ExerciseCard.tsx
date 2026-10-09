import {
  CheckCircle2,
  Circle,
  Clock3,
  Plus,
} from "lucide-react";

import type { WorkoutExercise } from "../../types/WorkoutExercise";
import type { WorkoutPersonalRecord } from "../../lib/personalRecords";
import type { WeightUnit } from "../../lib/units";
import { toKilograms } from "../../lib/units";

import Badge from "../ui/Badge";
import Card from "../ui/Card";
import SetRow from "./SetRow";

type ExerciseCardProps = {
  workoutExercise: WorkoutExercise;
  weightUnit: WeightUnit;
  personalRecords: WorkoutPersonalRecord[];

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
  personalRecords,
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
  const exerciseRecords = personalRecords.filter(
    (record) => record.exerciseId === exercise.id,
  );

  return (
    <Card
      className={`
        overflow-hidden
        transition-[border-color,box-shadow]
        duration-200
        ${
          isCompleted
            ? "border-[var(--success)]/40"
            : exerciseRecords.length > 0
              ? "border-[var(--primary)]/45 shadow-[var(--shadow-lg)]"
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
      <div className="border-t border-[var(--border)] bg-[var(--surface)]/35 p-3 sm:p-4 md:p-6">
        <div className="mb-4 flex items-end justify-between gap-3 px-1 sm:mb-5 sm:px-2">
          <div>
            <h3 className="text-sm font-black tracking-tight text-[var(--text)] sm:text-base">Log your sets</h3>
            <p className="mt-1 text-xs leading-relaxed text-[var(--text-muted)]">Enter your load and reps, then log the set when you finish.</p>
          </div>
        </div>

        <div className="space-y-3">
          {sets.map((set) => (
            <SetRow
              key={set.id}
              workoutSet={set}
              weightUnit={weightUnit}
              personalRecordLabels={exerciseRecords.filter((record) => record.setId === set.id).map((record) => getRecordLabel(record.kind))}
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
          className="mt-4 inline-flex min-h-12 w-full touch-manipulation items-center justify-center gap-2 rounded-2xl border border-dashed border-[var(--border-strong)] px-4 text-sm font-bold text-[var(--text-muted)] transition-[background-color,border-color,color,transform] duration-200 hover:border-[var(--primary)] hover:bg-[var(--primary-soft)] hover:text-[var(--primary)] active:scale-[0.99] sm:w-auto sm:justify-start sm:rounded-full"
        >
          <Plus size={16} aria-hidden="true" />
          Add set
        </button>
      </div>
    </Card>
  );
}

function getRecordLabel(kind: WorkoutPersonalRecord["kind"]) {
  if (kind === "load") return "Load PR";
  if (kind === "estimated-one-rep-max") return "Est. 1RM";
  return "Rep PR";
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
