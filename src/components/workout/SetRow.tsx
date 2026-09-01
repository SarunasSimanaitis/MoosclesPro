import { Check } from "lucide-react";

import NumberStepper from "../ui/NumberStepper";

import type { WorkoutSet } from "../../types/WorkoutSet";

type SetRowProps = {
  workoutSet: WorkoutSet;
  onToggle: () => void;
  onWeightChange: (weight: number) => void;
  onRepsChange: (reps: number) => void;
};

export default function SetRow({
  workoutSet,
  onToggle,
  onWeightChange,
  onRepsChange,
}: SetRowProps) {
  return (
    <div
      className="
        grid
        grid-cols-[48px_1fr_1fr_58px]
        items-center
        gap-3
        rounded-2xl
        border
        border-[var(--border)]
        bg-[var(--surface-soft)]
        px-3
        py-3
        md:grid-cols-[60px_1fr_1fr_70px]
        md:gap-4
        md:px-4
      "
    >
      {/* Set number */}

      <div className="text-center font-semibold text-[var(--text-muted)]">
        {workoutSet.order}
      </div>

      {/* Weight */}

      <NumberStepper
        value={workoutSet.weight}
        onChange={onWeightChange}
        min={0}
        step={0.5}
        ariaLabel={`Weight for set ${workoutSet.order}`}
      />

      {/* Reps */}

      <NumberStepper
        value={workoutSet.reps}
        onChange={onRepsChange}
        min={0}
        step={1}
        ariaLabel={`Reps for set ${workoutSet.order}`}
      />

      {/* Complete */}

      <button
        type="button"
        onClick={onToggle}
        aria-label={
          workoutSet.completed
            ? `Mark set ${workoutSet.order} incomplete`
            : `Mark set ${workoutSet.order} complete`
        }
        className={`
          mx-auto
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-xl
          transition
          ${
            workoutSet.completed
              ? "bg-[var(--success)] text-white"
              : "border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text-muted)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
          }
        `}
      >
        {workoutSet.completed ? (
          <Check
            size={18}
            strokeWidth={3}
          />
        ) : (
          "○"
        )}
      </button>
    </div>
  );
}