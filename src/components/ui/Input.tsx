import type {
  InputHTMLAttributes,
  ReactNode,
} from "react";

type InputProps =
  InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    error?: string;
    hint?: string;
    leadingIcon?: ReactNode;
  };

export default function Input({
  label,
  error,
  hint,
  leadingIcon,
  id,
  className = "",
  disabled,
  ...props
}: InputProps) {
  const describedBy = [
    hint && id
      ? `${id}-hint`
      : null,
    error && id
      ? `${id}-error`
      : null,
  ]
    .filter(Boolean)
    .join(" ") || undefined;

  return (
    <div className="block">
      {label && (
        <label
          htmlFor={id}
          className="mb-2 block text-sm font-semibold text-[var(--text)]"
        >
          {label}
        </label>
      )}

      {hint && (
        <p
          id={
            id
              ? `${id}-hint`
              : undefined
          }
          className="mb-2 text-xs text-[var(--text-muted)]"
        >
          {hint}
        </p>
      )}

      <div className="relative">
        {leadingIcon && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
          >
            {leadingIcon}
          </span>
        )}

        <input
          {...props}
          id={id}
          disabled={disabled}
          aria-invalid={
            error ? true : undefined
          }
          aria-describedby={describedBy}
          className={`
            w-full
            rounded-[var(--radius-md)]
            border
            ${
              error
                ? "border-[var(--danger)]"
                : "border-[var(--border-strong)]"
            }
            bg-[var(--surface)]
            px-4
            py-3
            text-[var(--text)]
            outline-none
            transition-[border-color,box-shadow,background-color]
            duration-200
            placeholder:text-[var(--text-muted)]
            focus:border-[var(--primary)]
            focus:ring-2
            focus:ring-[var(--focus-ring)]
            disabled:cursor-not-allowed
            disabled:opacity-50
            ${leadingIcon ? "pl-11" : ""}
            ${className}
          `}
        />
      </div>

      {error && (
        <p
          id={
            id
              ? `${id}-error`
              : undefined
          }
          role="alert"
          className="mt-2 text-sm font-medium text-[var(--danger)]"
        >
          {error}
        </p>
      )}
    </div>
  );
}