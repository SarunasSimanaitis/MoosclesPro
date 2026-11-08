export type AppPreferences = {
  weeklyGoalTarget: number;
  defaultRestSeconds: number;
  weightUnit: "kg" | "lb";
  /** Play a short sound when a rest timer ends. */
  restSound: boolean;
  /** Vibrate (on phones that support it) when a rest timer ends. */
  restVibration: boolean;
  /**
   * Rest times the user changed during a workout, keyed by
   * "routineId:exerciseId". This works for premade routines too, which
   * can't be edited directly.
   */
  restOverrides: Record<string, number>;
};

const STORAGE_KEY = "mooscles-preferences";

export const MAX_REST_SECONDS = 600;

const DEFAULT_PREFERENCES: AppPreferences = {
  weeklyGoalTarget: 5,
  defaultRestSeconds: 90,
  weightUnit: "kg",
  restSound: true,
  restVibration: true,
  restOverrides: {},
};

function sanitizeRestOverrides(value: unknown): Record<string, number> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  const overrides: Record<string, number> = {};
  for (const [key, seconds] of Object.entries(value)) {
    if (typeof seconds === "number" && Number.isFinite(seconds)) {
      overrides[key] = Math.min(MAX_REST_SECONDS, Math.max(0, Math.round(seconds)));
    }
  }
  return overrides;
}

function normalize(value: Partial<AppPreferences>): AppPreferences {
  return {
    weeklyGoalTarget: clamp(value.weeklyGoalTarget, 1, 7, DEFAULT_PREFERENCES.weeklyGoalTarget),
    defaultRestSeconds: clamp(value.defaultRestSeconds, 30, 240, DEFAULT_PREFERENCES.defaultRestSeconds),
    weightUnit: value.weightUnit === "lb" ? "lb" : "kg",
    restSound: typeof value.restSound === "boolean" ? value.restSound : DEFAULT_PREFERENCES.restSound,
    restVibration: typeof value.restVibration === "boolean" ? value.restVibration : DEFAULT_PREFERENCES.restVibration,
    restOverrides: sanitizeRestOverrides(value.restOverrides),
  };
}

export function getAppPreferences(): AppPreferences {
  if (typeof window === "undefined") {
    return DEFAULT_PREFERENCES;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFERENCES;

    return normalize(JSON.parse(raw) as Partial<AppPreferences>);
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function saveAppPreferences(changes: Partial<AppPreferences>): AppPreferences {
  const next = normalize({ ...getAppPreferences(), ...changes });

  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Keep the updated preferences in memory for the current page.
    }
  }

  return next;
}

function restOverrideKey(routineId: string, exerciseId: string) {
  return `${routineId}:${exerciseId}`;
}

/** Rest overrides for one routine, keyed by exercise id. */
export function getRestOverrides(routineId: string): Record<string, number> {
  const prefix = `${routineId}:`;
  const overrides: Record<string, number> = {};

  for (const [key, seconds] of Object.entries(getAppPreferences().restOverrides)) {
    if (key.startsWith(prefix)) overrides[key.slice(prefix.length)] = seconds;
  }

  return overrides;
}

export function saveRestOverride(routineId: string, exerciseId: string, seconds: number) {
  const { restOverrides } = getAppPreferences();
  saveAppPreferences({
    restOverrides: { ...restOverrides, [restOverrideKey(routineId, exerciseId)]: seconds },
  });
}

function clamp(value: unknown, min: number, max: number, fallback: number): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, Math.round(value)));
}
