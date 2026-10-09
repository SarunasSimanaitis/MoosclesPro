import type { WorkoutExercise } from "../types/WorkoutExercise";
import type { WorkoutSession } from "../types/WorkoutSession";
import type { WorkoutSet } from "../types/WorkoutSet";

export type PersonalRecordMark = {
  value: number;
  weight: number;
  reps: number;
  completedAt: string;
};

export type ExercisePersonalRecord = {
  exerciseId: string;
  exerciseName: string;
  bestWeight: PersonalRecordMark | null;
  estimatedOneRepMax: PersonalRecordMark | null;
  bestBodyweightReps: PersonalRecordMark | null;
};

export type PersonalRecordKind = "load" | "estimated-one-rep-max" | "reps";

export type WorkoutPersonalRecord = {
  exerciseId: string;
  exerciseName: string;
  setId: string;
  kind: PersonalRecordKind;
  value: number;
  previousValue: number | null;
  weight: number;
  reps: number;
};

function estimatedOneRepMax(weight: number, reps: number) {
  return weight * (1 + reps / 30);
}

function hasBetterMark(
  next: PersonalRecordMark,
  previous: PersonalRecordMark | null,
) {
  return !previous || next.value > previous.value + 0.001;
}

export function collectPersonalRecords(
  sessions: WorkoutSession[],
): ExercisePersonalRecord[] {
  const records = new Map<string, ExercisePersonalRecord>();

  for (const session of sessions) {
    for (const exercise of session.exercises) {
      let record = records.get(exercise.exercise.id);
      if (!record) {
        record = {
          exerciseId: exercise.exercise.id,
          exerciseName: exercise.exercise.name,
          bestWeight: null,
          estimatedOneRepMax: null,
          bestBodyweightReps: null,
        };
        records.set(exercise.exercise.id, record);
      }

      for (const set of exercise.sets) {
        if (!set.completed || set.reps <= 0) continue;

        if (set.weight > 0) {
          const loadMark = toMark(set, set.weight, session.completedAt);
          if (hasBetterMark(loadMark, record.bestWeight)) {
            record.bestWeight = loadMark;
          }

          const strengthMark = toMark(
            set,
            estimatedOneRepMax(set.weight, set.reps),
            session.completedAt,
          );
          if (hasBetterMark(strengthMark, record.estimatedOneRepMax)) {
            record.estimatedOneRepMax = strengthMark;
          }
        } else {
          const repsMark = toMark(set, set.reps, session.completedAt);
          if (hasBetterMark(repsMark, record.bestBodyweightReps)) {
            record.bestBodyweightReps = repsMark;
          }
        }
      }
    }
  }

  return [...records.values()]
    .filter((record) => record.bestWeight || record.estimatedOneRepMax || record.bestBodyweightReps)
    .sort((left, right) => getLatestRecordTime(right) - getLatestRecordTime(left));
}

function getLatestRecordTime(record: ExercisePersonalRecord) {
  return [record.bestWeight, record.estimatedOneRepMax, record.bestBodyweightReps]
    .map((mark) => mark ? Date.parse(mark.completedAt) : 0)
    .filter(Number.isFinite)
    .reduce((latest, timestamp) => Math.max(latest, timestamp), 0);
}

export function findWorkoutPersonalRecords(
  exercises: WorkoutExercise[],
  previousRecords: ExercisePersonalRecord[],
): WorkoutPersonalRecord[] {
  const recordByExercise = new Map(
    previousRecords.map((record) => [record.exerciseId, record]),
  );
  const newRecords: WorkoutPersonalRecord[] = [];

  for (const exercise of exercises) {
    const history = recordByExercise.get(exercise.exercise.id);
    const completedSets = exercise.sets.filter((set) => set.completed && set.reps > 0);
    const weightedSets = completedSets.filter((set) => set.weight > 0);

    const bestLoadSet = getBestSet(weightedSets, (set) => set.weight);
    if (bestLoadSet && bestLoadSet.weight > (history?.bestWeight?.value ?? 0) + 0.001) {
      newRecords.push({
        ...toWorkoutRecord(exercise, bestLoadSet),
        kind: "load",
        value: bestLoadSet.weight,
        previousValue: history?.bestWeight?.value ?? null,
      });
    }

    const bestStrengthSet = getBestSet(weightedSets, (set) =>
      estimatedOneRepMax(set.weight, set.reps),
    );
    const strengthValue = bestStrengthSet
      ? estimatedOneRepMax(bestStrengthSet.weight, bestStrengthSet.reps)
      : 0;
    if (bestStrengthSet && strengthValue > (history?.estimatedOneRepMax?.value ?? 0) + 0.001) {
      newRecords.push({
        ...toWorkoutRecord(exercise, bestStrengthSet),
        kind: "estimated-one-rep-max",
        value: strengthValue,
        previousValue: history?.estimatedOneRepMax?.value ?? null,
      });
    }

    if (weightedSets.length === 0) {
      const bestRepsSet = getBestSet(completedSets, (set) => set.reps);
      if (bestRepsSet && bestRepsSet.reps > (history?.bestBodyweightReps?.value ?? 0)) {
        newRecords.push({
          ...toWorkoutRecord(exercise, bestRepsSet),
          kind: "reps",
          value: bestRepsSet.reps,
          previousValue: history?.bestBodyweightReps?.value ?? null,
        });
      }
    }
  }

  return newRecords;
}

function getBestSet(
  sets: WorkoutSet[],
  score: (set: WorkoutSet) => number,
) {
  return sets.reduce<WorkoutSet | null>((best, set) =>
    !best || score(set) > score(best) ? set : best, null);
}

function toMark(
  set: WorkoutSet,
  value: number,
  completedAt: string,
): PersonalRecordMark {
  return { value, weight: set.weight, reps: set.reps, completedAt };
}

function toWorkoutRecord(
  exercise: WorkoutExercise,
  set: WorkoutSet,
) {
  return {
    exerciseId: exercise.exercise.id,
    exerciseName: exercise.exercise.name,
    setId: set.id,
    weight: set.weight,
    reps: set.reps,
  };
}
