import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  className = "",
  disabled = false,
  type = "button",
  ...props
}: ButtonProps) {
  const variants: Record<ButtonVariant, string> = {
    primary: "bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)]",
    secondary: "bg-[var(--surface-soft)] text-[var(--text)] hover:bg-[var(--surface-hover)]",
    ghost: "text-[var(--text)] hover:bg-[var(--surface-soft)]",
    danger: "bg-[var(--danger)] text-white hover:opacity-90",
  };

  const sizes: Record<ButtonSize, string> = {
    sm: "min-h-9 px-3.5 py-2 text-sm",
    md: "min-h-11 px-4 py-2.5 text-sm",
    lg: "min-h-12 px-5 py-3 text-[15px]",
  };

  const classes = [
    "inline-flex touch-manipulation select-none items-center justify-center gap-2 rounded-[var(--radius-md)] font-semibold leading-none transition-[background-color,color,opacity] duration-150 active:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] disabled:opacity-40",
    variants[variant],
    sizes[size],
    className,
  ].join(" ");

  return (
    <button
      {...props}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={classes}
    >
      {loading && (
        <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}
