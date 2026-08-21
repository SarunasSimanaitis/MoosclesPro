import {
  ArrowRight,
  Clock3,
  Dumbbell,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { routines } from "../data/routines";
import { useRoutineStore } from "../stores/routineStore";

export default function Workouts() {
  const navigate = useNavigate();

  const customRoutines = useRoutineStore(
    (state) => state.customRoutines,
  );

  const allRoutines = [
    ...routines,
    ...customRoutines,
  ];

  return (
    <main className="space-y-10">
      {/* Header */}

      <section className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--primary)]">
            Training
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight text-[var(--text)] md:text-5xl">
            Your Workouts
          </h1>

          <p className="mt-3 max-w-2xl text-lg text-[var(--text-muted)]">
            Choose a routine or build one around your own goals.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/workouts/create")}
          className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3 font-semibold text-white transition hover:bg-[var(--primary-hover)]"
        >
          <Plus size={18} />

          Create Routine
        </button>
      </section>

      {/* Routine Grid */}

      <section className="grid gap-6 lg:grid-cols-2">
        {allRoutines.map((routine) => (
          <article
            key={routine.id}
            className="group rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg md:p-8"
          >
            {/* Routine Header */}

            <div className="flex items-start justify-between gap-5">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]">
                  <Dumbbell size={23} />
                </div>

                <h2 className="mt-6 text-2xl font-black text-[var(--text)]">
                  {routine.name}
                </h2>

                <p className="mt-2 text-[var(--text-muted)]">
                  {routine.exercises.length} exercises
                </p>
              </div>

              <span className="rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--text-muted)]">
                {routine.id.startsWith("custom-")
                  ? "Custom"
                  : "Routine"}
              </span>
            </div>

            {/* Exercises */}

            <div className="mt-7 space-y-3">
              {routine.exercises
                .slice(0, 4)
                .map((routineExercise) => (
                  <div
                    key={routineExercise.exercise.id}
                    className="flex items-center justify-between rounded-xl bg-[var(--surface-soft)] px-4 py-3"
                  >
                    <span className="font-medium text-[var(--text)]">
                      {routineExercise.exercise.name}
                    </span>

                    <span className="text-sm text-[var(--text-muted)]">
                      {routineExercise.targetSets} ×{" "}
                      {routineExercise.targetReps}
                    </span>
                  </div>
                ))}

              {routine.exercises.length > 4 && (
                <p className="px-1 text-sm text-[var(--text-muted)]">
                  + {routine.exercises.length - 4} more exercises
                </p>
              )}
            </div>

            {/* Footer */}

            <div className="mt-7 flex items-center justify-between border-t border-[var(--border)] pt-6">
              <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                <Clock3 size={16} />

                <span>Approx. 45 min</span>
              </div>

              <button
                type="button"
                onClick={() =>
                  navigate(`/workout/${routine.id}`)
                }
                className="flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3 font-semibold text-white transition hover:bg-[var(--primary-hover)]"
              >
                Start

                <ArrowRight size={17} />
              </button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}