import type { InputHTMLAttributes } from "react";

type InputProps =
  InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    error?: string;
  };

export default function Input({
  label,
  error,
  className = "",
  ...props
}: InputProps) {
  return (
    <label className="block">
      {label && (
        <span className="mb-2 block text-sm font-semibold text-[var(--text-muted)]">
          {label}
        </span>
      )}

      <input
        {...props}
        className={`
          w-full
          rounded-xl
          border
          border-[var(--border-strong)]
          bg-[var(--surface)]
          px-4
          py-3
          text-[var(--text)]
          outline-none
          transition
          placeholder:text-[var(--text-muted)]
          focus:border-[var(--primary)]
          focus:ring-2
          focus:ring-[var(--primary-soft)]
          ${className}
        `}
      />

      {error && (
        <p className="mt-2 text-sm text-[var(--danger)]">
          {error}
        </p>
      )}
    </label>
  );
}