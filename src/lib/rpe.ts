/**
 * RPE (rate of perceived exertion), the 6–10 scale used by Hevy and most
 * strength apps. 10 means no reps left in the tank.
 */
export const RPE_OPTIONS = [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10] as const;

const DESCRIPTIONS: Record<number, string> = {
  6: "Could do 4+ more reps",
  6.5: "Could do 3–4 more reps",
  7: "Could do 3 more reps",
  7.5: "Could do 2–3 more reps",
  8: "Could do 2 more reps",
  8.5: "Could do 1–2 more reps",
  9: "Could do 1 more rep",
  9.5: "Maybe 1 more rep",
  10: "Max effort, nothing left",
};

export function isValidRpe(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 6 &&
    value <= 10 &&
    Number.isInteger(value * 2)
  );
}

export function describeRpe(value: number): string {
  return DESCRIPTIONS[value] ?? "";
}

export function formatRpe(value: number | null | undefined): string {
  return isValidRpe(value) ? String(value) : "";
}
