import type { Program } from "../types/Program";

export const programs: Program[] = [
  {
    id: "full-body-foundation",
    name: "Full Body Foundation",
    description:
      "A simple, balanced three-day program built around fundamental movement patterns. A strong starting point for building consistency, strength, and general fitness.",
    goal: "General Fitness",
    environment: "Gym",
    difficulty: "Beginner",
    daysPerWeek: 3,
    sessionMinutes: 50,
    days: [
      {
        day: 1,
        name: "Full Body A",
        routineId: "foundation-full-body-a",
      },
      {
        day: 2,
        name: "Full Body B",
        routineId: "foundation-full-body-b",
      },
      {
        day: 3,
        name: "Full Body C",
        routineId: "foundation-full-body-c",
      },
    ],
    tags: [
      "Beginner",
      "Full Body",
      "Gym",
      "3 Days",
    ],
  },

  {
    id: "efficient-hypertrophy",
    name: "Efficient Hypertrophy",
    description:
      "A time-efficient three-day program focused on accumulating enough quality training volume to stimulate muscle growth without unnecessarily long sessions.",
    goal: "Hypertrophy",
    environment: "Gym",
    difficulty: "Intermediate",
    daysPerWeek: 3,
    sessionMinutes: 55,
    days: [
      {
        day: 1,
        name: "Hypertrophy A",
        routineId: "efficient-hypertrophy-a",
      },
      {
        day: 2,
        name: "Hypertrophy B",
        routineId: "efficient-hypertrophy-b",
      },
      {
        day: 3,
        name: "Hypertrophy C",
        routineId: "efficient-hypertrophy-c",
      },
    ],
    tags: [
      "Hypertrophy",
      "Muscle Growth",
      "Efficient",
      "3 Days",
    ],
  },

  {
    id: "dumbbell-only",
    name: "Dumbbell Only",
    description:
      "A complete three-day training program using dumbbells as the primary resistance tool. Ideal when you have limited equipment but still want structured resistance training.",
    goal: "Hypertrophy",
    environment: "Minimal Equipment",
    difficulty: "Beginner",
    daysPerWeek: 3,
    sessionMinutes: 45,
    days: [
      {
        day: 1,
        name: "Dumbbell A",
        routineId: "dumbbell-only-a",
      },
      {
        day: 2,
        name: "Dumbbell B",
        routineId: "dumbbell-only-b",
      },
      {
        day: 3,
        name: "Dumbbell C",
        routineId: "dumbbell-only-c",
      },
    ],
    tags: [
      "Dumbbells",
      "Home",
      "Hypertrophy",
      "3 Days",
    ],
  },

  {
    id: "bodyweight-foundation",
    name: "Bodyweight Foundation",
    description:
      "A minimalist three-day program built around bodyweight movements. Designed for people who want to train with little or no equipment.",
    goal: "General Fitness",
    environment: "Bodyweight",
    difficulty: "Beginner",
    daysPerWeek: 3,
    sessionMinutes: 35,
    days: [
      {
        day: 1,
        name: "Bodyweight A",
        routineId: "bodyweight-foundation-a",
      },
      {
        day: 2,
        name: "Bodyweight B",
        routineId: "bodyweight-foundation-b",
      },
      {
        day: 3,
        name: "Bodyweight C",
        routineId: "bodyweight-foundation-c",
      },
    ],
    tags: [
      "Bodyweight",
      "Home",
      "Beginner",
      "3 Days",
    ],
  },
];

export default programs;