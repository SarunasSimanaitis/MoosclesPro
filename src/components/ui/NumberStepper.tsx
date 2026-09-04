import {
  Minus,
  Plus,
} from "lucide-react";
import type {
  ChangeEvent,
  KeyboardEvent,
  WheelEvent,
} from "react";

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
  function clamp(
    nextValue: number,
  ) {
    if (!Number.isFinite(nextValue)) {
      return min;
    }

    const minimumValue = Math.max(
      min,
      nextValue,
    );

    if (max === undefined) {
      return minimumValue;
    }

    return Math.min(
      max,
      minimumValue,
    );
  }

  function updateValue(
    nextValue: number,
  ) {
    onChange(
      clamp(nextValue),
    );
  }

  function increment() {
    updateValue(
      value + step,
    );
    onCommit?.();
  }

  function decrement() {
    updateValue(
      value - step,
    );
    onCommit?.();
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLInputElement>,
  ) {
    if (event.key === "Enter") {
      event.preventDefault();
      onCommit?.();
      event.currentTarget.blur();
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      updateValue(
        value + step,
      );

      onCommit?.();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();

      updateValue(
        value - step,
      );

      onCommit?.();
    }
  }

  function handleWheel(
    event: WheelEvent<HTMLInputElement>,
  ) {
    /*
     * Never let scrolling the workout page accidentally
     * modify the currently focused value.
     */
    event.currentTarget.blur();
  }

  function handleChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const rawValue =
      event.target.value;

    if (rawValue === "") {
      onChange(0);
      return;
    }

    /*
     * Allow decimal values when the step requires them.
     * The actual value is still normalized by updateValue
     * when using the +/- controls.
     */
    const decimalPattern =
      step < 1
        ? /^\d*(?:\.\d*)?$/
        : /^\d*$/;

    if (
      !decimalPattern.test(
        rawValue,
      )
    ) {
      return;
    }

    const parsedValue =
      Number(rawValue);

    if (
      Number.isFinite(
        parsedValue,
      )
    ) {
      onChange(parsedValue);
    }
  }

  return (
    <div
      className={`
        flex
        items-center
        overflow-hidden
        rounded-xl
        border
        border-[var(--border-strong)]
        bg-[var(--surface)]
        transition-[border-color,box-shadow,background-color]
        duration-150
        focus-within:border-[var(--primary)]
        focus-within:ring-2
        focus-within:ring-[var(--primary-soft)]
        ${
          disabled
            ? "opacity-50"
            : ""
        }
        ${className}
      `}
    >
      <button
        type="button"
        onClick={decrement}
        disabled={
          disabled ||
          value <= min
        }
        aria-label={`Decrease ${ariaLabel}`}
        className="
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          text-[var(--text-muted)]
          transition-colors
          hover:bg-[var(--surface-soft)]
          hover:text-[var(--primary)]
          disabled:cursor-not-allowed
          disabled:opacity-30
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-inset
          focus-visible:ring-[var(--primary)]
        "
      >
        <Minus
          size={15}
          strokeWidth={2.5}
        />
      </button>

      <input
        type="text"
        inputMode={
          step < 1
            ? "decimal"
            : "numeric"
        }
        value={
          value === 0
            ? ""
            : String(value)
        }
        disabled={disabled}
        aria-label={ariaLabel}
        placeholder="0"
        onChange={handleChange}
        onBlur={onCommit}
        onKeyDown={handleKeyDown}
        onWheel={handleWheel}
        className="
          min-w-0
          flex-1
          appearance-none
          bg-transparent
          px-2
          py-2
          text-center
          font-semibold
          text-[var(--text)]
          outline-none
          placeholder:text-[var(--text-muted)]
          [&::-webkit-inner-spin-button]:appearance-none
          [&::-webkit-outer-spin-button]:appearance-none
        "
      />

      <button
        type="button"
        onClick={increment}
        disabled={
          disabled ||
          (max !== undefined &&
            value >= max)
        }
        aria-label={`Increase ${ariaLabel}`}
        className="
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          text-[var(--text-muted)]
          transition-colors
          hover:bg-[var(--surface-soft)]
          hover:text-[var(--primary)]
          disabled:cursor-not-allowed
          disabled:opacity-30
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-inset
          focus-visible:ring-[var(--primary)]
        "
      >
        <Plus
          size={15}
          strokeWidth={2.5}
        />
      </button>
    </div>
  );
}