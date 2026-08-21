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
  {
    id: "upper-body",
    name: "Upper Body",
    exercises: [
      {
        exercise: getExercise("bench-press"),
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
        exercise: getExercise("shoulder-press"),
        targetSets: 3,
        targetReps: "10-12",
        restSeconds: 90,
      },
      {
        exercise: getExercise("bicep-curl"),
        targetSets: 2,
        targetReps: "12-15",
        restSeconds: 60,
      },
      {
        exercise: getExercise("tricep-pushdown"),
        targetSets: 2,
        targetReps: "12-15",
        restSeconds: 60,
      },
    ],
  },

  {
    id: "lower-body",
    name: "Lower Body",
    exercises: [
      {
        exercise: getExercise("barbell-squat"),
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
        exercise: getExercise("bodyweight-squat"),
        targetSets: 3,
        targetReps: "12-15",
        restSeconds: 90,
      },
      {
        exercise: getExercise("glute-bridge"),
        targetSets: 3,
        targetReps: "10-15",
        restSeconds: 90,
      },
    ],
  },

  {
    id: "push",
    name: "Push",
    exercises: [
      {
        exercise: getExercise("bench-press"),
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
        exercise: getExercise("shoulder-press"),
        targetSets: 3,
        targetReps: "8-12",
        restSeconds: 120,
      },
      {
        exercise: getExercise("lateral-raise"),
        targetSets: 3,
        targetReps: "12-15",
        restSeconds: 60,
      },
      {
        exercise: getExercise("tricep-pushdown"),
        targetSets: 3,
        targetReps: "10-15",
        restSeconds: 60,
      },
    ],
  },

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
        exercise: getExercise("bicep-curl"),
        targetSets: 3,
        targetReps: "10-15",
        restSeconds: 60,
      },
      {
        exercise: getExercise("lateral-raise"),
        targetSets: 3,
        targetReps: "12-15",
        restSeconds: 60,
      },
    ],
  },

  {
    id: "full-body",
    name: "Full Body",
    exercises: [
      {
        exercise: getExercise("barbell-squat"),
        targetSets: 3,
        targetReps: "6-10",
        restSeconds: 150,
      },
      {
        exercise: getExercise("bench-press"),
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
        exercise: getExercise("shoulder-press"),
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