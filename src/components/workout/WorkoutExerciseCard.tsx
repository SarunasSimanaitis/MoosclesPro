import {
  Check,
  ChevronRight,
  Ellipsis,
  Minus,
  Plus,
  SkipForward,
  Timer,
  Trophy,
  Undo2,
} from "lucide-react";
import { memo, useRef, useState } from "react";
import { Link } from "react-router-dom";

import type { PreviousSet } from "../../lib/workoutEngine";
import { describeRpe, formatRpe, RPE_OPTIONS } from "../../lib/rpe";
import { fromKilograms, toKilograms, type WeightUnit } from "../../lib/units";
import { formatRestTime } from "../../stores/restTimerStore";
import type { WorkoutExercise } from "../../types/WorkoutExercise";
import type { WorkoutSet } from "../../types/WorkoutSet";
import Modal from "../ui/Modal";
import SetInput from "./SetInput";

const REST_OPTIONS = [0, 30, 45, 60, 75, 90, 120, 150, 180, 240, 300];

export type ExerciseActions = {
  updateWeight: (exerciseId: string, setId: string, weightKg: number) => void;
  commitWeight: (exerciseId: string, setId: string) => void;
  updateReps: (exerciseId: string, setId: string, reps: number) => void;
  commitReps: (exerciseId: string, setId: string) => void;
  updateRpe: (exerciseId: string, setId: string, rpe: number | null) => void;
  fillSet: (exerciseId: string, setId: string, source: PreviousSet) => void;
  toggleSet: (exerciseId: string, setId: string) => void;
  addSet: (exerciseId: string) => void;
  removeSet: (exerciseId: string, setId: string) => void;
  changeRest: (exerciseId: string, seconds: number) => void;
  setSkipped: (exerciseId: string, skipped: boolean) => void;
};

type WorkoutExerciseCardProps = {
  workoutExercise: WorkoutExercise;
  previousSets: PreviousSet[];
  weightUnit: WeightUnit;
  /** Set ids that just set a personal record, with a short label. */
  recordLabels: Map<string, string>;
  actions: ExerciseActions;
};

function formatPrevious(set: PreviousSet | undefined, unit: WeightUnit) {
  if (!set) return "–";
  const weight = Math.round(fromKilograms(set.weight, unit) * 10) / 10;
  const base = set.weight > 0 ? `${weight}×${set.reps}` : `${set.reps} reps`;
  return set.rpe ? `${base} @${set.rpe}` : base;
}

function restLabel(seconds: number) {
  return seconds > 0 ? formatRestTime(seconds) : "Off";
}

