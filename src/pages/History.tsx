import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Dumbbell,
  Weight,
} from "lucide-react";
import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { routines } from "../data/routines";
import { useRoutineStore } from "../stores/routineStore";

import { getWorkoutSessions } from "../utils/workoutStorage";

import type { WorkoutSession } from "../types/WorkoutSession";

export default function History() {
  const navigate = useNavigate();

  const customRoutines = useRoutineStore(
    (state) => state.customRoutines,
  );

  const [sessions] = useState<WorkoutSession[]>(
    () => getWorkoutSessions(),
  );

  const allRoutines = [
    ...routines,
    ...customRoutines,
  ];

  function getRoutineName(routineId: string) {
    return (
      allRoutines.find(
        (routine) => routine.id === routineId,
      )?.name ?? "Unknown Routine"
    );
  }

  function getCompletedSets(
    session: WorkoutSession,
  ) {
    return session.exercises.reduce(
      (total, exercise) => {
        return (
          total +
          exercise.sets.filter(
            (set) => set.completed,
          ).length
        );
      },
      0,
    );
  }

  function getTotalVolume(
    session: WorkoutSession,
  ) {
    return session.exercises.reduce(
      (total, exercise) => {
        return (
          total +
          exercise.sets.reduce(
            (exerciseTotal, set) => {
              return (
                exerciseTotal +
                set.weight * set.reps
              );
            },
            0,
          )
        );
      },
      0,
    );
  }

  function getDuration(session: WorkoutSession) {
    const start = new Date(
      session.startedAt,
    ).getTime();

    const end = new Date(
      session.completedAt,
    ).getTime();

    return Math.max(
      0,
      Math.round((end - start) / 60000),
    );
  }

  return (
    <main className="mx-auto max-w-6xl space-y-10">
      {/* Header */}

      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--primary)]">
          Training Log
        </p>

        <h1 className="mt-3 text-4xl font-black tracking-tight text-[var(--text)] md:text-5xl">
          Workout History
        </h1>

        <p className="mt-3 max-w-2xl text-lg text-[var(--text-muted)]">
          Review your completed workouts and track
          your progress over time.
        </p>
      </section>

      {/* Empty state */}

      {sessions.length === 0 ? (
        <section className="rounded-[2rem] border border-dashed border-[var(--border-strong)] bg-[var(--surface)] p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]">
            <Dumbbell size={28} />
          </div>

          <h2 className="mt-6 text-2xl font-black text-[var(--text)]">
            No workouts yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-[var(--text-muted)]">
            Complete your first workout and it will
            appear here.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/workouts")
            }
            className="mt-6 rounded-xl bg-[var(--primary)] px-6 py-3 font-semibold text-white transition hover:bg-[var(--primary-hover)]"
          >
            Browse Workouts
          </button>
        </section>
      ) : (
        /* History list */

        <section className="space-y-5">
          {sessions.map((session) => {
            const routineName =
              getRoutineName(session.routineId);

            const completedSets =
              getCompletedSets(session);

            const totalVolume =
              getTotalVolume(session);

            const duration =
              getDuration(session);

            return (
              <article
                key={session.id}
                className="group rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg md:p-8"
              >
                {/* Top */}

                <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
                      <CheckCircle2 size={16} />

                      Completed Workout
                    </div>

                    <h2 className="mt-4 text-2xl font-black text-[var(--text)] md:text-3xl">
                      {routineName}
                    </h2>

                    <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-[var(--text-muted)]">
                      <span className="flex items-center gap-2">
                        <CalendarDays
                          size={16}
                        />

                        {new Date(
                          session.completedAt,
                        ).toLocaleDateString()}
                      </span>

                      <span className="flex items-center gap-2">
                        <Clock3 size={16} />

                        {duration} min
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="flex items-center gap-2 self-start text-sm font-semibold text-[var(--primary)] transition hover:gap-3"
                  >
                    View details

                    <ArrowRight size={17} />
                  </button>
                </div>

                {/* Stats */}

                <div className="mt-7 grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl bg-[var(--surface-soft)] p-5">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                      <Dumbbell size={15} />

                      Exercises
                    </div>

                    <p className="mt-3 text-2xl font-black text-[var(--text)]">
                      {session.exercises.length}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[var(--surface-soft)] p-5">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                      <CheckCircle2 size={15} />

                      Completed Sets
                    </div>

                    <p className="mt-3 text-2xl font-black text-[var(--text)]">
                      {completedSets}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[var(--surface-soft)] p-5">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                      <Weight size={15} />

                      Volume
                    </div>

                    <p className="mt-3 text-2xl font-black text-[var(--text)]">
                      {totalVolume.toLocaleString()} kg
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}