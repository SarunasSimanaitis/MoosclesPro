import type {
  HTMLAttributes,
  ReactNode,
} from "react";

type BadgeVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "danger";

type BadgeProps =
  HTMLAttributes<HTMLSpanElement> & {
    children: ReactNode;
    variant?: BadgeVariant;
  };

export default function Badge({
  children,
  variant = "default",
  className = "",
  ...props
}: BadgeProps) {
  const variants: Record<
    BadgeVariant,
    string
  > = {
    default: `
      bg-[var(--surface-soft)]
      text-[var(--text-muted)]
    `,

    primary: `
      bg-[var(--primary-soft)]
      text-[var(--primary)]
    `,

    success: `
      bg-[var(--success-soft)]
      text-[var(--success)]
    `,

    warning: `
      bg-[var(--warning-soft)]
      text-[var(--warning)]
    `,

    danger: `
      bg-[var(--danger-soft)]
      text-[var(--danger)]
    `,
  };

  return (
    <span
      {...props}
      className={`
        inline-flex
        items-center
        rounded-full
        border
        border-transparent
        px-3
        py-1.5
        text-xs
        font-semibold
        leading-none
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}