function SetRow({
  set,
  exercise,
  previous,
  weightUnit,
  recordLabel,
  actions,
  onOpenRpe,
}: {
  set: WorkoutSet;
  exercise: WorkoutExercise;
  previous: PreviousSet | undefined;
  weightUnit: WeightUnit;
  recordLabel: string | undefined;
  actions: ExerciseActions;
  onOpenRpe: (setId: string) => void;
}) {
  const exerciseId = exercise.exercise.id;
  const repsRef = useRef<HTMLInputElement>(null);
  const [needsReps, setNeedsReps] = useState(false);

  function handleToggle() {
    if (!set.completed && set.reps <= 0) {
      // Use last time's numbers if there are any, otherwise ask for reps.
      if (previous && previous.reps > 0) {
        actions.fillSet(exerciseId, set.id, previous);
      } else {
        setNeedsReps(true);
        repsRef.current?.focus();
        return;
      }
    }

    setNeedsReps(false);
    actions.toggleSet(exerciseId, set.id);
  }

  const displayWeight = Math.round(fromKilograms(set.weight, weightUnit) * 100) / 100;

  return (
    <div
      className={[
        "set-grid relative items-center rounded-[var(--radius-md)] px-1.5 py-1.5 transition-colors duration-300",
        set.completed ? "bg-[var(--success-soft)]" : "",
        set.completed ? "set-row-completed" : "",
        recordLabel ? "set-row-record" : "",
      ].join(" ")}
    >
      <span className="flex h-8 items-center justify-center text-sm font-bold text-[var(--text)]">
        {recordLabel ? (
          <Trophy size={16} className="text-[var(--warning)]" aria-label={`Set ${set.order}, ${recordLabel}`} />
        ) : (
          set.order
        )}
      </span>

      <button
        type="button"
        disabled={!previous || set.completed}
        onClick={() => previous && actions.fillSet(exerciseId, set.id, previous)}
        className="truncate px-1 text-center text-[13px] text-[var(--text-muted)] enabled:hover:text-[var(--text)] disabled:cursor-default"
        aria-label={previous ? `Use last time's numbers: ${formatPrevious(previous, weightUnit)}` : "No previous set"}
        title={previous ? "Tap to copy" : undefined}
      >
        {formatPrevious(previous, weightUnit)}
      </button>

      <SetInput
        value={displayWeight}
        decimals
        disabled={set.completed}
        ariaLabel={`Set ${set.order} weight in ${weightUnit}`}
        placeholder={previous ? String(Math.round(fromKilograms(previous.weight, weightUnit) * 10) / 10) : "0"}
        onCommit={(value) => {
          actions.updateWeight(exerciseId, set.id, toKilograms(value, weightUnit));
          actions.commitWeight(exerciseId, set.id);
        }}
      />

      <SetInput
        ref={repsRef}
        value={set.reps}
        decimals={false}
        disabled={set.completed}
        invalid={needsReps && set.reps <= 0}
        ariaLabel={`Set ${set.order} reps`}
        placeholder={previous ? String(previous.reps) : exercise.targetReps.split("-")[0] || "0"}
        onCommit={(value) => {
          setNeedsReps(false);
          actions.updateReps(exerciseId, set.id, value);
          actions.commitReps(exerciseId, set.id);
        }}
      />

      <button
        type="button"
        onClick={() => onOpenRpe(set.id)}
        aria-label={set.rpe ? `Set ${set.order} RPE ${set.rpe}, change` : `Set ${set.order} RPE, not set`}
        className={[
          "h-9 rounded-[var(--radius-sm)] text-[13px] font-semibold tabular-nums",
          set.rpe ? "bg-[var(--primary-soft)] text-[var(--primary)]" : "text-[var(--text-subtle)] hover:bg-[var(--surface-soft)]",
        ].join(" ")}
      >
        {formatRpe(set.rpe) || "RPE"}
      </button>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleToggle}
          aria-pressed={set.completed}
          aria-label={set.completed ? `Set ${set.order} done. Undo.` : `Complete set ${set.order}`}
          className={[
            "set-check flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] transition-colors duration-150",
            set.completed
              ? "is-done bg-[var(--success)] text-white"
              : "bg-[var(--surface-soft)] text-[var(--text-subtle)] hover:bg-[var(--surface-hover)] hover:text-[var(--text)]",
          ].join(" ")}
        >
          <Check size={18} strokeWidth={3} aria-hidden="true" />
        </button>
      </div>

      {needsReps && set.reps <= 0 && (
        <p role="alert" className="col-span-6 px-1 pt-1 text-xs text-[var(--danger)]">
          Enter your reps first.
        </p>
      )}
    </div>
  );
}

