import type { InputHTMLAttributes, ReactNode } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
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
    hint && id ? `${id}-hint` : null,
    error && id ? `${id}-error` : null,
  ].filter(Boolean).join(" ") || undefined;

  return (
    <div>
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-[var(--text)]">
          {label}
        </label>
      )}
      {hint && (
        <p id={id ? `${id}-hint` : undefined} className="mb-2 text-xs leading-relaxed text-[var(--text-muted)]">
          {hint}
        </p>
      )}
      <div className="relative">
        {leadingIcon && (
          <span aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
            {leadingIcon}
          </span>
        )}
        <input
          {...props}
          id={id}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`
            min-h-11 w-full rounded-[var(--radius-md)] border
            ${error ? "border-[var(--danger)]" : "border-[var(--border)]"}
            bg-[var(--surface-soft)] px-3 py-2.5 text-[16px] text-[var(--text)] sm:text-sm
            outline-none transition-[border-color] duration-150
            focus:border-[var(--text-subtle)]
            disabled:opacity-50 ${leadingIcon ? "pl-10" : ""} ${className}
          `}
        />
      </div>
      {error && (
        <p id={id ? `${id}-error` : undefined} role="alert" className="mt-2 text-sm font-medium text-[var(--danger)]">
          {error}
        </p>
      )}
    </div>
  );
}
