import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  Dumbbell,
  Target,
} from "lucide-react";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { programs } from "../data/programs";
import { routines } from "../data/routines";

export default function ProgramDetails() {
  const navigate = useNavigate();
  const { programId } = useParams<{
    programId: string;
  }>();

  const program = useMemo(
    () =>
      programs.find(
        (item) => item.id === programId,
      ),
    [programId],
  );

  if (!program) {
    return (
      <main className="space-y-6">
        <button
          type="button"
          onClick={() => navigate("/workouts")}
          className="
            inline-flex
            items-center
            gap-2
            text-sm
            font-semibold
            text-[var(--text-muted)]
            transition
            hover:text-[var(--primary)]
          "
        >
          <ArrowLeft size={17} />
          Back to workouts
        </button>

        <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-10 text-center">
          <h1 className="text-3xl font-black text-[var(--text)]">
            Program not found
          </h1>

          <p className="mt-3 text-[var(--text-muted)]">
            This training program may no longer be
            available.
          </p>
        </section>
      </main>
    );
  }

  const programDays = program.days.map(
    (day) => ({
      ...day,
      routine: routines.find(
        (routine) =>
          routine.id === day.routineId,
      ),
    }),
  );

  const totalExercises = programDays.reduce(
    (total, day) =>
      total +
      (day.routine?.exercises.length ?? 0),
    0,
  );

  function startRoutine(
    routineId: string,
  ) {
    navigate(
      `/workout/${encodeURIComponent(
        routineId,
      )}`,
    );
  }

  return (
    <main className="space-y-10">
      {/* Back */}

      <button
        type="button"
        onClick={() => navigate("/workouts")}
        className="
          inline-flex
          items-center
          gap-2
          text-sm
          font-semibold
          text-[var(--text-muted)]
          transition
          hover:text-[var(--primary)]
        "
      >
        <ArrowLeft size={17} />
        Back to workouts
      </button>

      {/* Hero */}

      <section className="relative overflow-hidden rounded-[2.5rem] bg-[var(--text)] px-7 py-10 md:px-10 md:py-14">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[var(--primary)]/15 blur-3xl" />

        <div className="relative max-w-4xl">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-[var(--primary)]/15 px-3 py-1.5 text-xs font-bold text-[var(--primary)]">
              FREE PROGRAM
            </span>

            <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/70">
              {program.difficulty}
            </span>
          </div>

          <h1 className="mt-6 text-4xl font-black tracking-tight text-white md:text-6xl">
            {program.name}
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/60">
            {program.description}
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <CalendarDays
                size={18}
                className="text-[var(--primary)]"
              />

              <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-white/40">
                Frequency
              </p>

              <p className="mt-1 font-bold text-white">
                {program.daysPerWeek} days/week
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <Clock3
                size={18}
                className="text-[var(--primary)]"
              />

              <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-white/40">
                Session
              </p>

              <p className="mt-1 font-bold text-white">
                ~{program.sessionMinutes} min
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <Target
                size={18}
                className="text-[var(--primary)]"
              />

              <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-white/40">
                Goal
              </p>

              <p className="mt-1 font-bold text-white">
                {program.goal}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Program overview */}

      <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-7 md:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]">
              <Dumbbell size={21} />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--primary)]">
                Program overview
              </p>

              <h2 className="mt-1 text-2xl font-black text-[var(--text)]">
                What you'll be doing
              </h2>
            </div>
          </div>

          <p className="mt-6 leading-relaxed text-[var(--text-muted)]">
            This program gives you a structured
            weekly training schedule while keeping
            each individual session focused and
            manageable.
          </p>

          <div className="mt-7 space-y-3">
            {[
              `${program.daysPerWeek} structured training days each week`,
              `${program.sessionMinutes}-minute average sessions`,
              `${totalExercises} total exercise slots across the week`,
              `${program.environment} training`,
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--primary-soft)] text-[var(--primary)]">
                  <Check size={15} strokeWidth={3} />
                </div>

                <span className="text-sm font-medium text-[var(--text)]">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        <aside className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-7">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--primary)]">
            Built for
          </p>

          <div className="mt-5 space-y-4">
            <div>
              <p className="text-xs text-[var(--text-muted)]">
                Goal
              </p>

              <p className="mt-1 font-bold text-[var(--text)]">
                {program.goal}
              </p>
            </div>

            <div>
              <p className="text-xs text-[var(--text-muted)]">
                Experience
              </p>

              <p className="mt-1 font-bold text-[var(--text)]">
                {program.difficulty}
              </p>
            </div>

            <div>
              <p className="text-xs text-[var(--text-muted)]">
                Equipment
              </p>

              <p className="mt-1 font-bold text-[var(--text)]">
                {program.environment}
              </p>
            </div>
          </div>
        </aside>
      </section>

      {/* Weekly schedule */}

      <section className="space-y-6">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--primary)]">
            Your week
          </p>

          <h2 className="mt-2 text-3xl font-black tracking-tight text-[var(--text)] md:text-4xl">
            Weekly structure
          </h2>

          <p className="mt-2 text-[var(--text-muted)]">
            Complete the sessions in order and give
            yourself enough recovery between them.
          </p>
        </div>

        <div className="space-y-4">
          {programDays.map(
            ({
              day,
              name,
              routine,
            }) => {
              if (!routine) {
                return (
                  <article
                    key={day}
                    className="rounded-[2rem] border border-[var(--danger)]/30 bg-[var(--danger)]/5 p-6"
                  >
                    <p className="font-bold text-[var(--danger)]">
                      Day {day}: Routine unavailable
                    </p>
                  </article>
                );
              }

              return (
                <article
                  key={routine.id}
                  className="
                    rounded-[2rem]
                    border
                    border-[var(--border)]
                    bg-[var(--surface)]
                    p-6
                    shadow-sm
                    transition-all
                    duration-300
                    hover:border-[var(--border-strong)]
                    hover:shadow-[var(--shadow-md)]
                    md:p-7
                  "
                >
                  <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="flex gap-5">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--primary-soft)] font-black text-[var(--primary)]">
                        {day}
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                          Day {day}
                        </p>

                        <h3 className="mt-1 text-2xl font-black text-[var(--text)]">
                          {name}
                        </h3>

                        <p className="mt-1 text-sm text-[var(--text-muted)]">
                          {routine.exercises.length}{" "}
                          exercises · ~
                          {Math.max(
                            20,
                            routine.exercises
                              .length * 10,
                          )}{" "}
                          min
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        startRoutine(
                          routine.id,
                        )
                      }
                      className="
                        inline-flex
                        shrink-0
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-[var(--primary)]
                        px-5
                        py-3
                        font-semibold
                        text-white
                        transition
                        hover:bg-[var(--primary-hover)]
                      "
                    >
                      Start workout
                      <ArrowRight size={17} />
                    </button>
                  </div>

                  <div className="mt-6 grid gap-2 border-t border-[var(--border)] pt-5 sm:grid-cols-2">
                    {routine.exercises.map(
                      (
                        routineExercise,
                        index,
                      ) => (
                        <div
                          key={`${routine.id}-${routineExercise.exercise.id}-${index}`}
                          className="flex items-center justify-between gap-3 rounded-xl bg-[var(--surface-soft)] px-4 py-3"
                        >
                          <span className="truncate text-sm font-medium text-[var(--text)]">
                            {
                              routineExercise
                                .exercise
                                .name
                            }
                          </span>

                          <span className="shrink-0 text-xs font-semibold text-[var(--text-muted)]">
                            {
                              routineExercise.targetSets
                            }{" "}
                            ×{" "}
                            {
                              routineExercise.targetReps
                            }
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </article>
              );
            },
          )}
        </div>
      </section>

      {/* Future personalization */}

      <section className="overflow-hidden rounded-[2.5rem] bg-[var(--surface-soft)] p-7 md:p-10">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--primary)]">
            One size doesn't fit everyone
          </p>

          <h2 className="mt-4 text-3xl font-black tracking-tight text-[var(--text)] md:text-4xl">
            Want something built around you?
          </h2>

          <p className="mt-4 leading-relaxed text-[var(--text-muted)]">
            Personalized training will eventually
            take your goals, experience, schedule,
            available equipment, and training
            preferences into account.
          </p>

          <button
            type="button"
            disabled
            className="
              mt-7
              inline-flex
              items-center
              gap-2
              rounded-xl
              border
              border-[var(--border)]
              px-5
              py-3
              text-sm
              font-semibold
              text-[var(--text-muted)]
              opacity-60
            "
          >
            Personalize my training
            <span className="text-xs">
              Coming soon
            </span>
          </button>
        </div>
      </section>
    </main>
  );
}