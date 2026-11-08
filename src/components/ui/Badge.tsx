import type { HTMLAttributes, ReactNode } from "react";

type BadgeVariant = "default" | "primary" | "success" | "warning" | "danger";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  variant?: BadgeVariant;
};

export default function Badge({
  children,
  variant = "default",
  className = "",
  ...props
}: BadgeProps) {
  const variants: Record<BadgeVariant,string> = {
    default: "bg-[var(--surface-soft)] text-[var(--text-muted)]",
    primary: "bg-[var(--primary-soft)] text-[var(--primary)]",
    success: "bg-[var(--success-soft)] text-[var(--success)]",
    warning: "bg-[var(--warning-soft)] text-[var(--warning)]",
    danger: "bg-[var(--danger-soft)] text-[var(--danger)]",
  };
  return (
    <span
      {...props}
      className={`inline-flex min-h-6 items-center rounded-[var(--radius-sm)] px-2 py-1 text-xs font-semibold leading-none ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
