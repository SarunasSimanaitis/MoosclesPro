import type { Routine } from "../types/Routine";
import { exercises } from "./exercises";

export const routines: Routine[] = [
  {
    id: "upper-body",
    name: "Upper Body",
    exercises: [
      exercises[0],
      exercises[1],
      exercises[2],
      exercises[3],
      exercises[4],
    ],
  },
];