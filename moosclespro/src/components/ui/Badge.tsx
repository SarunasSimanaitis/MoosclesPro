import type { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  variant?: "default" | "primary" | "success" | "warning" | "danger";
};

export default function Badge({
  children,
  variant = "default",
}: BadgeProps) {
  const variants = {
    default:
      "bg-[var(--surface-soft)] text-[var(--text-muted)]",

    primary:
      "bg-[var(--primary-soft)] text-[var(--primary)]",

    success:
      "bg-[var(--success-soft)] text-[var(--success)]",

    warning:
      "bg-[var(--warning-soft)] text-[var(--warning)]",

    danger:
      "bg-[var(--danger-soft)] text-[var(--danger)]",
  };

  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        px-3
        py-1.5
        text-xs
        font-semibold
        ${variants[variant]}
      `}
    >
      {children}
    </span>
  );
}