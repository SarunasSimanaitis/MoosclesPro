export type MuscleGroup =
  | "Chest"
  | "Back"
  | "Shoulders"
  | "Biceps"
  | "Triceps"
  | "Forearms"
  | "Quadriceps"
  | "Hamstrings"
  | "Glutes"
  | "Calves"
  | "Core"
  | "Cardio"
  | "Full Body";

export type Equipment =
  | "Barbell"
  | "Dumbbell"
  | "Cable"
  | "Machine"
  | "Bodyweight"
  | "Kettlebell"
  | "Resistance Band"
  | "EZ Bar"
  | "Smith Machine"
  | "Other";

export type ExerciseCategory =
  | "Strength"
  | "Hypertrophy"
  | "Cardio"
  | "Mobility";

export interface Exercise {
  id: string;

  name: string;

  muscleGroup: MuscleGroup;

  equipment: Equipment;

  category: ExerciseCategory;

  instructions: string[];

  primaryMuscles: string[];

  secondaryMuscles: string[];

  imageUrl?: string;

  videoUrl?: string;
}