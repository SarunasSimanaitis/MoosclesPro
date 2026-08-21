import { Check } from "lucide-react";
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
    <div className="grid grid-cols-[48px_1fr_1fr_58px] items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-3 md:grid-cols-[60px_1fr_1fr_70px] md:gap-4 md:px-4">
      <div className="text-center font-semibold text-[var(--text-muted)]">
        {workoutSet.order}
      </div>

      <input
        type="number"
        min={0}
        step={0.5}
        placeholder="0"
        value={workoutSet.weight}
        onChange={(event) => {
          const weight = Number(event.target.value);
          onWeightChange(Math.max(0, weight));
        }}
        className="w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-2 text-center text-[var(--text)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
      />

      <input
        type="number"
        min={0}
        step={1}
        placeholder="0"
        value={workoutSet.reps}
        onChange={(event) => {
          const reps = Number(event.target.value);
          onRepsChange(Math.max(0, reps));
        }}
        className="w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-2 text-center text-[var(--text)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
      />

      <button
        type="button"
        onClick={onToggle}
        aria-label={
          workoutSet.completed
            ? "Mark set incomplete"
            : "Mark set complete"
        }
        className={`mx-auto flex h-10 w-10 items-center justify-center rounded-xl transition ${
          workoutSet.completed
            ? "bg-[var(--success)] text-white"
            : "border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text-muted)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
        }`}
      >
        {workoutSet.completed ? (
          <Check size={18} strokeWidth={3} />
        ) : (
          "○"
        )}
      </button>
    </div>
  );
}