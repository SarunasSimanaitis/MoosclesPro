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
    primary: "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm hover:bg-[var(--primary-hover)] hover:shadow-lg",
    secondary: "border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text)] shadow-sm hover:border-[var(--primary)] hover:bg-[var(--surface-hover)]",
    ghost: "text-[var(--text)] hover:bg-[var(--surface-soft)]",
    danger: "bg-[var(--danger)] text-white hover:opacity-90",
  };

  const sizes: Record<ButtonSize, string> = {
    sm: "min-h-11 px-4 py-2.5 text-sm",
    md: "min-h-12 px-5 py-3 text-sm sm:px-6",
    lg: "min-h-14 px-7 py-4 text-base",
  };

  const classes = [
    "inline-flex touch-manipulation items-center justify-center gap-2.5 rounded-full border border-transparent font-semibold leading-none transition-[background-color,border-color,color,box-shadow,transform,opacity] duration-200 active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:opacity-50",
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
