import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { routines } from "../src/data/routines";
import { describeRpe, formatRpe, isValidRpe, RPE_OPTIONS } from "../src/lib/rpe";
import { validateWorkoutSessionPayload } from "../src/lib/validation";
import {
  addWorkoutSet,
  buildWorkoutSession,
  calculateWorkoutMetrics,
  createWorkoutExercises,
  getPreviousPerformance,
  normalizeWeight,
  removeWorkoutSet,
  setExerciseRest,
  setExerciseSkipped,
} from "../src/lib/workoutEngine";
import { toKilograms } from "../src/lib/units";
import { formatRestTime, getRestRemainingSeconds, useRestTimerStore } from "../src/stores/restTimerStore";
import type { WorkoutSession } from "../src/types/WorkoutSession";

const routine = routines[0];
const firstId = routine.exercises[0].exercise.id;

function sessionWith(exercises = createWorkoutExercises(routine)): WorkoutSession {
  return {
    id: "s1",
    routineId: routine.id,
    startedAt: "2026-11-08T10:00:00.000Z",
    completedAt: "2026-11-08T11:00:00.000Z",
    exercises,
  };
}

describe("RPE", () => {
  it("accepts 6 to 10 in half steps only", () => {
    for (const value of RPE_OPTIONS) expect(isValidRpe(value)).toBe(true);
    for (const value of [5.5, 10.5, 7.25, Number.NaN, "8", null]) expect(isValidRpe(value)).toBe(false);
  });

  it("formats and describes values", () => {
    expect(formatRpe(8.5)).toBe("8.5");
    expect(formatRpe(null)).toBe("");
    expect(describeRpe(10)).toMatch(/max/i);
  });
});

describe("saving a workout (server validation)", () => {
  function withSet(changes: Record<string, unknown>) {
    const exercises = createWorkoutExercises(routine);
    exercises[0].sets[0] = { ...exercises[0].sets[0], weight: 60, reps: 8, completed: true, ...changes };
    return sessionWith(exercises);
  }

  it("accepts a valid RPE and keeps it", () => {
    const result = validateWorkoutSessionPayload(withSet({ rpe: 8.5 }));
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.exercises[0].sets[0].rpe).toBe(8.5);
  });

  it("rejects an invalid RPE", () => {
    expect(validateWorkoutSessionPayload(withSet({ rpe: 11 })).success).toBe(false);
  });

  it("accepts weights logged in pounds (decimal kilograms)", () => {
    // 100 lb is 45.359… kg: this used to be rejected, so pound users couldn't save.
    const result = validateWorkoutSessionPayload(withSet({ weight: toKilograms(100, "lb") }));
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.exercises[0].sets[0].weight).toBe(45.36);
  });

  it("rejects impossible numbers", () => {
    expect(validateWorkoutSessionPayload(withSet({ weight: -1 })).success).toBe(false);
    expect(validateWorkoutSessionPayload(withSet({ weight: 5000 })).success).toBe(false);
    expect(validateWorkoutSessionPayload(withSet({ reps: 2.5 })).success).toBe(false);
  });

  it("stores only known fields", () => {
    const result = validateWorkoutSessionPayload(withSet({ injected: "<script>", rpe: undefined }));
    expect(result.success).toBe(true);
    if (result.success) {
      const set = result.data.exercises[0].sets[0] as unknown as Record<string, unknown>;
      expect(set.injected).toBeUndefined();
      expect(Object.keys(set).sort()).toEqual(["completed", "id", "order", "reps", "weight"]);
    }
  });
});

describe("starting a workout", () => {
  it("pre-fills from last time and applies remembered rest times", () => {
    const last = createWorkoutExercises(routine);
    last[0].sets[0] = { ...last[0].sets[0], weight: 70, reps: 6, completed: true, rpe: 9 };

    const previous = getPreviousPerformance(sessionWith(last));
    const exercises = createWorkoutExercises(routine, { previous, restOverrides: { [firstId]: 45 } });

    expect(previous[firstId]).toEqual([{ weight: 70, reps: 6, rpe: 9 }]);
    expect(exercises[0].sets[0]).toMatchObject({ weight: 70, reps: 6, completed: false });
    expect(exercises[0].sets[0].rpe).toBeUndefined();
    expect(exercises[0].restSeconds).toBe(45);
    expect(exercises[1].restSeconds).toBe(routine.exercises[1].restSeconds);
  });

  it("has no previous data without a previous session", () => {
    expect(getPreviousPerformance(null)).toEqual({});
  });
});

