import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Dumbbell,
  Pause,
  Play,
  RotateCcw,
} from "lucide-react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import ExerciseCard from "../components/workout/ExerciseCard";

import { routines } from "../data/routines";
import { useRoutineStore } from "../stores/routineStore";

import { useRestTimer } from "../hooks/useRestTimer";
import { useWorkoutSession } from "../hooks/useWorkoutSession";
import { useWorkoutTimer } from "../hooks/useWorkoutTimer";

import { saveWorkoutSession } from "../utils/workoutStorage";

import type { Routine } from "../types/Routine";

export default function WorkoutSessionPage() {
  const navigate = useNavigate();
  const { routineId } = useParams();

  const customRoutines = useRoutineStore(
    (state) => state.customRoutines,
  );

  const allRoutines = [
    ...routines,
    ...customRoutines,
  ];

  const routine = allRoutines.find(
    (item) => item.id === routineId,
  );

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, []);

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
            The routine you're looking for doesn't
            exist.
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
  routine: Routine;
  onBack: () => void;
};

function WorkoutSession({
  routine,
  onBack,
}: WorkoutSessionProps) {
  const navigate = useNavigate();

  const {
    startedAt,
    workoutExercises,
    completedSets,
    totalSets,
    progress,
    totalVolume,
    updateWeight,
    commitWeight,
    updateReps,
    commitReps,
    toggleSet,
    createSession,
  } = useWorkoutSession(routine);

  const {
    isPaused,
    formattedTime,
    togglePause,
  } = useWorkoutTimer(startedAt);

  const {
    restTime,
    restDuration,
    start: startRestTimer,
    stop: stopRestTimer,
    addTime,
    removeTime,
  } = useRestTimer();

  const [
    isFinishing,
    setIsFinishing,
  ] = useState(false);

  const [
    saveError,
    setSaveError,
  ] = useState<string | null>(null);

  function handleToggleSet(
    exerciseId: string,
    setId: string,
  ) {
    const exercise =
      workoutExercises.find(
        (item) =>
          item.exercise.id ===
          exerciseId,
      );

    if (!exercise) {
      return;
    }

    const set = exercise.sets.find(
      (item) =>
        item.id === setId,
    );

    if (!set) {
      return;
    }

    toggleSet(
      exerciseId,
      setId,
    );

    if (!set.completed) {
      startRestTimer(
        exercise.restSeconds,
      );
    }
  }

  async function finishWorkout() {
    if (isFinishing) {
      return;
    }

    setIsFinishing(true);
    setSaveError(null);

    const session =
      createSession();

    try {
      await saveWorkoutSession(
        session,
      );

      navigate("/history", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Failed to save workout:",
        error,
      );

      setSaveError(
        error instanceof Error
          ? error.message
          : "Could not save your workout. Please try again.",
      );

      setIsFinishing(false);
    }
  }

  function handleBack() {
    const hasProgress =
      completedSets > 0 ||
      workoutExercises.some(
        (exercise) =>
          exercise.sets.some(
            (set) =>
              set.weight > 0 ||
              set.reps > 0,
          ),
      );

    if (!hasProgress) {
      onBack();
      return;
    }

    const shouldLeave =
      window.confirm(
        "You have an active workout. Leave without saving it?",
      );

    if (shouldLeave) {
      onBack();
    }
  }

  return (
    <main className="mx-auto max-w-5xl space-y-6 pb-10">
      {/* Back */}

      <button
        type="button"
        onClick={handleBack}
        className="flex items-center gap-2 text-sm font-semibold text-[var(--text-muted)] transition hover:text-[var(--primary)]"
      >
        <ArrowLeft size={17} />
        Back to workouts
      </button>

      {/* Header */}

      <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--primary)]">
                Active Workout
              </p>

              <h1 className="mt-3 text-3xl font-black tracking-tight text-[var(--text)] md:text-4xl">
                {routine.name}
              </h1>

              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[var(--text-muted)]">
                <span className="flex items-center gap-2">
                  <Dumbbell size={16} />
                  {workoutExercises.length}{" "}
                  exercises
                </span>

                <span className="flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  {completedSets}/
                  {totalSets} sets
                </span>

                <span className="flex items-center gap-2">
                  <Clock3 size={16} />
                  {formattedTime}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="rounded-2xl bg-[var(--surface-soft)] px-5 py-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  Time
                </p>

                <p className="mt-1 font-mono text-2xl font-black text-[var(--text)]">
                  {formattedTime}
                </p>
              </div>

              <button
                type="button"
                onClick={togglePause}
                className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--border-strong)] bg-[var(--surface-soft)] text-[var(--text-muted)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
                aria-label={
                  isPaused
                    ? "Resume workout"
                    : "Pause workout"
                }
              >
                {isPaused ? (
                  <Play size={20} />
                ) : (
                  <Pause size={20} />
                )}
              </button>
            </div>
          </div>

          {isPaused && (
            <div className="rounded-2xl border border-[var(--primary)]/20 bg-[var(--primary-soft)] px-4 py-3 text-sm font-semibold text-[var(--primary)]">
              Workout paused. Active workout
              time is not increasing.
            </div>
          )}

          {/* Progress */}

          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-semibold text-[var(--text)]">
                Workout progress
              </span>

              <span className="font-bold text-[var(--primary)]">
                {Math.round(progress)}%
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-[var(--surface-soft)]">
              <div
                className="h-full rounded-full bg-[var(--primary)] transition-all duration-300"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>

          {/* Stats */}

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            <WorkoutStat
              label="Exercises"
              value={workoutExercises.length}
            />

            <WorkoutStat
              label="Completed sets"
              value={completedSets}
            />

            <WorkoutStat
              label="Volume"
              value={`${totalVolume.toLocaleString()} kg`}
              wide
            />
          </div>
        </div>
      </section>

      {/* Save error */}

      {saveError && (
        <section className="rounded-2xl border border-[var(--danger)]/30 bg-[var(--danger)]/10 px-5 py-4 text-sm font-medium text-[var(--danger)]">
          {saveError}
        </section>
      )}

      {/* Rest Timer */}

      {restTime !== null && (
        <section className="sticky top-24 z-20 rounded-[1.5rem] border border-[var(--primary)]/30 bg-[var(--primary-soft)] p-4 shadow-lg backdrop-blur">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--primary)]">
                Rest timer
              </p>

              <p className="mt-1 text-2xl font-black text-[var(--text)]">
                {formatRestTime(restTime)}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  removeTime(15)
                }
                className="rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:border-[var(--primary)]"
              >
                -15s
              </button>

              <button
                type="button"
                onClick={() =>
                  addTime(15)
                }
                className="rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:border-[var(--primary)]"
              >
                +15s
              </button>

              <button
                type="button"
                onClick={stopRestTimer}
                className="flex items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--primary-hover)]"
              >
                <RotateCcw size={15} />
                Stop
              </button>
            </div>
          </div>

          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[var(--surface)]">
            <div
              className="h-full rounded-full bg-[var(--primary)] transition-all duration-1000"
              style={{
                width:
                  restDuration > 0
                    ? `${Math.min(
                      100,
                      (restTime /
                        restDuration) *
                      100,
                    )
                    }%`
                    : "0%",
              }}
            />
          </div>
        </section>
      )}

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
              commitWeight={commitWeight}
              updateReps={updateReps}
              commitReps={commitReps}
              updateCompleted={
                handleToggleSet
              }
            />
          ),
        )}
      </div>

      {/* Finish */}

      <section className="flex flex-col gap-5 rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <CheckCircle2
            size={24}
            className={
              completedSets ===
                totalSets &&
                totalSets > 0
                ? "text-[var(--success)]"
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
          onClick={() =>
            void finishWorkout()
          }
          disabled={isFinishing}
          className="w-full rounded-xl bg-[var(--primary)] px-7 py-3.5 font-semibold text-white transition hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
        >
          {isFinishing
            ? "Saving Workout..."
            : "Finish Workout"}
        </button>
      </section>
    </main>
  );
}

type WorkoutStatProps = {
  label: string;
  value: string | number;
  wide?: boolean;
};

function WorkoutStat({
  label,
  value,
  wide = false,
}: WorkoutStatProps) {
  return (
    <div
      className={`rounded-2xl bg-[var(--surface-soft)] p-4 ${wide
          ? "col-span-2 md:col-span-1"
          : ""
        }`}
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
        {label}
      </p>

      <p className="mt-1 text-xl font-black text-[var(--text)]">
        {value}
      </p>
    </div>
  );
}

function formatRestTime(
  seconds: number,
) {
  const minutes = Math.floor(
    seconds / 60,
  );

  const remainingSeconds =
    seconds % 60;

  return `${minutes
    .toString()
    .padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
}