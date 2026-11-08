import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * The rest timer is stored as an end timestamp rather than a ticking counter,
 * so it stays correct across refreshes, navigation and a locked phone
 * (where browsers pause timers).
 */
export type RestTimerState = {
  /** When the rest ends (ms since epoch), or null when no rest is running. */
  endsAt: number | null;
  /** Total length of the current rest in seconds (for the progress ring). */
  durationSeconds: number;
  /** What the rest is for, e.g. "Barbell Bench Press". */
  label: string;
  /** When the last rest ran out (not persisted), used for a short "rest over" flash. */
  finishedAt: number | null;
  start: (seconds: number, label?: string) => void;
  adjust: (deltaSeconds: number) => void;
  stop: () => void;
  /** Called when the countdown reaches zero. */
  complete: () => void;
  /** Ends the short "rest over" flash. */
  clearFinished: () => void;
};

export const MIN_REST_SECONDS = 5;

export const useRestTimerStore = create<RestTimerState>()(
  persist(
    (set) => ({
      endsAt: null,
      durationSeconds: 0,
      label: "",
      finishedAt: null,

      start: (seconds, label = "") => {
        if (!Number.isFinite(seconds) || seconds <= 0) {
          set({ endsAt: null, durationSeconds: 0, label: "" });
          return;
        }

        const duration = Math.round(seconds);
        set({ endsAt: Date.now() + duration * 1000, durationSeconds: duration, label, finishedAt: null });
      },

      adjust: (deltaSeconds) => {
        set((state) => {
          if (state.endsAt === null || !Number.isFinite(deltaSeconds)) return state;

          const now = Date.now();
          const remaining = Math.max(0, state.endsAt - now);
          const nextRemaining = remaining + deltaSeconds * 1000;

          // Taking time off below a few seconds just ends the rest.
          if (nextRemaining < MIN_REST_SECONDS * 1000 && deltaSeconds < 0) {
            return { endsAt: null, durationSeconds: 0, label: "" };
          }

          return {
            endsAt: now + nextRemaining,
            // Keep the ring sensible: the total never drops below what's left.
            durationSeconds: Math.max(
              Math.ceil(nextRemaining / 1000),
              state.durationSeconds + deltaSeconds,
            ),
          };
        });
      },

      stop: () => set({ endsAt: null, durationSeconds: 0, label: "", finishedAt: null }),

      complete: () => set({ endsAt: null, durationSeconds: 0, finishedAt: Date.now() }),

      clearFinished: () => set({ finishedAt: null }),
    }),
    {
      name: "mooscles-rest-timer",
      partialize: (state) => ({
        endsAt: state.endsAt,
        durationSeconds: state.durationSeconds,
        label: state.label,
      }),
    },
  ),
);

/** Seconds left (rounded up) for a rest ending at `endsAt`. */
export function getRestRemainingSeconds(endsAt: number | null, now = Date.now()) {
  if (endsAt === null) return 0;
  return Math.max(0, Math.ceil((endsAt - now) / 1000));
}

export function formatRestTime(totalSeconds: number) {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
