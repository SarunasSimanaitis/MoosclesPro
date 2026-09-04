type ProgressBarProps = {
  value: number;
  max: number;
  className?: string;
  label?: string;
};

export default function ProgressBar({
  value,
  max,
  className = "",
  label = "Progress",
}: ProgressBarProps) {
  const percentage =
    max > 0
      ? Math.min(
          100,
          Math.max(0, (value / max) * 100),
        )
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
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={Math.min(value, max)}
    >
      <div
        className="
          h-full
          rounded-full
          bg-[var(--primary)]
          transition-[width]
          duration-500
          ease-out
        "
        style={{
          width: `${percentage}%`,
        }}
      />
    </div>
  );
}