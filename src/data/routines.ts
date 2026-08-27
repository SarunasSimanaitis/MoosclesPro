import type { Routine } from "../types/Routine";
import { exercises } from "./exercises";

function getExercise(id: string) {
  const exercise = exercises.find((exercise) => exercise.id === id);

  if (!exercise) {
    throw new Error(`Exercise "${id}" was not found.`);
  }

  return exercise;
}

export const routines: Routine[] = [
  // ─────────────────────────────
  // UPPER BODY
  // ─────────────────────────────

  {
    id: "upper-body",
    name: "Upper Body",
    exercises: [
      {
        exercise: getExercise("barbell-bench-press"),
        targetSets: 3,
        targetReps: "8-10",
        restSeconds: 120,
      },
      {
        exercise: getExercise("lat-pulldown"),
        targetSets: 3,
        targetReps: "10-12",
        restSeconds: 90,
      },
      {
        exercise: getExercise("dumbbell-shoulder-press"),
        targetSets: 3,
        targetReps: "10-12",
        restSeconds: 90,
      },
      {
        exercise: getExercise("dumbbell-bicep-curl"),
        targetSets: 2,
        targetReps: "12-15",
        restSeconds: 60,
      },
      {
        exercise: getExercise("cable-tricep-pushdown"),
        targetSets: 2,
        targetReps: "12-15",
        restSeconds: 60,
      },
    ],
  },

  // ─────────────────────────────
  // LOWER BODY
  // ─────────────────────────────

  {
    id: "lower-body",
    name: "Lower Body",
    exercises: [
      {
        exercise: getExercise("barbell-back-squat"),
        targetSets: 4,
        targetReps: "6-8",
        restSeconds: 150,
      },
      {
        exercise: getExercise("romanian-deadlift"),
        targetSets: 3,
        targetReps: "8-10",
        restSeconds: 120,
      },
      {
        exercise: getExercise("leg-press"),
        targetSets: 3,
        targetReps: "10-12",
        restSeconds: 120,
      },
      {
        exercise: getExercise("lying-leg-curl"),
        targetSets: 3,
        targetReps: "10-15",
        restSeconds: 90,
      },
      {
        exercise: getExercise("barbell-hip-thrust"),
        targetSets: 3,
        targetReps: "10-15",
        restSeconds: 90,
      },
      {
        exercise: getExercise("standing-calf-raise"),
        targetSets: 3,
        targetReps: "12-15",
        restSeconds: 60,
      },
    ],
  },

  // ─────────────────────────────
  // PUSH
  // ─────────────────────────────

  {
    id: "push",
    name: "Push",
    exercises: [
      {
        exercise: getExercise("barbell-bench-press"),
        targetSets: 4,
        targetReps: "6-8",
        restSeconds: 150,
      },
      {
        exercise: getExercise("incline-dumbbell-press"),
        targetSets: 3,
        targetReps: "8-12",
        restSeconds: 120,
      },
      {
        exercise: getExercise("dumbbell-shoulder-press"),
        targetSets: 3,
        targetReps: "8-12",
        restSeconds: 120,
      },
      {
        exercise: getExercise("dumbbell-lateral-raise"),
        targetSets: 3,
        targetReps: "12-15",
        restSeconds: 60,
      },
      {
        exercise: getExercise("cable-tricep-pushdown"),
        targetSets: 3,
        targetReps: "10-15",
        restSeconds: 60,
      },
    ],
  },

  // ─────────────────────────────
  // PULL
  // ─────────────────────────────

  {
    id: "pull",
    name: "Pull",
    exercises: [
      {
        exercise: getExercise("lat-pulldown"),
        targetSets: 4,
        targetReps: "8-12",
        restSeconds: 120,
      },
      {
        exercise: getExercise("seated-cable-row"),
        targetSets: 3,
        targetReps: "8-12",
        restSeconds: 120,
      },
      {
        exercise: getExercise("one-arm-dumbbell-row"),
        targetSets: 3,
        targetReps: "8-12",
        restSeconds: 90,
      },
      {
        exercise: getExercise("hammer-curl"),
        targetSets: 3,
        targetReps: "10-15",
        restSeconds: 60,
      },
      {
        exercise: getExercise("barbell-curl"),
        targetSets: 2,
        targetReps: "10-15",
        restSeconds: 60,
      },
    ],
  },

  // ─────────────────────────────
  // FULL BODY
  // ─────────────────────────────

  {
    id: "full-body",
    name: "Full Body",
    exercises: [
      {
        exercise: getExercise("barbell-back-squat"),
        targetSets: 3,
        targetReps: "6-10",
        restSeconds: 150,
      },
      {
        exercise: getExercise("barbell-bench-press"),
        targetSets: 3,
        targetReps: "8-10",
        restSeconds: 120,
      },
      {
        exercise: getExercise("lat-pulldown"),
        targetSets: 3,
        targetReps: "8-12",
        restSeconds: 120,
      },
      {
        exercise: getExercise("dumbbell-shoulder-press"),
        targetSets: 2,
        targetReps: "10-12",
        restSeconds: 90,
      },
      {
        exercise: getExercise("romanian-deadlift"),
        targetSets: 3,
        targetReps: "8-10",
        restSeconds: 120,
      },
      {
        exercise: getExercise("plank"),
        targetSets: 3,
        targetReps: "30-60 sec",
        restSeconds: 60,
      },
    ],
  },
];