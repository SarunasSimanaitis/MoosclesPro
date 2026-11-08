import { Check, Minus, Plus, Timer, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { useRestCountdown } from "../../hooks/useRestCountdown";
import { formatRestTime, useRestTimerStore } from "../../stores/restTimerStore";

const ADJUST_SECONDS = 15;
const PRESETS = [60, 90, 120, 180];

function ProgressRing({ progress, size, stroke }: { progress: number; size: number; stroke: number }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true" className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--surface-soft)" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--primary)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - progress)}
        style={{ transition: "stroke-dashoffset 250ms linear" }}
      />
    </svg>
  );
}

/** Full-screen timer, Samsung-clock style: one big ring and large controls. */
function RestTimerSheet({ onClose }: { onClose: () => void }) {
  const { running, remaining, progress, label } = useRestCountdown();
  const adjust = useRestTimerStore((state) => state.adjust);
  const stop = useRestTimerStore((state) => state.stop);
  const start = useRestTimerStore((state) => state.start);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // The sheet closes itself once the rest is over.
  useEffect(() => {
    if (!running) onClose();
  }, [running, onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 sm:items-center"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Rest timer"
        className="elevated w-full max-w-sm rounded-t-[20px] bg-[var(--surface)] px-6 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] pt-3 shadow-[var(--shadow-xl)] sm:rounded-[20px] sm:pb-6"
      >
        <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-[var(--border-strong)] sm:hidden" aria-hidden="true" />
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-[var(--text-muted)]">Rest</p>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Minimise timer"
            className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--text-muted)] hover:bg-[var(--surface-soft)]"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="relative mx-auto mt-2 flex h-60 w-60 items-center justify-center">
          <div className="absolute inset-0">
            <ProgressRing progress={progress} size={240} stroke={10} />
          </div>
          <div className="text-center">
            <p className="font-mono text-[56px] font-semibold leading-none tabular-nums tracking-tight text-[var(--text)]" role="timer">
              {formatRestTime(remaining)}
            </p>
            {label && <p className="mx-auto mt-2 max-w-[11rem] truncate text-sm text-[var(--text-muted)]">{label}</p>}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => adjust(-ADJUST_SECONDS)}
            className="flex h-14 items-center justify-center gap-1 rounded-full bg-[var(--surface-soft)] text-base font-semibold text-[var(--text)] hover:bg-[var(--surface-hover)]"
          >
            <Minus size={16} aria-hidden="true" />
            15s
          </button>
          <button
            type="button"
            onClick={stop}
            className="flex h-14 items-center justify-center rounded-full bg-[var(--primary)] text-base font-semibold text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)]"
          >
            Skip
          </button>
          <button
            type="button"
            onClick={() => adjust(ADJUST_SECONDS)}
            className="flex h-14 items-center justify-center gap-1 rounded-full bg-[var(--surface-soft)] text-base font-semibold text-[var(--text)] hover:bg-[var(--surface-hover)]"
          >
            <Plus size={16} aria-hidden="true" />
            15s
          </button>
        </div>

        <div className="mt-5">
          <p className="text-center text-xs text-[var(--text-muted)]">Restart with</p>
          <div className="mt-2 flex justify-center gap-2">
            {PRESETS.map((seconds) => (
              <button
                key={seconds}
                type="button"
                onClick={() => start(seconds, label)}
                className="h-9 rounded-full border border-[var(--border)] px-3 text-sm font-medium text-[var(--text)] hover:bg-[var(--surface-soft)]"
              >
                {formatRestTime(seconds)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

/**
 * The rest timer on the workout screen: a bar docked above the tab bar.
 * It never moves, so it can't end up off screen. Tap it for the big timer.
 */
export default function RestTimerDock() {
  const { running, remaining, progress, label, finishedAt } = useRestCountdown();
  const adjust = useRestTimerStore((state) => state.adjust);
  const stop = useRestTimerStore((state) => state.stop);
  const [sheetOpen, setSheetOpen] = useState(false);
  const closeSheet = useCallback(() => setSheetOpen(false), []);
  const showFinished = !running && finishedAt !== null;

  if (!running && !showFinished) return null;

  return createPortal(
    <>
      <div className="pointer-events-none fixed inset-x-0 bottom-[calc(var(--bottom-offset)+0.5rem)] z-[60] px-3 md:bottom-5 md:left-auto md:right-5 md:w-[24rem] md:px-0">
        <div aria-live="polite" className="sr-only">
          {showFinished ? "Rest finished. Time for your next set." : ""}
        </div>

        {showFinished ? (
          <div className="rest-finished pointer-events-auto mx-auto flex h-14 max-w-md items-center gap-3 rounded-[16px] bg-[var(--success)] px-4 text-white shadow-[var(--shadow-lg)]">
            <Check size={20} strokeWidth={3} aria-hidden="true" />
            <p className="text-sm font-semibold">Rest over · time for your next set</p>
          </div>
        ) : (
          <div className="elevated pointer-events-auto relative mx-auto flex h-14 max-w-md items-center gap-2 overflow-hidden rounded-[16px] border border-[var(--border)] bg-[var(--surface)] pl-2 pr-1.5 shadow-[var(--shadow-lg)]">
            {/* Remaining time drains from right to left. */}
            <span
              aria-hidden="true"
              className="absolute inset-y-0 left-0 bg-[var(--primary-soft)]"
              style={{ width: `${progress * 100}%`, transition: "width 250ms linear" }}
            />

            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              aria-label={`Rest timer, ${formatRestTime(remaining)} left. Open full timer.`}
              className="relative flex min-w-0 flex-1 items-center gap-2.5 self-stretch pl-1 text-left"
            >
              <span className="relative flex h-9 w-9 shrink-0 items-center justify-center">
                <span className="absolute inset-0">
                  <ProgressRing progress={progress} size={36} stroke={3.5} />
                </span>
                <Timer size={15} className="text-[var(--primary)]" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block font-mono text-xl font-semibold leading-none tabular-nums text-[var(--text)]">
                  {formatRestTime(remaining)}
                </span>
                <span className="mt-0.5 block truncate text-[11px] text-[var(--text-muted)]">{label ? `Rest · ${label}` : "Rest"}</span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => adjust(-ADJUST_SECONDS)}
              aria-label="15 seconds less"
              className="relative h-10 rounded-full px-2.5 text-sm font-semibold text-[var(--text)] hover:bg-[var(--surface-soft)]"
            >
              −15
            </button>
            <button
              type="button"
              onClick={() => adjust(ADJUST_SECONDS)}
              aria-label="15 seconds more"
              className="relative h-10 rounded-full px-2.5 text-sm font-semibold text-[var(--text)] hover:bg-[var(--surface-soft)]"
            >
              +15
            </button>
            <button
              type="button"
              onClick={stop}
              className="relative h-10 rounded-full bg-[var(--primary)] px-4 text-sm font-semibold text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)]"
            >
              Skip
            </button>
          </div>
        )}
      </div>

      {sheetOpen && running && <RestTimerSheet onClose={closeSheet} />}
    </>,
    document.body,
  );
}
