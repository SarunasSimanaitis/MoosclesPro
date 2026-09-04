import type { Exercise } from "../types/Exercise.js";
import type { Routine } from "../types/Routine.js";
import type { RoutineExercise } from "../types/RoutineExercise.js";
import type { WorkoutExercise } from "../types/WorkoutExercise.js";
import type { WorkoutSession } from "../types/WorkoutSession.js";
import type { WorkoutSet } from "../types/WorkoutSet.js";

type ValidationSuccess<T> = {
  success: true;
  data: T;
};

type ValidationFailure = {
  success: false;
  error: string;
};

export type ValidationResult<T> =
  | ValidationSuccess<T>
  | ValidationFailure;

const MUSCLE_GROUPS = [
  "Chest",
  "Back",
  "Shoulders",
  "Biceps",
  "Triceps",
  "Forearms",
  "Quadriceps",
  "Hamstrings",
  "Glutes",
  "Calves",
  "Core",
  "Cardio",
  "Full Body",
] as const;

const EQUIPMENT = [
  "Barbell",
  "Dumbbell",
  "Cable",
  "Machine",
  "Bodyweight",
  "Kettlebell",
  "Resistance Band",
  "EZ Bar",
  "Smith Machine",
  "Other",
] as const;

const EXERCISE_CATEGORIES = [
  "Strength",
  "Hypertrophy",
  "Cardio",
  "Mobility",
] as const;

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function isNonEmptyString(
  value: unknown,
): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0
  );
}

function isStringArray(
  value: unknown,
): value is string[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) => typeof item === "string",
    )
  );
}

function isFiniteNumber(
  value: unknown,
): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value)
  );
}

function isNonNegativeNumber(
  value: unknown,
): value is number {
  return (
    isFiniteNumber(value) &&
    value >= 0
  );
}

function isPositiveInteger(
  value: unknown,
): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value > 0
  );
}

function isOneOf<const T extends readonly string[]>(
  value: unknown,
  values: T,
): value is T[number] {
  return (
    typeof value === "string" &&
    values.includes(value as T[number])
  );
}

function isValidDateString(
  value: unknown,
): value is string {
  if (typeof value !== "string") {
    return false;
  }

  const timestamp = new Date(value).getTime();

  return Number.isFinite(timestamp);
}

function validateExercise(
  value: unknown,
): value is Exercise {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isNonEmptyString(value.id) &&
    isNonEmptyString(value.name) &&
    isOneOf(value.muscleGroup, MUSCLE_GROUPS) &&
    isOneOf(value.equipment, EQUIPMENT) &&
    isOneOf(value.category, EXERCISE_CATEGORIES) &&
    isStringArray(value.instructions) &&
    isStringArray(value.primaryMuscles) &&
    isStringArray(value.secondaryMuscles) &&
    (
      value.imageUrl === undefined ||
      typeof value.imageUrl === "string"
    ) &&
    (
      value.videoUrl === undefined ||
      typeof value.videoUrl === "string"
    )
  );
}

function validateRoutineExercise(
  value: unknown,
): value is RoutineExercise {
  if (!isRecord(value)) {
    return false;
  }

  return (
    validateExercise(value.exercise) &&
    isPositiveInteger(value.targetSets) &&
    isNonEmptyString(value.targetReps) &&
    isNonNegativeNumber(value.restSeconds) &&
    Number.isInteger(value.restSeconds)
  );
}

function validateWorkoutSet(
  value: unknown,
): value is WorkoutSet {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isNonEmptyString(value.id) &&
    isNonNegativeNumber(value.weight) &&
    Number.isInteger(value.weight * 2) &&
    isNonNegativeNumber(value.reps) &&
    Number.isInteger(value.reps) &&
    typeof value.completed === "boolean" &&
    isPositiveInteger(value.order)
  );
}

function validateWorkoutExercise(
  value: unknown,
): value is WorkoutExercise {
  if (!isRecord(value)) {
    return false;
  }

  return (
    validateExercise(value.exercise) &&
    isPositiveInteger(value.targetSets) &&
    isNonEmptyString(value.targetReps) &&
    isNonNegativeNumber(value.restSeconds) &&
    Number.isInteger(value.restSeconds) &&
    Array.isArray(value.sets) &&
    value.sets.length > 0 &&
    value.sets.every(validateWorkoutSet)
  );
}

