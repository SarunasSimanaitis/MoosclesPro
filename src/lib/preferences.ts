export type AppPreferences = {
  weeklyGoalTarget: number;
  defaultRestSeconds: number;
};

const STORAGE_KEY = "mooscles-preferences";

const DEFAULT_PREFERENCES: AppPreferences = {
  weeklyGoalTarget: 5,
  defaultRestSeconds: 90,
};

export function getAppPreferences(): AppPreferences {
  if (typeof window === "undefined") {
    return DEFAULT_PREFERENCES;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFERENCES;

    const value = JSON.parse(raw) as Partial<AppPreferences>;
    return {
      weeklyGoalTarget: clamp(value.weeklyGoalTarget, 1, 7, DEFAULT_PREFERENCES.weeklyGoalTarget),
      defaultRestSeconds: clamp(value.defaultRestSeconds, 30, 240, DEFAULT_PREFERENCES.defaultRestSeconds),
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function saveAppPreferences(changes: Partial<AppPreferences>): AppPreferences {
  const next = { ...getAppPreferences(), ...changes };
  next.weeklyGoalTarget = clamp(next.weeklyGoalTarget, 1, 7, DEFAULT_PREFERENCES.weeklyGoalTarget);
  next.defaultRestSeconds = clamp(next.defaultRestSeconds, 30, 240, DEFAULT_PREFERENCES.defaultRestSeconds);

  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Keep the updated preferences in memory for the current page.
    }
  }

  return next;
}

function clamp(value: unknown, min: number, max: number, fallback: number): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, Math.round(value)));
}
