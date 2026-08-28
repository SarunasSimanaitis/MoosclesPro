import {
  ArrowRight,
  Clock3,
  Copy,
  Dumbbell,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { routines } from "../data/routines";
import { useRoutineStore } from "../stores/routineStore";

import type { Routine } from "../types/Routine";

export default function Workouts() {
  const navigate = useNavigate();

  const [openMenu, setOpenMenu] =
    useState<string | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const customRoutines = useRoutineStore(
    (state) => state.customRoutines,
  );

  const setCustomRoutines = useRoutineStore(
    (state) => state.setCustomRoutines,
  );

  const deleteRoutine = useRoutineStore(
    (state) => state.deleteRoutine,
  );

  const addRoutine = useRoutineStore(
    (state) => state.addRoutine,
  );

  useEffect(() => {
    async function loadRoutines() {
      try {
        const response = await fetch(
          "/api/routines",
          {
            credentials: "include",
          },
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load routines.",
          );
        }

        const data =
          (await response.json()) as Routine[];

        setCustomRoutines(data);
      } catch (error) {
        console.error(
          "Failed to load routines:",
          error,
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadRoutines();
  }, [setCustomRoutines]);

  const allRoutines = [
    ...routines,
    ...customRoutines,
  ];

  async function handleDelete(
    routineId: string,
    routineName: string,
  ) {
    const confirmed = window.confirm(
      `Delete "${routineName}"? This cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `/api/routines?id=${encodeURIComponent(
          routineId,
        )}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error(
          "Failed to delete routine.",
        );
      }

      deleteRoutine(routineId);
      setOpenMenu(null);
    } catch (error) {
      console.error(
        "Failed to delete routine:",
        error,
      );

      window.alert(
        "Could not delete the routine. Please try again.",
      );
    }
  }

  async function handleDuplicate(
    routineId: string,
  ) {
    const routine = allRoutines.find(
      (item) => item.id === routineId,
    );

    if (!routine) {
      return;
    }

    if (!routine.id.startsWith("custom-")) {
      setOpenMenu(null);
      return;
    }

    const duplicatedRoutine: Routine = {
      ...routine,
      id: `custom-${crypto.randomUUID()}`,
      name: `${routine.name} Copy`,
      exercises: routine.exercises.map(
        (routineExercise) => ({
          ...routineExercise,
        }),
      ),
    };

    try {
      const response = await fetch(
        "/api/routines",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            id: duplicatedRoutine.id,
            name: duplicatedRoutine.name,
            exercises:
              duplicatedRoutine.exercises,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(
          "Failed to duplicate routine.",
        );
      }

      const savedRoutine =
        (await response.json()) as Routine;

      addRoutine(savedRoutine);
      setOpenMenu(null);
    } catch (error) {
      console.error(
        "Failed to duplicate routine:",
        error,
      );

      window.alert(
        "Could not duplicate the routine. Please try again.",
      );
    }
  }

  if (isLoading) {
    return (
      <main className="mx-auto max-w-6xl">
        <section className="flex min-h-[50vh] items-center justify-center">
          <p className="text-sm font-medium text-[var(--text-muted)]">
            Loading your routines...
          </p>
        </section>
      </main>
    );
  }

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
          onClick={() =>
            navigate("/workouts/create")
          }
          className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3 font-semibold text-white transition hover:bg-[var(--primary-hover)]"
        >
          <Plus size={18} />
          Create Routine
        </button>
      </section>

      {/* Routine Grid */}

      <section className="grid gap-6 lg:grid-cols-2">
        {allRoutines.map((routine) => {
          const isCustom =
            routine.id.startsWith("custom-");

          const menuOpen =
            openMenu === routine.id;

          return (
            <article
              key={routine.id}
              className="group rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg md:p-8"
            >
              {/* Header */}

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

                <div className="relative flex items-center gap-2">
                  <span className="rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--text-muted)]">
                    {isCustom
                      ? "Custom"
                      : "Routine"}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setOpenMenu(
                        menuOpen
                          ? null
                          : routine.id,
                      )
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
                    aria-label="Routine actions"
                  >
                    <MoreHorizontal size={18} />
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 top-11 z-20 w-48 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-1.5 shadow-xl">
                      {isCustom && (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              navigate(
                                `/workouts/create?edit=${routine.id}`,
                              );
                              setOpenMenu(null);
                            }}
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--text)] transition hover:bg-[var(--surface-soft)]"
                          >
                            <Pencil size={16} />
                            Edit routine
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              void handleDelete(
                                routine.id,
                                routine.name,
                              )
                            }
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--danger)] transition hover:bg-[var(--danger)]/10"
                          >
                            <Trash2 size={16} />
                            Delete routine
                          </button>
                        </>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          void handleDuplicate(
                            routine.id,
                          )
                        }
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--text)] transition hover:bg-[var(--surface-soft)]"
                      >
                        <Copy size={16} />
                        Duplicate
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Exercises */}

              <div className="mt-7 space-y-3">
                {routine.exercises
                  .slice(0, 4)
                  .map(
                    (routineExercise) => (
                      <div
                        key={
                          routineExercise
                            .exercise.id
                        }
                        className="flex items-center justify-between rounded-xl bg-[var(--surface-soft)] px-4 py-3"
                      >
                        <span className="font-medium text-[var(--text)]">
                          {
                            routineExercise
                              .exercise.name
                          }
                        </span>

                        <span className="text-sm text-[var(--text-muted)]">
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

                {routine.exercises.length >
                  4 && (
                    <p className="px-1 text-sm text-[var(--text-muted)]">
                      +{" "}
                      {routine.exercises.length -
                        4}{" "}
                      more exercises
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
                    navigate(
                      `/workout/${routine.id}`,
                    )
                  }
                  className="flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3 font-semibold text-white transition hover:bg-[var(--primary-hover)]"
                >
                  Start
                  <ArrowRight size={17} />
                </button>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}