import type { Routine } from "../types/Routine";
import { exercises } from "./exercises";

export const routines: Routine[] = [
  {
    id: "upper-body",
    name: "Upper Body",
    exercises: [
      {
        exercise: exercises[0],
        targetSets: 3,
        targetReps: "8-10",
        restSeconds: 120,
      },
      {
        exercise: exercises[1],
        targetSets: 3,
        targetReps: "10-12",
        restSeconds: 90,
      },
      {
        exercise: exercises[2],
        targetSets: 3,
        targetReps: "10-12",
        restSeconds: 90,
      },
      {
        exercise: exercises[3],
        targetSets: 2,
        targetReps: "12-15",
        restSeconds: 60,
      },
      {
        exercise: exercises[4],
        targetSets: 2,
        targetReps: "12-15",
        restSeconds: 60,
      },
    ],
  },
];