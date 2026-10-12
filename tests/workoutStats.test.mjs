import assert from "node:assert/strict";
import { describe, it } from "node:test";

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

    assert.equal(result.workouts, 1);
    assert.equal(result.volume, 500);
    assert.equal(result.trainingHours, 1.5);
    assert.equal(result.streak, 1);
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

    assert.equal(hasCompletedWork(empty), false);
    assert.deepEqual(calculateOverview([empty, invalidTime]), {
      workouts: 0,
      volume: 0,
      trainingHours: 0,
      streak: 0,
    });
    assert.deepEqual(calculateExerciseStatistics([empty]), []);
    assert.equal(calculateWeeklyActivity([empty]).at(-1).workouts, 0);
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

    assert.deepEqual(calculateExerciseStatistics([workout]), [
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
