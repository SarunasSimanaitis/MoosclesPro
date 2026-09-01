import type { Routine } from "../types/Routine";
import type { RoutineExercise } from "../types/RoutineExercise";
import { exercises } from "./exercises";

type RoutineExerciseDefinition = {
  exerciseId: string;
  targetSets: number;
  targetReps: string;
  restSeconds: number;
};

function createRoutineExercise(
  definition: RoutineExerciseDefinition,
): RoutineExercise {
  const exercise = exercises.find(
    (item) => item.id === definition.exerciseId,
  );

  if (!exercise) {
    throw new Error(
      `Exercise "${definition.exerciseId}" does not exist in the exercise library.`,
    );
  }

  return {
    exercise,
    targetSets: definition.targetSets,
    targetReps: definition.targetReps,
    restSeconds: definition.restSeconds,
  };
}

function createRoutine(
  id: string,
  name: string,
  definitions: RoutineExerciseDefinition[],
): Routine {
  return {
    id,
    name,
    exercises: definitions.map(createRoutineExercise),
  };
}

/*
 * Free workout routines.
 *
 * These are intentionally kept separate from programs.
 * A program decides which routines are performed across
 * the week, while a routine represents one workout session.
 */

export const routines: Routine[] = [
  // ─────────────────────────────────────────────
  // FULL BODY FOUNDATION
  // ─────────────────────────────────────────────

  createRoutine(
    "foundation-full-body-a",
    "Foundation Full Body A",
    [
      {
        exerciseId: "barbell-bench-press",
        targetSets: 3,
        targetReps: "6-10",
        restSeconds: 150,
      },
      {
        exerciseId: "lat-pulldown",
        targetSets: 3,
        targetReps: "8-12",
        restSeconds: 120,
      },
      {
        exerciseId: "goblet-squat",
        targetSets: 3,
        targetReps: "8-12",
        restSeconds: 120,
      },
      {
        exerciseId: "dumbbell-romanian-deadlift",
        targetSets: 2,
        targetReps: "8-12",
        restSeconds: 120,
      },
      {
        exerciseId: "dumbbell-lateral-raise",
        targetSets: 2,
        targetReps: "10-15",
        restSeconds: 75,
      },
      {
        exerciseId: "dead-bug",
        targetSets: 2,
        targetReps: "8-12 / side",
        restSeconds: 60,
      },
    ],
  ),

  createRoutine(
    "foundation-full-body-b",
    "Foundation Full Body B",
    [
      {
        exerciseId: "dumbbell-bench-press",
        targetSets: 3,
        targetReps: "8-12",
        restSeconds: 120,
      },
      {
        exerciseId: "seated-cable-row",
        targetSets: 3,
        targetReps: "8-12",
        restSeconds: 120,
      },
      {
        exerciseId: "leg-press",
        targetSets: 3,
        targetReps: "8-12",
        restSeconds: 150,
      },
      {
        exerciseId: "seated-leg-curl",
        targetSets: 2,
        targetReps: "10-15",
        restSeconds: 90,
      },
      {
        exerciseId: "dumbbell-shoulder-press",
        targetSets: 2,
        targetReps: "8-12",
        restSeconds: 120,
      },
      {
        exerciseId: "side-plank",
        targetSets: 2,
        targetReps: "20-40 sec / side",
        restSeconds: 60,
      },
    ],
  ),

  createRoutine(
    "foundation-full-body-c",
    "Foundation Full Body C",
    [
      {
        exerciseId: "incline-dumbbell-press",
        targetSets: 3,
        targetReps: "8-12",
        restSeconds: 120,
      },
      {
        exerciseId: "chest-supported-row",
        targetSets: 3,
        targetReps: "8-12",
        restSeconds: 120,
      },
      {
        exerciseId: "bulgarian-split-squat",
        targetSets: 3,
        targetReps: "8-12 / leg",
        restSeconds: 120,
      },
      {
        exerciseId: "dumbbell-hip-thrust",
        targetSets: 2,
        targetReps: "8-12",
        restSeconds: 120,
      },
      {
        exerciseId: "cable-lateral-raise",
        targetSets: 2,
        targetReps: "10-15",
        restSeconds: 75,
      },
      {
        exerciseId: "reverse-crunch",
        targetSets: 2,
        targetReps: "10-15",
        restSeconds: 60,
      },
    ],
  ),

  // ─────────────────────────────────────────────
  // EFFICIENT HYPERTROPHY
  // ─────────────────────────────────────────────

  createRoutine(
    "efficient-hypertrophy-a",
    "Efficient Hypertrophy A",
    [
      {
        exerciseId: "barbell-bench-press",
        targetSets: 3,
        targetReps: "6-10",
        restSeconds: 150,
      },
      {
        exerciseId: "lat-pulldown",
        targetSets: 3,
        targetReps: "8-12",
        restSeconds: 120,
      },
      {
        exerciseId: "leg-press",
        targetSets: 3,
        targetReps: "8-12",
        restSeconds: 150,
      },
      {
        exerciseId: "dumbbell-romanian-deadlift",
        targetSets: 2,
        targetReps: "8-12",
        restSeconds: 120,
      },
      {
        exerciseId: "dumbbell-lateral-raise",
        targetSets: 2,
        targetReps: "10-15",
        restSeconds: 75,
      },
      {
        exerciseId: "cable-tricep-pushdown",
        targetSets: 2,
        targetReps: "10-15",
        restSeconds: 75,
      },
      {
        exerciseId: "cable-bicep-curl",
        targetSets: 2,
        targetReps: "10-15",
        restSeconds: 75,
      },
    ],
  ),

  createRoutine(
    "efficient-hypertrophy-b",
    "Efficient Hypertrophy B",
    [
      {
        exerciseId: "incline-dumbbell-press",
        targetSets: 3,
        targetReps: "8-12",
        restSeconds: 120,
      },
      {
        exerciseId: "chest-supported-row",
        targetSets: 3,
        targetReps: "8-12",
        restSeconds: 120,
      },
      {
        exerciseId: "bulgarian-split-squat",
        targetSets: 3,
        targetReps: "8-12 / leg",
        restSeconds: 120,
      },
      {
        exerciseId: "seated-leg-curl",
        targetSets: 3,
        targetReps: "10-15",
        restSeconds: 90,
      },
      {
        exerciseId: "dumbbell-shoulder-press",
        targetSets: 2,
        targetReps: "8-12",
        restSeconds: 120,
      },
      {
        exerciseId: "cable-overhead-tricep-extension",
        targetSets: 2,
        targetReps: "10-15",
        restSeconds: 75,
      },
      {
        exerciseId: "incline-dumbbell-curl",
        targetSets: 2,
        targetReps: "10-15",
        restSeconds: 75,
      },
    ],
  ),

  createRoutine(
    "efficient-hypertrophy-c",
    "Efficient Hypertrophy C",
    [
      {
        exerciseId: "dumbbell-bench-press",
        targetSets: 3,
        targetReps: "8-12",
        restSeconds: 120,
      },
      {
        exerciseId: "straight-arm-pulldown",
        targetSets: 2,
        targetReps: "10-15",
        restSeconds: 90,
      },
      {
        exerciseId: "seated-cable-row",
        targetSets: 3,
        targetReps: "8-12",
        restSeconds: 120,
      },
      {
        exerciseId: "goblet-squat",
        targetSets: 3,
        targetReps: "10-15",
        restSeconds: 120,
      },
      {
        exerciseId: "dumbbell-hip-thrust",
        targetSets: 2,
        targetReps: "8-12",
        restSeconds: 120,
      },
      {
        exerciseId: "face-pull",
        targetSets: 2,
        targetReps: "12-15",
        restSeconds: 75,
      },
      {
        exerciseId: "reverse-crunch",
        targetSets: 2,
        targetReps: "10-15",
        restSeconds: 60,
      },
    ],
  ),

  // ─────────────────────────────────────────────
  // DUMBBELL ONLY
  // ─────────────────────────────────────────────

  createRoutine(
    "dumbbell-only-a",
    "Dumbbell Only A",
    [
      {
        exerciseId: "dumbbell-bench-press",
        targetSets: 3,
        targetReps: "8-12",
        restSeconds: 120,
      },
      {
        exerciseId: "one-arm-dumbbell-row",
        targetSets: 3,
        targetReps: "8-12 / side",
        restSeconds: 120,
      },
      {
        exerciseId: "goblet-squat",
        targetSets: 3,
        targetReps: "8-12",
        restSeconds: 120,
      },
      {
        exerciseId: "dumbbell-romanian-deadlift",
        targetSets: 3,
        targetReps: "8-12",
        restSeconds: 120,
      },
      {
        exerciseId: "dumbbell-lateral-raise",
        targetSets: 2,
        targetReps: "10-15",
        restSeconds: 75,
      },
      {
        exerciseId: "dead-bug",
        targetSets: 2,
        targetReps: "8-12 / side",
        restSeconds: 60,
      },
    ],
  ),

  createRoutine(
    "dumbbell-only-b",
    "Dumbbell Only B",
    [
      {
        exerciseId: "incline-dumbbell-press",
        targetSets: 3,
        targetReps: "8-12",
        restSeconds: 120,
      },
      {
        exerciseId: "one-arm-dumbbell-row",
        targetSets: 3,
        targetReps: "8-12 / side",
        restSeconds: 120,
      },
      {
        exerciseId: "bulgarian-split-squat",
        targetSets: 3,
        targetReps: "8-12 / leg",
        restSeconds: 120,
      },
      {
        exerciseId: "dumbbell-hip-thrust",
        targetSets: 3,
        targetReps: "8-12",
        restSeconds: 120,
      },
      {
        exerciseId: "incline-dumbbell-curl",
        targetSets: 2,
        targetReps: "10-15",
        restSeconds: 75,
      },
      {
        exerciseId: "dumbbell-tricep-extension",
        targetSets: 2,
        targetReps: "10-15",
        restSeconds: 75,
      },
    ],
  ),

  createRoutine(
    "dumbbell-only-c",
    "Dumbbell Only C",
    [
      {
        exerciseId: "dumbbell-fly",
        targetSets: 2,
        targetReps: "10-15",
        restSeconds: 90,
      },
      {
        exerciseId: "one-arm-dumbbell-row",
        targetSets: 3,
        targetReps: "8-12 / side",
        restSeconds: 120,
      },
      {
        exerciseId: "dumbbell-lunge",
        targetSets: 3,
        targetReps: "8-12 / leg",
        restSeconds: 120,
      },
      {
        exerciseId: "dumbbell-romanian-deadlift",
        targetSets: 3,
        targetReps: "8-12",
        restSeconds: 120,
      },
      {
        exerciseId: "dumbbell-lateral-raise",
        targetSets: 2,
        targetReps: "10-15",
        restSeconds: 75,
      },
      {
        exerciseId: "reverse-crunch",
        targetSets: 2,
        targetReps: "10-15",
        restSeconds: 60,
      },
    ],
  ),

  // ─────────────────────────────────────────────
  // BODYWEIGHT
  // ─────────────────────────────────────────────

  createRoutine(
    "bodyweight-foundation-a",
    "Bodyweight Foundation A",
    [
      {
        exerciseId: "push-up",
        targetSets: 3,
        targetReps: "6-15",
        restSeconds: 90,
      },
      {
        exerciseId: "assisted-pull-up",
        targetSets: 3,
        targetReps: "6-12",
        restSeconds: 120,
      },
      {
        exerciseId: "bodyweight-squat",
        targetSets: 3,
        targetReps: "10-20",
        restSeconds: 90,
      },
      {
        exerciseId: "glute-bridge",
        targetSets: 3,
        targetReps: "12-20",
        restSeconds: 75,
      },
      {
        exerciseId: "side-plank",
        targetSets: 2,
        targetReps: "20-40 sec / side",
        restSeconds: 60,
      },
    ],
  ),

  createRoutine(
    "bodyweight-foundation-b",
    "Bodyweight Foundation B",
    [
      {
        exerciseId: "close-grip-push-up",
        targetSets: 3,
        targetReps: "6-15",
        restSeconds: 90,
      },
      {
        exerciseId: "chin-up",
        targetSets: 3,
        targetReps: "assisted / controlled max",
        restSeconds: 120,
      },
      {
        exerciseId: "reverse-lunge",
        targetSets: 3,
        targetReps: "8-15 / leg",
        restSeconds: 90,
      },
      {
        exerciseId: "glute-bridge",
        targetSets: 3,
        targetReps: "12-20",
        restSeconds: 75,
      },
      {
        exerciseId: "dead-bug",
        targetSets: 3,
        targetReps: "8-12 / side",
        restSeconds: 60,
      },
    ],
  ),

  createRoutine(
    "bodyweight-foundation-c",
    "Bodyweight Foundation C",
    [
      {
        exerciseId: "push-up",
        targetSets: 3,
        targetReps: "6-15",
        restSeconds: 90,
      },
      {
        exerciseId: "assisted-pull-up",
        targetSets: 3,
        targetReps: "6-12",
        restSeconds: 120,
      },
      {
        exerciseId: "split-squat",
        targetSets: 3,
        targetReps: "8-15 / leg",
        restSeconds: 90,
      },
      {
        exerciseId: "single-leg-glute-bridge",
        targetSets: 2,
        targetReps: "10-15 / leg",
        restSeconds: 75,
      },
      {
        exerciseId: "plank",
        targetSets: 2,
        targetReps: "30-60 sec",
        restSeconds: 60,
      },
    ],
  ),
];

export default routines;