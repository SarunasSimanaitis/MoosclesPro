import { useState } from "react";
import { ArrowLeft, CheckCircle2, Clock3, Dumbbell } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import ExerciseCard from "../components/workout/ExerciseCard";

import { routines } from "../data/routines";
import { useRoutineStore } from "../stores/routineStore";

import type { WorkoutExercise } from "../types/WorkoutExercise";
import type { WorkoutSet } from "../types/WorkoutSet";

import { saveWorkoutSession } from "../utils/workoutStorage";

export default function WorkoutSessionPage() {
  const navigate = useNavigate();
  const { routineId } = useParams();

  const customRoutines = useRoutineStore(
    (state) => state.customRoutines,
  );

  /*
   * Combine built-in and custom routines.
   *
   * This is the important fix:
   * custom routines live in Zustand,
   * while built-in routines come from routines.ts.
   */
  const allRoutines = [
    ...routines,
    ...customRoutines,
  ];

  const routine = allRoutines.find(
    (item) => item.id === routineId,
  );

  /*
   * If the routine doesn't exist, show a proper
   * empty/error state instead of crashing.
   */
  if (!routine) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-6">
        <section className="w-full rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-10 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]">
            <Dumbbell size={28} />
          </div>

          <h1 className="mt-6 text-3xl font-black text-[var(--text)]">
            Workout not found
          </h1>

          <p className="mt-3 text-[var(--text-muted)]">
            The routine you're looking for doesn't exist.
          </p>

          <button
            type="button"
            onClick={() => navigate("/workouts")}
            className="mt-7 rounded-xl bg-[var(--primary)] px-6 py-3 font-semibold text-white transition hover:bg-[var(--primary-hover)]"
          >
            Back to Workouts
          </button>
        </section>
      </main>
    );
  }

  return (
    <WorkoutSession
      routine={routine}
      onBack={() => navigate("/workouts")}
    />
  );
}

type WorkoutSessionProps = {
  routine: {
    id: string;
    name: string;
    exercises: {
      exercise: WorkoutExercise["exercise"];
      targetSets: number;
      targetReps: string;
      restSeconds: number;
    }[];
  };

  onBack: () => void;
};

