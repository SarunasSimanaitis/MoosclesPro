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
      <div className="p-3 sm:p-5 md:p-7">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-2.5 sm:gap-3">
              <div
                className={`
                  mt-0.5
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  ${
                    isCompleted
                      ? "bg-[var(--success-soft)] text-[var(--success)]"
                      : "bg-[var(--surface-soft)] text-[var(--text-muted)]"
                  }
                `}
              >
                {isCompleted ? (
                  <CheckCircle2
                    size={17}
                  />
                ) : (
                  <Circle
                    size={17}
                  />
                )}
              </div>

              <div className="min-w-0">
                <h2 className="line-clamp-2 break-words text-base font-black leading-tight tracking-tight text-[var(--text)] sm:text-xl md:text-2xl">
                  {exercise.name}
                </h2>

                <p className="mt-1 line-clamp-1 text-xs text-[var(--text-muted)] sm:text-sm">
                  {exercise.muscleGroup}{" "}
                  · {exercise.equipment}
                </p>

                <div className="mt-2.5 flex flex-wrap gap-1.5 sm:mt-3 sm:gap-2">
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
          </div>

          <div className="shrink-0 pt-0.5">
            <div
              className={`
                rounded-full
                px-2.5
                py-1
                text-[10px]
                font-bold
                tabular-nums
                sm:px-3
                sm:py-1.5
                sm:text-xs
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

        <div className="mt-3 h-1 overflow-hidden rounded-full bg-[var(--surface-soft)] sm:mt-5">
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
      <div className="border-t border-[var(--border)] bg-[var(--surface)]/35 p-2.5 sm:p-4 md:p-6">
        <div className="space-y-2.5 sm:space-y-3">
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
