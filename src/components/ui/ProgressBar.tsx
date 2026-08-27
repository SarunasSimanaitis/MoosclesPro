type ProgressBarProps = {
  value: number;
  max: number;
  className?: string;
};

export default function ProgressBar({
  value,
  max,
  className = "",
}: ProgressBarProps) {
  const percentage =
    max > 0
      ? Math.min(100, Math.max(0, (value / max) * 100))
      : 0;

  return (
    <div
      className={`
        h-3
        overflow-hidden
        rounded-full
        bg-[var(--surface-soft)]
        ${className}
      `}
    >
      <div
        className="h-full rounded-full bg-[var(--primary)] transition-all duration-700 ease-out"
        style={{
          width: `${percentage}%`,
        }}
      />
    </div>
  );
}