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
    <div className="grid grid-cols-[60px_1fr_1fr_70px] items-center gap-4 rounded-xl bg-zinc-800/40 px-4 py-3">
      <div className="text-center font-semibold text-zinc-400">
        {workoutSet.order}
      </div>

      <input
        type="number"
        min={0}
        placeholder="0"
        value={workoutSet.weight}
        onChange={(event) => {
          const weight = Number(event.target.value);
          onWeightChange(Math.max(0, weight));
        }}
        className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-center text-white outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
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
        className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-center text-white outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
      />

      <button
        onClick={onToggle}
        className={`mx-auto flex h-11 w-11 items-center justify-center rounded-xl transition-all ${
          workoutSet.completed
            ? "bg-green-600 text-white hover:bg-green-500"
            : "bg-indigo-600 text-white hover:bg-indigo-500"
        }`}
      >
        {workoutSet.completed ? <Check size={18} strokeWidth={3} /> : "○"}
      </button>
    </div>
  );
}
