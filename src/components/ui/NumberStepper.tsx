import {
  Minus,
  Plus,
} from "lucide-react";
import type {
  ChangeEvent,
  KeyboardEvent,
  WheelEvent,
} from "react";
import { useState } from "react";

type NumberStepperProps = {
  value: number;
  onChange: (value: number) => void;
  onCommit?: () => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
};

export default function NumberStepper({
  value,
  onChange,
  onCommit,
  min = 0,
  max,
  step = 1,
  disabled = false,
  ariaLabel = "Number",
  className = "",
}: NumberStepperProps) {
  const [draft, setDraft] = useState<string | null>(null);

  function clamp(nextValue: number) {
    if (!Number.isFinite(nextValue)) return min;
    return max === undefined
      ? Math.max(min, nextValue)
      : Math.min(max, Math.max(min, nextValue));
  }

  function updateValue(nextValue: number) {
    onChange(clamp(nextValue));
  }

  function stepValue(direction: -1 | 1) {
    setDraft(null);
    updateValue(value + step * direction);
    onCommit?.();
  }

  function handleBlur() {
    if (draft !== null) {
      const parsedValue = draft.trim() === "" ? 0 : Number(draft);
      onChange(clamp(parsedValue));
      setDraft(null);
    }
    onCommit?.();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      event.currentTarget.blur();
      return;
    }

    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      stepValue(event.key === "ArrowUp" ? 1 : -1);
    }
  }

  function handleWheel(event: WheelEvent<HTMLInputElement>) {
    // Scrolling the workout should never change the focused value.
    event.currentTarget.blur();
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const rawValue = event.target.value;
    const decimalPattern = step < 1 ? /^\d*(?:\.\d*)?$/ : /^\d*$/;
    if (!decimalPattern.test(rawValue)) return;

    setDraft(rawValue);
    if (rawValue === "") {
      onChange(0);
      return;
    }

    const parsedValue = Number(rawValue);
    if (Number.isFinite(parsedValue)) onChange(clamp(parsedValue));
  }

  const canDecrement = !disabled && value > min;
  const canIncrement = !disabled && (max === undefined || value < max);

  return (
    <div
      className={`number-stepper grid min-h-12 grid-cols-[2.25rem_minmax(1.25rem,1fr)_2.25rem] items-center gap-1 rounded-2xl border border-[var(--border-strong)] bg-[var(--surface)] p-1 transition-[border-color,background-color,box-shadow] duration-200 focus-within:border-[var(--primary)] focus-within:ring-2 focus-within:ring-[var(--focus-ring)] sm:min-h-[3.5rem] sm:grid-cols-[2.75rem_minmax(2.5rem,1fr)_2.75rem] ${disabled ? "opacity-50" : ""} ${className}`}
    >
      <button
        type="button"
        onClick={() => stepValue(-1)}
        disabled={!canDecrement}
        aria-label={`Decrease ${ariaLabel}`}
        className="stepper-button flex h-9 w-9 touch-manipulation items-center justify-center rounded-xl bg-[var(--surface-soft)] text-[var(--text-muted)] transition-[background-color,color,transform] duration-150 hover:bg-[var(--surface-hover)] hover:text-[var(--text)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--primary)] sm:h-11 sm:w-11"
      >
        <Minus size={16} strokeWidth={2.5} aria-hidden="true" />
      </button>

      <input
        type="text"
        inputMode={step < 1 ? "decimal" : "numeric"}
        value={draft ?? (value === 0 ? "" : String(value))}
        disabled={disabled}
        aria-label={ariaLabel}
        placeholder="0"
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onWheel={handleWheel}
        className="min-w-0 min-h-9 w-full bg-transparent px-0.5 text-center text-sm font-black tabular-nums text-[var(--text)] outline-none placeholder:font-semibold placeholder:text-[var(--text-subtle)] sm:min-h-11 sm:px-1 sm:text-lg"
      />

      <button
        type="button"
        onClick={() => stepValue(1)}
        disabled={!canIncrement}
        aria-label={`Increase ${ariaLabel}`}
        className="stepper-button flex h-9 w-9 touch-manipulation items-center justify-center rounded-xl bg-[var(--surface-soft)] text-[var(--text-muted)] transition-[background-color,color,transform] duration-150 hover:bg-[var(--primary-soft)] hover:text-[var(--primary)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--primary)] sm:h-11 sm:w-11"
      >
        <Plus size={16} strokeWidth={2.5} aria-hidden="true" />
      </button>
    </div>
  );
}
