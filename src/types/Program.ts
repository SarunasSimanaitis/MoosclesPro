import type { TrainingGoal } from "./TrainingGoal";

export type TrainingEnvironment =
  | "Gym"
  | "Home"
  | "Minimal Equipment"
  | "Bodyweight";

export type ProgramDifficulty =
  | "Beginner"
  | "Intermediate"
  | "Advanced";

export type ProgramDay = {
  day: number;
  name: string;
  routineId: string;
};

export type Program = {
  id: string;

  name: string;
  description: string;

  goal: TrainingGoal;
  environment: TrainingEnvironment;
  difficulty: ProgramDifficulty;

  daysPerWeek: number;
  sessionMinutes: number;

  days: ProgramDay[];

  tags: string[];
};