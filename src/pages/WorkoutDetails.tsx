import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Dumbbell,
} from "lucide-react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useEffect, useState } from "react";

import { useRoutineStore } from "../stores/routineStore";
import { routines } from "../data/routines";
import {
  getWorkoutSessions,
} from "../utils/workoutStorage";

import type { WorkoutSession } from "../types/WorkoutSession";

export default function WorkoutDetails() {
  const navigate = useNavigate();
  const { sessionId } = useParams();

  const customRoutines = useRoutineStore(
    (state) => state.customRoutines,
  );

  const [sessions, setSessions] =
    useState<WorkoutSession[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadSessions() {
      try {
        setIsLoading(true);
        setError(null);

        const data =
          await getWorkoutSessions();

        if (!cancelled) {
          setSessions(data);
        }
      } catch (requestError) {
        console.error(
          "Failed to load workout session:",
          requestError,
        );

        if (!cancelled) {
          setError(
            "Could not load this workout.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadSessions();

    return () => {
      cancelled = true;
    };
  }, []);

  const allRoutines = [
    ...routines,
    ...customRoutines,
  ];

  const session = sessions.find(
    (item) => item.id === sessionId,
  );

  if (isLoading) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-5xl items-center justify-center px-6">
        <section className="w-full rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-10 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]">
            <Dumbbell size={28} />
          </div>

          <h1 className="mt-6 text-2xl font-black text-[var(--text)]">
            Loading workout...
          </h1>

          <p className="mt-3 text-[var(--text-muted)]">
            Fetching your workout details.
          </p>
        </section>
      </main>
    );
  }

  if (error || !session) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-6">
        <section className="w-full rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-10 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--surface-soft)] text-[var(--text-muted)]">
            <Dumbbell size={28} />
          </div>

          <h1 className="mt-6 text-3xl font-black text-[var(--text)]">
            Workout not found
          </h1>

          <p className="mt-3 text-[var(--text-muted)]">
            {error ??
              "This workout session could not be found."}
          </p>

          <button
            type="button"
            onClick={() => navigate("/history")}
            className="mt-7 rounded-xl bg-[var(--primary)] px-6 py-3 font-semibold text-white transition hover:bg-[var(--primary-hover)]"
          >
            Back to History
          </button>
        </section>
      </main>
    );
  }

  const routineName =
    allRoutines.find(
      (routine) =>
        routine.id === session.routineId,
    )?.name ?? "Unknown Routine";

  const completedSets =
    session.exercises.reduce(
      (total, exercise) =>
        total +
        exercise.sets.filter(
          (set) => set.completed,
        ).length,
      0,
    );

  const totalSets =
    session.exercises.reduce(
      (total, exercise) =>
        total + exercise.sets.length,
      0,
    );

  const totalVolume =
    session.exercises.reduce(
      (total, exercise) =>
        total +
        exercise.sets.reduce(
          (exerciseTotal, set) =>
            exerciseTotal +
            (set.completed
              ? set.weight * set.reps
              : 0),
          0,
        ),
      0,
    );

  const duration = getDuration(session);

  return (
    <main className="mx-auto max-w-5xl space-y-8 pb-10">
      {/* Back */}

      <Link
        to="/history"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--text-muted)] transition hover:text-[var(--primary)]"
      >
        <ArrowLeft size={17} />
        Workout History
      </Link>

      {/* Header */}

      <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm md:p-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--success)]">
              <CheckCircle2 size={17} />
              Completed Workout
            </div>

            <h1 className="mt-4 text-3xl font-black tracking-tight text-[var(--text)] md:text-4xl">
              {routineName}
            </h1>

            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[var(--text-muted)]">
              <span className="flex items-center gap-2">
                <CalendarDays size={16} />

                {new Date(
                  session.completedAt,
                ).toLocaleDateString()}
              </span>

              <span className="flex items-center gap-2">
                <Clock3 size={16} />

                {duration}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <SummaryStat
              label="Exercises"
              value={session.exercises.length.toString()}
            />

            <SummaryStat
              label="Sets"
              value={`${completedSets}/${totalSets}`}
            />

            <SummaryStat
              label="Volume"
              value={`${totalVolume.toLocaleString()} kg`}
            />
          </div>
        </div>
      </section>

      {/* Exercises */}

      <section>
        <div className="mb-5">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--primary)]">
            Performance
          </p>

          <h2 className="mt-2 text-3xl font-black text-[var(--text)]">
            Exercise breakdown
          </h2>
        </div>

        <div className="space-y-5">
          {session.exercises.map(
            (exercise) => {
              const exerciseCompletedSets =
                exercise.sets.filter(
                  (set) => set.completed,
                ).length;

              const exerciseVolume =
                exercise.sets.reduce(
                  (total, set) =>
                    total +
                    (set.completed
                      ? set.weight *
                      set.reps
                      : 0),
                  0,
                );

              return (
                <section
                  key={exercise.exercise.id}
                  className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm md:p-7"
                >
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div>
                      <h3 className="text-xl font-black text-[var(--text)] md:text-2xl">
                        {exercise.exercise.name}
                      </h3>

                      <p className="mt-1 text-sm text-[var(--text-muted)]">
                        {exercise.exercise.muscleGroup}{" "}
                        ·{" "}
                        {exercise.exercise.equipment}
                      </p>

                      <p className="mt-3 text-sm font-semibold text-[var(--primary)]">
                        Target:{" "}
                        {exercise.targetSets}{" "}
                        sets ·{" "}
                        {exercise.targetReps}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-[var(--success-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--success)]">
                        {exerciseCompletedSets}/
                        {exercise.sets.length}{" "}
                        complete
                      </span>

                      <span className="rounded-full bg-[var(--surface-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--text-muted)]">
                        {exerciseVolume.toLocaleString()}{" "}
                        kg
                      </span>
                    </div>
                  </div>

                  {/* Set table */}

                  <div className="mt-6 overflow-x-auto">
                    <table className="w-full min-w-[500px] border-collapse">
                      <thead>
                        <tr className="border-b border-[var(--border)] text-left text-xs font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]">
                          <th className="px-3 py-3">
                            Set
                          </th>

                          <th className="px-3 py-3">
                            Weight
                          </th>

                          <th className="px-3 py-3">
                            Reps
                          </th>

                          <th className="px-3 py-3">
                            Volume
                          </th>

                          <th className="px-3 py-3 text-right">
                            Status
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {exercise.sets.map(
                          (set) => (
                            <tr
                              key={set.id}
                              className="border-b border-[var(--border)] last:border-0"
                            >
                              <td className="px-3 py-4 font-semibold text-[var(--text)]">
                                {set.order}
                              </td>

                              <td className="px-3 py-4 text-[var(--text)]">
                                {set.weight} kg
                              </td>

                              <td className="px-3 py-4 text-[var(--text)]">
                                {set.reps}
                              </td>

                              <td className="px-3 py-4 text-[var(--text-muted)]">
                                {set.weight *
                                  set.reps}{" "}
                                kg
                              </td>

                              <td className="px-3 py-4 text-right">
                                {set.completed ? (
                                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--success)]">
                                    <CheckCircle2
                                      size={15}
                                    />
                                    Complete
                                  </span>
                                ) : (
                                  <span className="text-sm text-[var(--text-muted)]">
                                    Skipped
                                  </span>
                                )}
                              </td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>
              );
            },
          )}
        </div>
      </section>
    </main>
  );
}

type SummaryStatProps = {
  label: string;
  value: string;
};

function SummaryStat({
  label,
  value,
}: SummaryStatProps) {
  return (
    <div className="rounded-2xl bg-[var(--surface-soft)] px-4 py-3 text-center">
      <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
        {label}
      </p>

      <p className="mt-1 text-sm font-black text-[var(--text)]">
        {value}
      </p>
    </div>
  );
}

function getDuration(
  session: Pick<
    WorkoutSession,
    "startedAt" | "completedAt"
  >,
) {
  const start = new Date(
    session.startedAt,
  ).getTime();

  const end = new Date(
    session.completedAt,
  ).getTime();

  const totalSeconds = Math.max(
    0,
    Math.round((end - start) / 1000),
  );

  const minutes = Math.floor(
    totalSeconds / 60,
  );

  const seconds = totalSeconds % 60;

  if (minutes === 0) {
    return `${seconds} sec`;
  }

  if (seconds === 0) {
    return `${minutes} min`;
  }

  return `${minutes} min ${seconds} sec`;
}