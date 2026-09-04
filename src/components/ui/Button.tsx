import type {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger";

type ButtonSize =
  | "sm"
  | "md"
  | "lg";

type ButtonProps =
  ButtonHTMLAttributes<HTMLButtonElement> & {
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
  const variantStyles: Record<
    ButtonVariant,
    string
  > = {
    primary: `
      bg-[var(--primary)]
      text-[var(--primary-foreground)]
      shadow-[var(--shadow-sm)]
      hover:bg-[var(--primary-hover)]
      hover:shadow-[var(--shadow-md)]
    `,
    secondary: `
      border
      border-[var(--border-strong)]
      bg-[var(--surface)]
      text-[var(--text)]
      hover:border-[var(--primary)]
      hover:text-[var(--primary)]
      hover:shadow-[var(--shadow-sm)]
    `,
    ghost: `
      text-[var(--text-muted)]
      hover:bg-[var(--surface)]
      hover:text-[var(--text)]
    `,
    danger: `
      bg-[var(--danger)]
      text-[var(--primary-foreground)]
      shadow-[var(--shadow-sm)]
      hover:opacity-90
      hover:shadow-[var(--shadow-md)]
    `,
  };

  const sizeStyles: Record<
    ButtonSize,
    string
  > = {
    sm: `
      min-h-10
      px-3.5
      py-2
      text-sm
    `,
    md: `
      min-h-11
      px-5
      py-2.5
      text-sm
    `,
    lg: `
      min-h-12
      px-6
      py-3
      text-base
    `,
  };

  return (
    <button
      {...props}
      type={type}
      disabled={disabled || loading}
      aria-busy={
        loading || undefined
      }
      className={`
        inline-flex
        items-center
        justify-center
        gap-2
        rounded-[var(--radius-md)]
        border
        border-transparent
        font-semibold
        leading-none
        transition-[background-color,border-color,color,box-shadow,transform,opacity]
        duration-200
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-[var(--primary)]
        focus-visible:ring-offset-2
        focus-visible:ring-offset-[var(--background)]
        active:translate-y-px
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="
            h-4
            w-4
            animate-spin
            rounded-full
            border-2
            border-current
            border-t-transparent
          "
        />
      )}

      {children}
    </button>
  );
}