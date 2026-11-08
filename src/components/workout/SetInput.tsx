import { forwardRef, useState, type KeyboardEvent } from "react";

type SetInputProps = {
  value: number;
  onCommit: (value: number) => void;
  /** Allow decimals (weights) or whole numbers only (reps). */
  decimals: boolean;
  placeholder?: string;
  ariaLabel: string;
  disabled?: boolean;
  invalid?: boolean;
};

function display(value: number, decimals: boolean) {
  if (!value) return "";
  return decimals ? String(Math.round(value * 100) / 100) : String(Math.round(value));
}

/**
 * A compact number cell for the set table. It keeps what you type as text
 * while editing and only commits a clean number when you leave the field
 * or press Enter, so "12." or an empty field never causes a jump.
 */
const SetInput = forwardRef<HTMLInputElement, SetInputProps>(function SetInput(
  { value, onCommit, decimals, placeholder, ariaLabel, disabled, invalid },
  ref,
) {
  const [draft, setDraft] = useState<string | null>(null);
  const text = draft ?? display(value, decimals);

  function commit() {
    if (draft === null) return;

    const parsed = Number.parseFloat(draft.replace(",", "."));
    const next = Number.isFinite(parsed) && parsed > 0 ? (decimals ? parsed : Math.floor(parsed)) : 0;

    setDraft(null);
    if (next !== value) onCommit(next);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") event.currentTarget.blur();
    if (event.key === "Escape") {
      setDraft(null);
      event.currentTarget.blur();
    }
  }

  return (
    <input
      ref={ref}
      type="text"
      inputMode={decimals ? "decimal" : "numeric"}
      enterKeyHint="done"
      autoComplete="off"
      value={text}
      placeholder={placeholder ?? "0"}
      aria-label={ariaLabel}
      aria-invalid={invalid || undefined}
      disabled={disabled}
      onFocus={(event) => {
        setDraft(display(value, decimals));
        // Select on the next frame so mobile Safari keeps the selection.
        const input = event.currentTarget;
        requestAnimationFrame(() => input.select());
      }}
      onChange={(event) => {
        const next = event.target.value;
        const pattern = decimals ? /^\d{0,4}([.,]\d{0,2})?$/ : /^\d{0,4}$/;
        if (pattern.test(next)) setDraft(next);
      }}
      onBlur={commit}
      onKeyDown={handleKeyDown}
      className={[
        "h-9 w-full min-w-0 rounded-[var(--radius-sm)] bg-[var(--surface-soft)] px-1 text-center text-[16px] font-semibold tabular-nums text-[var(--text)] outline-none transition-[box-shadow,background-color] placeholder:font-normal placeholder:text-[var(--text-subtle)] focus:bg-[var(--surface)] focus:ring-2 focus:ring-[var(--primary)] disabled:opacity-60",
        invalid ? "set-input-invalid ring-2 ring-[var(--danger)]" : "",
      ].join(" ")}
    />
  );
});

export default SetInput;
