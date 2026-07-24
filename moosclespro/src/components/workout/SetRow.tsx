type SetRowProps = {
  setNumber: number;
};

export default function SetRow({ setNumber }: SetRowProps) {
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

      <button className="rounded-lg bg-indigo-600 px-3 py-2 font-medium hover:bg-indigo-500 transition-colors">
        ✓
      </button>
    </div>
  );
}