describe("editing a workout in progress", () => {
  it("changes rest per exercise within 0–10 minutes", () => {
    const exercises = createWorkoutExercises(routine);
    expect(setExerciseRest(exercises, firstId, 150)[0].restSeconds).toBe(150);
    expect(setExerciseRest(exercises, firstId, 9999)[0].restSeconds).toBe(600);
    expect(setExerciseRest(exercises, firstId, -5)[0].restSeconds).toBe(0);
  });

  it("adds a set copying the last one and removes sets with renumbering", () => {
    let exercises = createWorkoutExercises(routine);
    const count = exercises[0].sets.length;
    exercises[0].sets[count - 1] = { ...exercises[0].sets[count - 1], weight: 50, reps: 10 };

    exercises = addWorkoutSet(exercises, firstId);
    expect(exercises[0].sets).toHaveLength(count + 1);
    expect(exercises[0].sets[count]).toMatchObject({ order: count + 1, weight: 50, reps: 10, completed: false });

    exercises = removeWorkoutSet(exercises, firstId, exercises[0].sets[0].id);
    expect(exercises[0].sets.map((set) => set.order)).toEqual(Array.from({ length: count }, (_, index) => index + 1));
  });

  it("never removes the last remaining set", () => {
    let exercises = createWorkoutExercises(routine);
    for (const set of [...exercises[0].sets]) exercises = removeWorkoutSet(exercises, firstId, set.id);
    expect(exercises[0].sets).toHaveLength(1);
  });

  it("leaves a skipped exercise's unfinished sets out of the progress", () => {
    let exercises = createWorkoutExercises(routine);
    const before = calculateWorkoutMetrics(exercises).totalSets;
    exercises = setExerciseSkipped(exercises, firstId, true);
    expect(calculateWorkoutMetrics(exercises).totalSets).toBe(before - exercises[0].sets.length);
  });

  it("drops skipped exercises with nothing done when saving, keeps ones with work", () => {
    let exercises = createWorkoutExercises(routine);
    const secondId = exercises[1].exercise.id;
    exercises[1].sets[0] = { ...exercises[1].sets[0], weight: 20, reps: 10, completed: true };
    exercises = setExerciseSkipped(exercises, firstId, true);
    exercises = setExerciseSkipped(exercises, secondId, true);

    const session = buildWorkoutSession({ id: "w", routineId: routine.id, startedAt: "2026-11-08T10:00:00.000Z", exercises }, "2026-11-08T11:00:00.000Z");
    const ids = session.exercises.map((exercise) => exercise.exercise.id);

    expect(ids).not.toContain(firstId);
    expect(ids).toContain(secondId);
  });

  it("rounds stored weights to 0.01 kg", () => {
    expect(normalizeWeight(45.359237)).toBe(45.36);
  });
});

describe("rest timer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-08T10:00:00.000Z"));
    useRestTimerStore.getState().stop();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("counts down from an end time", () => {
    useRestTimerStore.getState().start(90, "Bench");
    const { endsAt, durationSeconds, label } = useRestTimerStore.getState();

    expect(durationSeconds).toBe(90);
    expect(label).toBe("Bench");
    expect(getRestRemainingSeconds(endsAt)).toBe(90);

    vi.advanceTimersByTime(30_500);
    expect(getRestRemainingSeconds(endsAt)).toBe(60);
  });

  it("adds and removes 15 seconds", () => {
    const store = useRestTimerStore.getState();
    store.start(60);
    store.adjust(15);
    expect(getRestRemainingSeconds(useRestTimerStore.getState().endsAt)).toBe(75);
    useRestTimerStore.getState().adjust(-30);
    expect(getRestRemainingSeconds(useRestTimerStore.getState().endsAt)).toBe(45);
  });

  it("ends the rest when time is taken off past zero", () => {
    useRestTimerStore.getState().start(10);
    useRestTimerStore.getState().adjust(-15);
    expect(useRestTimerStore.getState().endsAt).toBeNull();
  });

  it("does not start for zero or invalid lengths", () => {
    useRestTimerStore.getState().start(0);
    expect(useRestTimerStore.getState().endsAt).toBeNull();
    useRestTimerStore.getState().start(Number.NaN);
    expect(useRestTimerStore.getState().endsAt).toBeNull();
  });

  it("formats time as m:ss", () => {
    expect(formatRestTime(0)).toBe("0:00");
    expect(formatRestTime(65)).toBe("1:05");
    expect(formatRestTime(600)).toBe("10:00");
  });
});