function WorkoutExerciseCard({
  workoutExercise,
  previousSets,
  weightUnit,
  recordLabels,
  actions,
}: WorkoutExerciseCardProps) {
  const { exercise, sets, restSeconds, skipped } = workoutExercise;
  const [menuOpen, setMenuOpen] = useState(false);
  const [restOpen, setRestOpen] = useState(false);
  const [rpeSetId, setRpeSetId] = useState<string | null>(null);

  const doneCount = sets.filter((set) => set.completed).length;
  const allDone = sets.length > 0 && doneCount === sets.length;
  const rpeSet = sets.find((set) => set.id === rpeSetId);
  const lastSet = sets[sets.length - 1];

  if (skipped) {
    return (
      <article className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-dashed border-[var(--border-strong)] px-4 py-3">
        <SkipForward size={16} className="shrink-0 text-[var(--text-muted)]" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-semibold text-[var(--text-muted)] line-through decoration-[var(--border-strong)]">{exercise.name}</p>
          <p className="text-xs text-[var(--text-muted)]">
            Skipped{doneCount > 0 ? ` · ${doneCount} ${doneCount === 1 ? "set" : "sets"} kept` : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={() => actions.setSkipped(exercise.id, false)}
          className="inline-flex h-9 items-center gap-1.5 rounded-[var(--radius-md)] bg-[var(--surface-soft)] px-3 text-sm font-semibold text-[var(--text)] hover:bg-[var(--surface-hover)]"
        >
          <Undo2 size={15} aria-hidden="true" />
          Undo
        </button>
      </article>
    );
  }

  return (
    <article
      aria-label={exercise.name}
      className={`rounded-[var(--radius-lg)] border bg-[var(--surface)] transition-colors ${allDone ? "border-[var(--success)]/50" : "border-[var(--border)]"}`}
    >
      <header className="flex items-start gap-3 px-4 pb-2 pt-3.5">
        <div className="min-w-0 flex-1">
          <Link
            to={`/exercises/${encodeURIComponent(exercise.id)}`}
            className="group inline-flex max-w-full items-center gap-1 text-[16px] font-semibold text-[var(--primary)]"
          >
            <span className="truncate">{exercise.name}</span>
            <ChevronRight size={16} className="shrink-0 opacity-60 group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
          <p className="mt-0.5 text-xs text-[var(--text-muted)]">
            {exercise.muscleGroup} · {exercise.equipment} · Target {workoutExercise.targetSets} × {workoutExercise.targetReps}
          </p>
          <button
            type="button"
            onClick={() => setRestOpen(true)}
            className="mt-2 inline-flex h-7 items-center gap-1.5 rounded-full bg-[var(--surface-soft)] px-2.5 text-xs font-semibold text-[var(--text)] hover:bg-[var(--surface-hover)]"
            aria-label={`Rest timer ${restLabel(restSeconds)}. Change`}
          >
            <Timer size={13} className="text-[var(--primary)]" aria-hidden="true" />
            Rest {restLabel(restSeconds)}
          </button>
        </div>

        {allDone && (
          <span className="exercise-done mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--success)] text-white" aria-label="Exercise complete">
            <Check size={16} strokeWidth={3} aria-hidden="true" />
          </span>
        )}

        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label={`More options for ${exercise.name}`}
          className="-mr-1.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[var(--text)] hover:bg-[var(--surface-soft)]"
        >
          <Ellipsis size={20} aria-hidden="true" />
        </button>
      </header>

      <div className="px-2.5 pb-2">
        <div className="set-grid px-1.5 pb-1 text-[11px] font-semibold text-[var(--text-muted)]" aria-hidden="true">
          <span className="text-center">Set</span>
          <span className="text-center">Previous</span>
          <span className="text-center">{weightUnit}</span>
          <span className="text-center">Reps</span>
          <span className="text-center">RPE</span>
          <span className="flex justify-center"><Check size={13} strokeWidth={3} /></span>
        </div>

        <div className="space-y-1">
          {sets.map((set, index) => (
            <SetRow
              key={set.id}
              set={set}
              exercise={workoutExercise}
              previous={previousSets[index]}
              weightUnit={weightUnit}
              recordLabel={recordLabels.get(set.id)}
              actions={actions}
              onOpenRpe={setRpeSetId}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => actions.addSet(exercise.id)}
          className="mt-2 flex h-9 w-full items-center justify-center gap-1.5 rounded-[var(--radius-md)] bg-[var(--surface-soft)] text-sm font-semibold text-[var(--text)] hover:bg-[var(--surface-hover)]"
        >
          <Plus size={16} aria-hidden="true" />
          Add set
        </button>
      </div>

      {/* Exercise options */}
      <Modal open={menuOpen} onClose={() => setMenuOpen(false)} title={exercise.name} size="sm">
        <div className="-mx-2 flex flex-col">
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              setRestOpen(true);
            }}
            className="flex h-12 items-center gap-3 rounded-[var(--radius-md)] px-2 text-left text-[15px] hover:bg-[var(--surface-soft)]"
          >
            <Timer size={19} aria-hidden="true" />
            <span className="flex-1">Rest timer</span>
            <span className="text-sm text-[var(--text-muted)]">{restLabel(restSeconds)}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              actions.addSet(exercise.id);
              setMenuOpen(false);
            }}
            className="flex h-12 items-center gap-3 rounded-[var(--radius-md)] px-2 text-left text-[15px] hover:bg-[var(--surface-soft)]"
          >
            <Plus size={19} aria-hidden="true" />
            Add a set
          </button>
          {lastSet && sets.length > 1 && !lastSet.completed && (
            <button
              type="button"
              onClick={() => {
                actions.removeSet(exercise.id, lastSet.id);
                setMenuOpen(false);
              }}
              className="flex h-12 items-center gap-3 rounded-[var(--radius-md)] px-2 text-left text-[15px] hover:bg-[var(--surface-soft)]"
            >
              <Minus size={19} aria-hidden="true" />
              Remove last set
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              actions.setSkipped(exercise.id, true);
              setMenuOpen(false);
            }}
            className="flex h-12 items-center gap-3 rounded-[var(--radius-md)] px-2 text-left text-[15px] text-[var(--danger)] hover:bg-[var(--danger-soft)]"
          >
            <SkipForward size={19} aria-hidden="true" />
            Skip this exercise
          </button>
        </div>
      </Modal>

      {/* Rest timer per exercise */}
      <Modal
        open={restOpen}
        onClose={() => setRestOpen(false)}
        title="Rest timer"
        description={`Starts after each set of ${exercise.name}. Remembered for this routine.`}
        size="sm"
      >
        <div className="grid grid-cols-3 gap-2">
          {REST_OPTIONS.map((seconds) => {
            const active = seconds === restSeconds;
            return (
              <button
                key={seconds}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  actions.changeRest(exercise.id, seconds);
                  setRestOpen(false);
                }}
                className={[
                  "h-12 rounded-[var(--radius-md)] text-[15px] font-semibold tabular-nums",
                  active ? "bg-[var(--primary)] text-[var(--primary-foreground)]" : "bg-[var(--surface-soft)] text-[var(--text)] hover:bg-[var(--surface-hover)]",
                ].join(" ")}
              >
                {restLabel(seconds)}
              </button>
            );
          })}
        </div>
      </Modal>

      {/* RPE picker */}
      <Modal
        open={rpeSet !== undefined}
        onClose={() => setRpeSetId(null)}
        title={rpeSet ? `RPE · set ${rpeSet.order}` : "RPE"}
        description="How hard was that set? 10 means you couldn't do another rep."
        size="sm"
      >
        {rpeSet && (
          <div className="flex flex-col gap-1.5">
            {[...RPE_OPTIONS].reverse().map((value) => {
              const active = rpeSet.rpe === value;
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    actions.updateRpe(exercise.id, rpeSet.id, value);
                    setRpeSetId(null);
                  }}
                  className={[
                    "flex h-11 items-center gap-3 rounded-[var(--radius-md)] px-3 text-left",
                    active ? "bg-[var(--primary)] text-[var(--primary-foreground)]" : "bg-[var(--surface-soft)] text-[var(--text)] hover:bg-[var(--surface-hover)]",
                  ].join(" ")}
                >
                  <span className="w-8 text-[15px] font-bold tabular-nums">{value}</span>
                  <span className={`text-sm ${active ? "" : "text-[var(--text-muted)]"}`}>{describeRpe(value)}</span>
                </button>
              );
            })}
            {rpeSet.rpe != null && (
              <button
                type="button"
                onClick={() => {
                  actions.updateRpe(exercise.id, rpeSet.id, null);
                  setRpeSetId(null);
                }}
                className="mt-1 h-11 rounded-[var(--radius-md)] text-sm font-semibold text-[var(--danger)] hover:bg-[var(--danger-soft)]"
              >
                Clear RPE
              </button>
            )}
          </div>
        )}
      </Modal>
    </article>
  );
}

export default memo(WorkoutExerciseCard);