function validateRoutine(
  value: unknown,
): value is Routine {
  if (!isRecord(value)) {
    return false;
  }

  if (
    !isNonEmptyString(value.id) ||
    !isNonEmptyString(value.name) ||
    !Array.isArray(value.exercises) ||
    value.exercises.length === 0
  ) {
    return false;
  }

  return value.exercises.every(
    validateRoutineExercise,
  );
}

function validateWorkoutSession(
  value: unknown,
): value is WorkoutSession {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isNonEmptyString(value.id) &&
    isNonEmptyString(value.routineId) &&
    isValidDateString(value.startedAt) &&
    isValidDateString(value.completedAt) &&
    Array.isArray(value.exercises) &&
    value.exercises.length > 0 &&
    value.exercises.every(
      validateWorkoutExercise,
    )
  );
}

export type RoutineRequestBody = {
  id?: string;
  name?: string;
  exercises?: unknown[];
};

export function parseRoutineRequestBody(
  value: unknown,
): ValidationResult<RoutineRequestBody> {
  if (!isRecord(value)) {
    return {
      success: false,
      error: "Request body must be an object.",
    };
  }

  const id = value.id;
  const name = value.name;
  const exercises = value.exercises;

  if (
    id !== undefined &&
    !isNonEmptyString(id)
  ) {
    return {
      success: false,
      error: "Routine id must be a non-empty string.",
    };
  }

  if (
    name !== undefined &&
    typeof name !== "string"
  ) {
    return {
      success: false,
      error: "Routine name must be a string.",
    };
  }

  if (
    exercises !== undefined &&
    !Array.isArray(exercises)
  ) {
    return {
      success: false,
      error: "Routine exercises must be an array.",
    };
  }

  return {
    success: true,
    data: {
      ...(id !== undefined ? { id } : {}),
      ...(name !== undefined ? { name } : {}),
      ...(exercises !== undefined
        ? { exercises }
        : {}),
    },
  };
}

export function validateRoutinePayload(
  value: unknown,
): ValidationResult<Routine> {
  if (!validateRoutine(value)) {
    return {
      success: false,
      error:
        "Invalid routine. Check the name and exercise configuration.",
    };
  }

  return {
    success: true,
    data: value,
  };
}

export type WorkoutSessionRequestBody = {
  id?: string;
  routineId?: string;
  startedAt?: string;
  completedAt?: string;
  exercises?: unknown[];
};

export function parseWorkoutSessionRequestBody(
  value: unknown,
): ValidationResult<WorkoutSessionRequestBody> {
  if (!isRecord(value)) {
    return {
      success: false,
      error: "Request body must be an object.",
    };
  }

  const id = value.id;
  const routineId = value.routineId;
  const startedAt = value.startedAt;
  const completedAt = value.completedAt;
  const exercises = value.exercises;

  if (
    id !== undefined &&
    !isNonEmptyString(id)
  ) {
    return {
      success: false,
      error:
        "Workout session id must be a non-empty string.",
    };
  }

  if (
    routineId !== undefined &&
    !isNonEmptyString(routineId)
  ) {
    return {
      success: false,
      error:
        "Routine id must be a non-empty string.",
    };
  }

  if (
    startedAt !== undefined &&
    !isValidDateString(startedAt)
  ) {
    return {
      success: false,
      error: "Workout start time is invalid.",
    };
  }

  if (
    completedAt !== undefined &&
    !isValidDateString(completedAt)
  ) {
    return {
      success: false,
      error:
        "Workout completion time is invalid.",
    };
  }

  if (
    exercises !== undefined &&
    !Array.isArray(exercises)
  ) {
    return {
      success: false,
      error:
        "Workout exercises must be an array.",
    };
  }

  return {
    success: true,
    data: {
      ...(id !== undefined ? { id } : {}),
      ...(routineId !== undefined
        ? { routineId }
        : {}),
      ...(startedAt !== undefined
        ? { startedAt }
        : {}),
      ...(completedAt !== undefined
        ? { completedAt }
        : {}),
      ...(exercises !== undefined
        ? { exercises }
        : {}),
    },
  };
}

export function validateWorkoutSessionPayload(
  value: unknown,
): ValidationResult<WorkoutSession> {
  if (!validateWorkoutSession(value)) {
    return {
      success: false,
      error: "Invalid workout session.",
    };
  }

  return {
    success: true,
    data: value,
  };
}