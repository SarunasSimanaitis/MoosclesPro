type ProgressBarProps = {
  value: number
  max: number
}

export default function ProgressBar({
  value,
  max,
}: ProgressBarProps) {
  const percentage = max > 0 ? (value / max) * 100 : 0;

  return (
    <div className="mt-5 h-3 overflow-hidden rounded-full bg-zinc-800">

      <div
        className="h-full rounded-full bg-indigo-500 transition-all duration-700 ease-out"
        style={{
          width: `${percentage}%`,
        }}
      />

    </div>
  )
}