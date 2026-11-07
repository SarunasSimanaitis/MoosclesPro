import { describe, it, expect } from "vitest";

import {
  calculateExerciseStatistics,
  calculateOverview,
  calculateWeeklyActivity,
  hasCompletedWork,
} from "../src/lib/workoutStats.ts";

function session({
  id = "session-1",
  startedAt = new Date(Date.now() - 90 * 60 * 1000).toISOString(),
  completedAt = new Date().toISOString(),
  exercises = [
    {
      exercise: { id: "squat", name: "Barbell squat" },
      sets: [
        { weight: 100, reps: 5, completed: true },
        { weight: 100, reps: 5, completed: false },
      ],
    },
  ],
} = {}) {
  return {
    id,
    userId: "user-1",
    routineId: "routine-1",
    startedAt,
    completedAt,
    exercises,
  };
}

describe("completed workout statistics", () => {
  it("counts completed sessions and only completed-set volume", () => {
    const result = calculateOverview([
      session(),
      session({
        id: "empty",
        exercises: [
          {
            exercise: { id: "bench", name: "Bench press" },
            sets: [{ weight: 80, reps: 8, completed: false }],
          },
        ],
      }),
    ]);

    expect(result.workouts).toBe(1);
    expect(result.volume).toBe(500);
    expect(result.trainingHours).toBe(1.5);
    expect(result.streak).toBe(1);
  });

  it("does not count sessions without completed work or valid timing", () => {
    const empty = session({
      id: "empty",
      exercises: [
        {
          exercise: { id: "bench", name: "Bench press" },
          sets: [{ weight: 80, reps: 8, completed: false }],
        },
      ],
    });
    const invalidTime = session({
      id: "invalid-time",
      startedAt: "not-a-date",
    });

    expect(hasCompletedWork(empty)).toBe(false);
    expect(calculateOverview([empty, invalidTime])).toEqual({
      workouts: 0,
      volume: 0,
      trainingHours: 0,
      streak: 0,
    });
    expect(calculateExerciseStatistics([empty])).toEqual([]);
    expect(calculateWeeklyActivity([empty]).at(-1).workouts).toBe(0);
  });

  it("counts an exercise once per workout and excludes incomplete exercises", () => {
    const workout = session({
      exercises: [
        {
          exercise: { id: "squat", name: "Barbell squat" },
          sets: [
            { weight: 100, reps: 5, completed: true },
            { weight: 105, reps: 5, completed: true },
          ],
        },
        {
          exercise: { id: "bench", name: "Bench press" },
          sets: [{ weight: 80, reps: 8, completed: false }],
        },
      ],
    });

    expect(calculateExerciseStatistics([workout])).toEqual([
      {
        exerciseId: "squat",
        name: "Barbell squat",
        workouts: 1,
        sets: 2,
        volume: 1025,
      },
    ]);
  });
});
