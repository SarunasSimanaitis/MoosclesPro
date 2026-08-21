import {
  ArrowLeft,
  Check,
  Dumbbell,
  Play,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { exercises } from "../data/exercises";

export default function ExerciseDetails() {
  const navigate = useNavigate();
  const { exerciseId } = useParams();

  const exercise = exercises.find(
    (item) => item.id === exerciseId,
  );

  if (!exercise) {
    return (
      <main className="mx-auto max-w-3xl py-16">
        <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--surface-soft)] text-[var(--text-muted)]">
            <Dumbbell size={25} />
          </div>

          <h1 className="mt-5 text-3xl font-black text-[var(--text)]">
            Exercise not found
          </h1>

          <p className="mt-3 text-[var(--text-muted)]">
            We couldn't find the exercise you're looking for.
          </p>

          <button
            type="button"
            onClick={() => navigate("/exercises")}
            className="mt-7 rounded-xl bg-[var(--primary)] px-5 py-3 font-semibold text-white transition hover:bg-[var(--primary-hover)]"
          >
            Back to exercises
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl space-y-8">
      {/* Back */}

      <button
        type="button"
        onClick={() => navigate("/exercises")}
        className="flex items-center gap-2 text-sm font-semibold text-[var(--text-muted)] transition hover:text-[var(--primary)]"
      >
        <ArrowLeft size={17} />

        Back to exercise library
      </button>

      {/* Hero */}

      <section className="overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] shadow-sm">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
          {/* Visual */}

          <div className="flex min-h-[320px] items-center justify-center bg-[var(--surface-soft)] p-10">
            {exercise.imageUrl ? (
              <img
                src={exercise.imageUrl}
                alt={exercise.name}
                className="h-full max-h-[360px] w-full object-cover"
              />
            ) : (
              <div className="text-center">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[2rem] bg-[var(--primary-soft)] text-[var(--primary)]">
                  <Dumbbell size={42} />
                </div>

                <p className="mt-5 text-sm font-medium text-[var(--text-muted)]">
                  Exercise preview
                </p>

                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  Media can be added later
                </p>
              </div>
            )}
          </div>

          {/* Information */}

          <div className="p-7 md:p-10">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-[var(--primary-soft)] px-3 py-1.5 text-xs font-bold text-[var(--primary)]">
                {exercise.muscleGroup}
              </span>

              <span className="rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--text-muted)]">
                {exercise.equipment}
              </span>

              <span className="rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--text-muted)]">
                {exercise.category}
              </span>
            </div>

            <h1 className="mt-6 text-4xl font-black tracking-tight text-[var(--text)]">
              {exercise.name}
            </h1>

            <p className="mt-4 text-[var(--text-muted)]">
              A detailed breakdown of the exercise, muscles
              involved, and how to perform it correctly.
            </p>

            {exercise.videoUrl && (
              <button
                type="button"
                className="mt-6 flex items-center gap-2 rounded-xl border border-[var(--border-strong)] px-5 py-3 text-sm font-semibold text-[var(--text)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
              >
                <Play size={17} />

                Watch demonstration
              </button>
            )}

            <button
              type="button"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3.5 font-semibold text-white transition hover:bg-[var(--primary-hover)]"
            >
              <Dumbbell size={18} />

              Add to routine
            </button>
          </div>
        </div>
      </section>

      {/* Muscles */}

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-7">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">
            Primary muscles
          </p>

          <div className="mt-5 space-y-3">
            {exercise.primaryMuscles.map((muscle) => (
              <div
                key={muscle}
                className="flex items-center gap-3 rounded-xl bg-[var(--surface-soft)] px-4 py-3"
              >
                <Check
                  size={17}
                  className="text-[var(--primary)]"
                />

                <span className="font-medium text-[var(--text)]">
                  {muscle}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-7">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">
            Secondary muscles
          </p>

          {exercise.secondaryMuscles.length > 0 ? (
            <div className="mt-5 space-y-3">
              {exercise.secondaryMuscles.map((muscle) => (
                <div
                  key={muscle}
                  className="flex items-center gap-3 rounded-xl bg-[var(--surface-soft)] px-4 py-3"
                >
                  <Check
                    size={17}
                    className="text-[var(--primary)]"
                  />

                  <span className="font-medium text-[var(--text)]">
                    {muscle}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-5 text-sm text-[var(--text-muted)]">
              No secondary muscles listed.
            </p>
          )}
        </div>
      </section>

      {/* Instructions */}

      <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-7 md:p-9">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">
          How to perform
        </p>

        <h2 className="mt-3 text-2xl font-black text-[var(--text)]">
          Step-by-step instructions
        </h2>

        <div className="mt-7 space-y-4">
          {exercise.instructions.map(
            (instruction, index) => (
              <div
                key={`${exercise.id}-step-${index}`}
                className="flex gap-4 rounded-2xl bg-[var(--surface-soft)] p-4"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--primary-soft)] text-sm font-black text-[var(--primary)]">
                  {index + 1}
                </div>

                <p className="pt-1 text-sm leading-6 text-[var(--text)]">
                  {instruction}
                </p>
              </div>
            ),
          )}
        </div>
      </section>
    </main>
  );
}