import { Check, Circle, Trophy } from "lucide-react";

import type { WorkoutSet } from "../../types/WorkoutSet";
import type { WeightUnit } from "../../lib/units";
import { fromKilograms } from "../../lib/units";

import NumberStepper from "../ui/NumberStepper";

type SetRowProps = {
  workoutSet: WorkoutSet;
  weightUnit: WeightUnit;
  personalRecordLabels?: string[];
  onToggle: () => void;
  onWeightChange: (weight: number) => void;
  onWeightCommit: () => void;
  onRepsChange: (reps: number) => void;
  onRepsCommit: () => void;
};

export default function SetRow({
  workoutSet,
  weightUnit,
  personalRecordLabels = [],
  onToggle,
  onWeightChange,
  onWeightCommit,
  onRepsChange,
  onRepsCommit,
}: SetRowProps) {
  const isCompleted = workoutSet.completed;
  const hasRecord = personalRecordLabels.length > 0;

  function handleToggle() {
    if (!isCompleted && typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      navigator.vibrate(18);
    }
    onToggle();
  }

  return (
    <div
      className={`set-row-card grid grid-cols-2 items-end gap-x-3 gap-y-3 rounded-3xl border p-3 transition-[background-color,border-color,box-shadow,transform] duration-200 md:grid-cols-[56px_minmax(0,1fr)_minmax(0,1fr)_auto_minmax(0,auto)] md:items-center md:gap-3 md:p-3.5 ${
        isCompleted
          ? "set-row-completed border-[var(--success)]/40 bg-[var(--success-soft)]"
          : "border-[var(--border)] bg-[var(--surface-soft)]/70"
      } ${hasRecord ? "set-row-record border-[var(--primary)]/55" : ""}`}
    >
      <div className="col-span-2 flex min-w-0 items-center justify-between gap-3 md:col-span-1 md:justify-center">
        <div className="flex min-w-0 items-center gap-2.5 md:flex-col md:gap-1">
          <span className={`flex h-9 min-w-9 items-center justify-center rounded-xl text-sm font-black tabular-nums md:h-8 md:min-w-8 ${isCompleted ? "bg-[var(--success)] text-white" : "bg-[var(--surface)] text-[var(--text-muted)]"}`}>
            {workoutSet.order}
          </span>
          <span className="text-xs font-bold text-[var(--text-muted)] md:hidden">Set {workoutSet.order}</span>
          {isCompleted && <span className="hidden text-[10px] font-black uppercase tracking-wide text-[var(--success)] md:inline">Done</span>}
        </div>

        {hasRecord && (
          <div className="flex min-w-0 flex-wrap justify-end gap-1.5 md:hidden" aria-label="Personal records set">
            {personalRecordLabels.map((label) => <RecordBadge key={label} label={label} />)}
          </div>
        )}
      </div>

      <label className="block min-w-0">
        <span className="mb-1.5 block pl-1 text-[10px] font-black uppercase tracking-[0.12em] text-[var(--text-muted)]">Load · {weightUnit}</span>
        <NumberStepper
          value={weightUnit === "lb" ? Math.round(fromKilograms(workoutSet.weight, weightUnit)) : workoutSet.weight}
          onChange={onWeightChange}
          onCommit={onWeightCommit}
          min={0}
          step={weightUnit === "lb" ? 1 : 0.5}
          ariaLabel={`Weight for set ${workoutSet.order} in ${weightUnit}`}
        />
      </label>

      <label className="block min-w-0">
        <span className="mb-1.5 block pl-1 text-[10px] font-black uppercase tracking-[0.12em] text-[var(--text-muted)]">Reps</span>
        <NumberStepper
          value={workoutSet.reps}
          onChange={onRepsChange}
          onCommit={onRepsCommit}
          min={0}
          step={1}
          ariaLabel={`Reps for set ${workoutSet.order}`}
        />
      </label>

      <button
        type="button"
        onClick={handleToggle}
        aria-label={isCompleted ? `Mark set ${workoutSet.order} incomplete` : `Log set ${workoutSet.order} as complete`}
        aria-pressed={isCompleted}
        className={`col-span-2 inline-flex min-h-12 touch-manipulation items-center justify-center gap-2 rounded-2xl border px-4 text-sm font-black transition-[background-color,border-color,color,box-shadow,transform] duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] md:col-span-1 md:min-h-11 md:min-w-28 ${isCompleted ? "border-[var(--success)] bg-[var(--success)] text-white shadow-[0_8px_20px_rgba(50,110,75,0.2)]" : "border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text-muted)] hover:border-[var(--primary)] hover:bg-[var(--primary-soft)] hover:text-[var(--primary)]"}`}
      >
        {isCompleted ? <Check size={17} strokeWidth={3} aria-hidden="true" /> : <Circle size={17} aria-hidden="true" />}
        {isCompleted ? "Logged" : "Log set"}
      </button>

      {hasRecord && (
        <div className="hidden min-w-0 flex-wrap justify-center gap-1 md:flex">
          {personalRecordLabels.map((label) => <RecordBadge key={label} label={label} />)}
        </div>
      )}

      <span className="sr-only" aria-live="polite">
        {isCompleted ? `Set ${workoutSet.order} logged` : `Set ${workoutSet.order} not logged`}
      </span>
    </div>
  );
}

function RecordBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-[var(--primary)]/25 bg-[var(--primary-soft)] px-2 py-1 text-[9px] font-black uppercase tracking-wide text-[var(--primary)]">
      <Trophy size={10} aria-hidden="true" />
      {label}
    </span>
  );
}
