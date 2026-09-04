import { Check } from "lucide-react";

import type { WorkoutSet } from "../../types/WorkoutSet";

import NumberStepper from "../ui/NumberStepper";

type SetRowProps = {
  workoutSet: WorkoutSet;

  onToggle: () => void;

  onWeightChange: (
    weight: number,
  ) => void;

  onWeightCommit: () => void;

  onRepsChange: (
    reps: number,
  ) => void;

  onRepsCommit: () => void;
};

export default function SetRow({
  workoutSet,
  onToggle,
  onWeightChange,
  onWeightCommit,
  onRepsChange,
  onRepsCommit,
}: SetRowProps) {
  return (
    <div
      className={`
        grid
        grid-cols-[40px_1fr_1fr_48px]
        items-center
        gap-2
        rounded-[var(--radius-md)]
        border
        px-2
        py-2
        transition-[background-color,border-color,box-shadow]
        duration-200
        sm:grid-cols-[44px_1fr_1fr_56px]
        sm:gap-3
        sm:px-3
        ${
          workoutSet.completed
            ? "border-[var(--success)]/30 bg-[var(--success-soft)]"
            : "border-[var(--border)] bg-[var(--surface-soft)]"
        }
      `}
    >
      {/* Set */}
      <div
        className={`
          flex
          h-10
          items-center
          justify-center
          rounded-[var(--radius-sm)]
          text-sm
          font-black
          ${
            workoutSet.completed
              ? "text-[var(--success)]"
              : "text-[var(--text-muted)]"
          }
        `}
        aria-label={`Set ${workoutSet.order}`}
      >
        {workoutSet.order}
      </div>

      {/* Weight */}
      <div className="min-w-0">
        <NumberStepper
          value={workoutSet.weight}
          onChange={onWeightChange}
          onCommit={onWeightCommit}
          min={0}
          step={0.5}
          ariaLabel={`Weight for set ${workoutSet.order}`}
        />

        <span className="mt-1 block text-center text-[9px] font-bold uppercase tracking-[0.1em] text-[var(--text-muted)] sm:hidden">
          kg
        </span>
      </div>

      {/* Reps */}
      <div className="min-w-0">
        <NumberStepper
          value={workoutSet.reps}
          onChange={onRepsChange}
          onCommit={onRepsCommit}
          min={0}
          step={1}
          ariaLabel={`Reps for set ${workoutSet.order}`}
        />

        <span className="mt-1 block text-center text-[9px] font-bold uppercase tracking-[0.1em] text-[var(--text-muted)] sm:hidden">
          reps
        </span>
      </div>

      {/* Complete */}
      <button
        type="button"
        onClick={onToggle}
        aria-label={
          workoutSet.completed
            ? `Mark set ${workoutSet.order} incomplete`
            : `Mark set ${workoutSet.order} complete`
        }
        aria-pressed={
          workoutSet.completed
        }
        className={`
          mx-auto
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-[var(--radius-md)]
          border
          transition-[background-color,border-color,color,transform]
          duration-150
          active:scale-95
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-[var(--primary)]
          ${
            workoutSet.completed
              ? "border-[var(--success)] bg-[var(--success)] text-white"
              : "border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text-muted)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
          }
        `}
      >
        {workoutSet.completed ? (
          <Check
            size={18}
            strokeWidth={3}
          />
        ) : (
          <span
            aria-hidden="true"
            className="h-2.5 w-2.5 rounded-full border-2 border-current"
          />
        )}
      </button>
    </div>
  );
}