function WorkoutSession({
  routine,
  onBack,
}: WorkoutSessionProps) {
  const navigate = useNavigate();

  const [startedAt] = useState(
    () => new Date().toISOString(),
  );

  const [workoutExercises, setWorkoutExercises] =
    useState<WorkoutExercise[]>(() =>
      routine.exercises.map(
        (routineExercise) => {
          const sets: WorkoutSet[] =
            Array.from(
              {
                length:
                  routineExercise.targetSets,
              },
              (_, index) => ({
                id: crypto.randomUUID(),
                order: index + 1,
                weight: 0,
                reps: 0,
                completed: false,
              }),
            );

          return {
            exercise: routineExercise.exercise,
            targetSets:
              routineExercise.targetSets,
            targetReps:
              routineExercise.targetReps,
            restSeconds:
              routineExercise.restSeconds,
            sets,
          };
        },
      ),
    );

  function updateWeight(
    exerciseId: string,
    setId: string,
    newWeight: number,
  ) {
    setWorkoutExercises(
      (previousExercises) =>
        previousExercises.map(
          (exercise) => {
            if (
              exercise.exercise.id !==
              exerciseId
            ) {
              return exercise;
            }

            return {
              ...exercise,
              sets: exercise.sets.map(
                (set) => {
                  if (set.id !== setId) {
                    return set;
                  }

                  return {
                    ...set,
                    weight: newWeight,
                  };
                },
              ),
            };
          },
        ),
    );
  }

  function updateReps(
    exerciseId: string,
    setId: string,
    newReps: number,
  ) {
    setWorkoutExercises(
      (previousExercises) =>
        previousExercises.map(
          (exercise) => {
            if (
              exercise.exercise.id !==
              exerciseId
            ) {
              return exercise;
            }

            return {
              ...exercise,
              sets: exercise.sets.map(
                (set) => {
                  if (set.id !== setId) {
                    return set;
                  }

                  return {
                    ...set,
                    reps: newReps,
                  };
                },
              ),
            };
          },
        ),
    );
  }

  function updateCompleted(
    exerciseId: string,
    setId: string,
  ) {
    setWorkoutExercises(
      (previousExercises) =>
        previousExercises.map(
          (exercise) => {
            if (
              exercise.exercise.id !==
              exerciseId
            ) {
              return exercise;
            }

            return {
              ...exercise,
              sets: exercise.sets.map(
                (set) => {
                  if (set.id !== setId) {
                    return set;
                  }

                  return {
                    ...set,
                    completed:
                      !set.completed,
                  };
                },
              ),
            };
          },
        ),
    );
  }

  function finishWorkout() {
    const completedAt =
      new Date().toISOString();

    const session = {
      id: crypto.randomUUID(),
      routineId: routine.id,
      startedAt,
      completedAt,
      exercises: workoutExercises,
    };

    saveWorkoutSession(session);

    navigate("/history");
  }

  const completedSets =
    workoutExercises.reduce(
      (total, exercise) =>
        total +
        exercise.sets.filter(
          (set) => set.completed,
        ).length,
      0,
    );

  const totalSets =
    workoutExercises.reduce(
      (total, exercise) =>
        total + exercise.sets.length,
      0,
    );

  const progress =
    totalSets > 0
      ? (completedSets / totalSets) * 100
      : 0;

  return (
    <main className="mx-auto max-w-5xl space-y-8">
      {/* Back */}

      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-semibold text-[var(--text-muted)] transition hover:text-[var(--primary)]"
      >
        <ArrowLeft size={17} />

        Back to workouts
      </button>

      {/* Header */}

      <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-7 shadow-sm md:p-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--primary)]">
              Active Workout
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight text-[var(--text)]">
              {routine.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-[var(--text-muted)]">
              <span className="flex items-center gap-2">
                <Dumbbell size={16} />

                {workoutExercises.length} exercises
              </span>

              <span className="flex items-center gap-2">
                <Clock3 size={16} />

                {completedSets}/{totalSets} sets
              </span>
            </div>
          </div>

          <div className="rounded-2xl bg-[var(--surface-soft)] px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Progress
            </p>

            <p className="mt-1 text-2xl font-black text-[var(--text)]">
              {Math.round(progress)}%
            </p>
          </div>
        </div>

        {/* Progress bar */}

        <div className="mt-7">
          <div className="h-3 overflow-hidden rounded-full bg-[var(--surface-soft)]">
            <div
              className="h-full rounded-full bg-[var(--primary)] transition-all duration-300"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>
      </section>

      {/* Exercises */}

      <div className="space-y-6">
        {workoutExercises.map(
          (workoutExercise) => (
            <ExerciseCard
              key={
                workoutExercise.exercise.id
              }
              workoutExercise={
                workoutExercise
              }
              updateWeight={updateWeight}
              updateReps={updateReps}
              updateCompleted={
                updateCompleted
              }
            />
          ),
        )}
      </div>

      {/* Finish */}

      <section className="flex flex-col items-center justify-between gap-5 rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-6 md:flex-row">
        <div className="flex items-center gap-3">
          <CheckCircle2
            size={22}
            className={
              completedSets === totalSets &&
              totalSets > 0
                ? "text-[var(--primary)]"
                : "text-[var(--text-muted)]"
            }
          />

          <div>
            <p className="font-bold text-[var(--text)]">
              {completedSets ===
                totalSets &&
              totalSets > 0
                ? "Workout complete!"
                : "Keep going!"}
            </p>

            <p className="text-sm text-[var(--text-muted)]">
              {completedSets} of{" "}
              {totalSets} sets completed
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={finishWorkout}
          className="w-full rounded-xl bg-[var(--primary)] px-7 py-3.5 font-semibold text-white transition hover:bg-[var(--primary-hover)] md:w-auto"
        >
          Finish Workout
        </button>
      </section>
    </main>
  );
}