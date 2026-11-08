import { describe, expect, it } from "vitest";

import { routines } from "../src/data/routines";
import { isSectionActive } from "../src/data/navigation";
import {
  applyPreviousPerformance,
  buildWorkoutSession,
  calculateWorkoutMetrics,
  createWorkoutExercises,
  normalizeReps,
  normalizeWeight,
  updateWorkoutSet,
} from "../src/lib/workoutEngine";
import type { WorkoutExercise } from "../src/types/WorkoutExercise";
import type { WorkoutSession } from "../src/types/WorkoutSession";

const routine = routines[0];

function previousSession(exercises: WorkoutExercise[]): WorkoutSession {
  return {
    id: "previous",
    routineId: routine.id,
    startedAt: "2026-11-01T10:00:00.000Z",
    completedAt: "2026-11-01T11:00:00.000Z",
    exercises,
  };
}

describe("built-in routines", () => {
  it("never repeat an exercise inside one routine", () => {
    // Set toggling looks exercises up by id, so a repeat would make sets un-tickable.
    for (const item of routines) {
      const ids = item.exercises.map((exercise) => exercise.exercise.id);
      expect(new Set(ids).size, item.name).toBe(ids.length);
    }
  });

  it("have unique ids", () => {
    const ids = routines.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("creating a workout", () => {
  it("creates one empty set per target set, numbered from 1", () => {
    const exercises = createWorkoutExercises(routine);

    expect(exercises).toHaveLength(routine.exercises.length);
    exercises.forEach((exercise, index) => {
      expect(exercise.sets).toHaveLength(routine.exercises[index].targetSets);
      expect(exercise.sets.map((set) => set.order)).toEqual(
        exercise.sets.map((_, setIndex) => setIndex + 1),
      );
      expect(exercise.sets.every((set) => !set.completed && set.weight === 0 && set.reps === 0)).toBe(true);
    });

    const setIds = exercises.flatMap((exercise) => exercise.sets.map((set) => set.id));
    expect(new Set(setIds).size).toBe(setIds.length);
  });
});

describe("updating sets and metrics", () => {
  it("only changes the targeted set", () => {
    const exercises = createWorkoutExercises(routine);
    const target = exercises[0].sets[1];

    const updated = updateWorkoutSet(exercises, exercises[0].exercise.id, target.id, (set) => ({
      ...set,
      weight: 60,
      reps: 8,
      completed: true,
    }));

    expect(updated[0].sets[1]).toMatchObject({ weight: 60, reps: 8, completed: true });
    expect(updated[0].sets[0]).toEqual(exercises[0].sets[0]);
    expect(updated[1]).toBe(exercises[1]);
  });

  it("counts volume from completed sets only", () => {
    const exercises = createWorkoutExercises(routine);
    exercises[0].sets[0] = { ...exercises[0].sets[0], weight: 100, reps: 5, completed: true };
    exercises[0].sets[1] = { ...exercises[0].sets[1], weight: 100, reps: 5, completed: false };

    const metrics = calculateWorkoutMetrics(exercises);
    const totalSets = exercises.reduce((sum, exercise) => sum + exercise.sets.length, 0);

    expect(metrics.completedSets).toBe(1);
    expect(metrics.totalSets).toBe(totalSets);
    expect(metrics.totalVolume).toBe(500);
    expect(metrics.progress).toBeCloseTo((1 / totalSets) * 100);
  });

  it("reports zero progress for an empty workout", () => {
    expect(calculateWorkoutMetrics([])).toEqual({ completedSets: 0, totalSets: 0, progress: 0, totalVolume: 0 });
  });
});

describe("pre-filling from last time", () => {
  it("copies weight and reps from the matching completed set", () => {
    const last = createWorkoutExercises(routine);
    last[0].sets[0] = { ...last[0].sets[0], weight: 80, reps: 6, completed: true };

    const next = applyPreviousPerformance(createWorkoutExercises(routine), previousSession(last));

    expect(next[0].sets[0]).toMatchObject({ weight: 80, reps: 6, completed: false });
  });

  it("ignores sets that were not completed last time", () => {
    const last = createWorkoutExercises(routine);
    last[0].sets[0] = { ...last[0].sets[0], weight: 80, reps: 6, completed: true };
    last[0].sets[1] = { ...last[0].sets[1], weight: 999, reps: 99, completed: false };

    const next = applyPreviousPerformance(createWorkoutExercises(routine), previousSession(last));

    expect(next[0].sets[1]).toMatchObject({ weight: 0, reps: 0 });
  });

  it("returns the workout unchanged without a previous session", () => {
    const exercises = createWorkoutExercises(routine);
    expect(applyPreviousPerformance(exercises, null)).toBe(exercises);
  });

  it("cleans up invalid stored numbers", () => {
    expect(normalizeWeight(Number.NaN)).toBe(0);
    expect(normalizeWeight(-5)).toBe(0);
    expect(normalizeWeight(42.5)).toBe(42.5);
    expect(normalizeReps(7.8)).toBe(7);
    expect(normalizeReps(Number.POSITIVE_INFINITY)).toBe(0);
  });
});

describe("finishing a workout", () => {
  const active = {
    id: "w1",
    routineId: routine.id,
    startedAt: "2026-11-08T10:00:00.000Z",
    exercises: createWorkoutExercises(routine),
  };

  it("builds a session with the workout's id and timestamps", () => {
    const session = buildWorkoutSession(active, "2026-11-08T11:00:00.000Z");
    expect(session).toMatchObject({ id: "w1", routineId: routine.id, completedAt: "2026-11-08T11:00:00.000Z" });
  });

  it("rejects a finish time before the start", () => {
    expect(() => buildWorkoutSession(active, "2026-11-08T09:00:00.000Z")).toThrow();
  });

  it("rejects invalid dates", () => {
    expect(() => buildWorkoutSession({ ...active, startedAt: "not a date" })).toThrow();
  });
});

describe("navigation highlighting", () => {
  it("keeps the section active on its detail pages", () => {
    expect(isSectionActive("/history", "/history/abc")).toBe(true);
    expect(isSectionActive("/exercises", "/exercises/barbell-bench-press")).toBe(true);
    expect(isSectionActive("/workouts", "/workout/push")).toBe(true);
    expect(isSectionActive("/workouts", "/program/full-body")).toBe(true);
    expect(isSectionActive("/workouts", "/workouts/create")).toBe(true);
  });

  it("does not match unrelated sections", () => {
    expect(isSectionActive("/history", "/dashboard")).toBe(false);
    expect(isSectionActive("/dashboard", "/history")).toBe(false);
  });
});
