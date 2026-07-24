type SetRowProps = {
  setNumber: number;
  completed: boolean;
  onToggle: () => void;
};

export default function SetRow({
  setNumber,
  completed,
  onToggle,
}: SetRowProps) {
  return (
    <div className="grid grid-cols-4 items-center gap-4 rounded-xl bg-zinc-800/40 p-3">
      <span className="font-medium text-zinc-400">
        {setNumber}
      </span>

      <input
        type="number"
        placeholder="Weight"
        className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"
      />

      <input
        type="number"
        placeholder="Reps"
        className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"
      />

      <button
        onClick={onToggle}
        className={`rounded-lg px-3 py-2 font-medium text-white transition-colors ${
          completed
            ? "bg-green-600 hover:bg-green-500"
            : "bg-indigo-600 hover:bg-indigo-500"
        }`}
      >
        {completed ? "✓" : "○"}
      </button>
    </div>
  );
}