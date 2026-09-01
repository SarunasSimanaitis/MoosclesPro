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
import {
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import {
  routinesApi,
} from "../api/routines";

import { routines } from "../data/routines";
import { useRoutineStore } from "../stores/routineStore";

import type { Routine } from "../types/Routine";

export default function Workouts() {
  const navigate = useNavigate();

  const [
    openMenu,
    setOpenMenu,
  ] = useState<string | null>(null);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<string | null>(null);

  const [
    deletingRoutineId,
    setDeletingRoutineId,
  ] = useState<string | null>(null);

  const [
    duplicatingRoutineId,
    setDuplicatingRoutineId,
  ] = useState<string | null>(null);

  const customRoutines =
    useRoutineStore(
      (state) =>
        state.customRoutines,
    );

  const setCustomRoutines =
    useRoutineStore(
      (state) =>
        state.setCustomRoutines,
    );

  const deleteRoutine =
    useRoutineStore(
      (state) =>
        state.deleteRoutine,
    );

  const addRoutine =
    useRoutineStore(
      (state) =>
        state.addRoutine,
    );

  useEffect(() => {
    let cancelled = false;

    async function loadRoutines() {
      try {
        setIsLoading(true);
        setError(null);

        const data =
          await routinesApi.list();

        if (!cancelled) {
          setCustomRoutines(data);
        }
      } catch (requestError) {
        console.error(
          "Failed to load routines:",
          requestError,
        );

        if (!cancelled) {
          setError(
            "Could not load your routines. Please try again.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadRoutines();

    return () => {
      cancelled = true;
    };
  }, [setCustomRoutines]);

  const allRoutines = [
    ...routines,
    ...customRoutines,
  ];

  async function handleDelete(
    routineId: string,
    routineName: string,
  ) {
    const confirmed =
      window.confirm(
        `Delete "${routineName}"? This cannot be undone.`,
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingRoutineId(
        routineId,
      );
      setError(null);
      setOpenMenu(null);

      await routinesApi.remove(
        routineId,
      );

      deleteRoutine(routineId);
    } catch (requestError) {
      console.error(
        "Failed to delete routine:",
        requestError,
      );

      setError(
        requestError instanceof Error
          ? requestError.message
          : "Could not delete the routine. Please try again.",
      );
    } finally {
      setDeletingRoutineId(null);
    }
  }

  async function handleDuplicate(
    routineId: string,
  ) {
    const routine = allRoutines.find(
      (item) =>
        item.id === routineId,
    );

    if (!routine) {
      return;
    }

    /*
     * Built-in routines are intentionally
     * immutable. Users can duplicate only
     * their own custom routines.
     */
    if (
      !routine.id.startsWith(
        "custom-",
      )
    ) {
      setOpenMenu(null);
      return;
    }

    const duplicatedRoutine: Routine = {
      ...routine,
      id: `custom-${crypto.randomUUID()}`,
      name: `${routine.name} Copy`,
      exercises:
        routine.exercises.map(
          (routineExercise) => ({
            ...routineExercise,
          }),
        ),
    };

    try {
      setDuplicatingRoutineId(
        routineId,
      );
      setError(null);
      setOpenMenu(null);

      const savedRoutine =
        await routinesApi.create(
          duplicatedRoutine,
        );

      addRoutine(savedRoutine);
    } catch (requestError) {
      console.error(
        "Failed to duplicate routine:",
        requestError,
      );

      setError(
        requestError instanceof Error
          ? requestError.message
          : "Could not duplicate the routine. Please try again.",
      );
    } finally {
      setDuplicatingRoutineId(
        null,
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
            Choose a routine or build one around
            your own goals.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate(
              "/workouts/create",
            )
          }
          className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3 font-semibold text-white transition hover:bg-[var(--primary-hover)]"
        >
          <Plus size={18} />
          Create Routine
        </button>
      </section>

      {/* Error */}

      {error && (
        <section
          role="alert"
          className="rounded-2xl border border-[var(--danger)]/30 bg-[var(--danger)]/10 px-5 py-4"
        >
          <p className="text-sm font-medium text-[var(--danger)]">
            {error}
          </p>
        </section>
      )}

      {/* Routine Grid */}

      <section className="grid gap-6 lg:grid-cols-2">
        {allRoutines.map(
          (routine) => {
            const isCustom =
              routine.id.startsWith(
                "custom-",
              );

            const menuOpen =
              openMenu === routine.id;

            const isDeleting =
              deletingRoutineId ===
              routine.id;

            const isDuplicating =
              duplicatingRoutineId ===
              routine.id;

            const isBusy =
              isDeleting ||
              isDuplicating;

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
                      {routine.exercises.length}{" "}
                      exercises
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
                      disabled={isBusy}
                      onClick={() =>
                        setOpenMenu(
                          menuOpen
                            ? null
                            : routine.id,
                        )
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] transition hover:border-[var(--primary)] hover:text-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label={`Actions for ${routine.name}`}
                      aria-expanded={
                        menuOpen
                      }
                    >
                      <MoreHorizontal size={18} />
                    </button>

                    {menuOpen && (
                      <div className="absolute right-0 top-11 z-20 w-48 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-1.5 shadow-xl">
                        {isCustom && (
                          <button
                            type="button"
                            onClick={() => {
                              navigate(
                                `/workouts/create?edit=${encodeURIComponent(
                                  routine.id,
                                )}`,
                              );
                              setOpenMenu(
                                null,
                              );
                            }}
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--text)] transition hover:bg-[var(--surface-soft)]"
                          >
                            <Pencil size={16} />
                            Edit routine
                          </button>
                        )}

                        <button
                          type="button"
                          disabled={
                            isDuplicating
                          }
                          onClick={() =>
                            void handleDuplicate(
                              routine.id,
                            )
                          }
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--text)] transition hover:bg-[var(--surface-soft)] disabled:opacity-40"
                        >
                          <Copy size={16} />

                          {isDuplicating
                            ? "Duplicating..."
                            : "Duplicate"}
                        </button>

                        {isCustom && (
                          <button
                            type="button"
                            disabled={
                              isDeleting
                            }
                            onClick={() =>
                              void handleDelete(
                                routine.id,
                                routine.name,
                              )
                            }
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--danger)] transition hover:bg-[var(--danger)]/10 disabled:opacity-40"
                          >
                            <Trash2 size={16} />

                            {isDeleting
                              ? "Deleting..."
                              : "Delete routine"}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Exercises */}

                <div className="mt-7 space-y-3">
                  {routine.exercises
                    .slice(0, 4)
                    .map(
                      (
                        routineExercise,
                      ) => (
                        <div
                          key={
                            routineExercise
                              .exercise
                              .id
                          }
                          className="flex items-center justify-between rounded-xl bg-[var(--surface-soft)] px-4 py-3"
                        >
                          <span className="font-medium text-[var(--text)]">
                            {
                              routineExercise
                                .exercise
                                .name
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

                  {routine.exercises
                    .length > 4 && (
                    <p className="px-1 text-sm text-[var(--text-muted)]">
                      +
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
                    <span>
                      Approx.{" "}
                      {Math.max(
                        20,
                        routine.exercises
                          .length * 10,
                      )}{" "}
                      min
                    </span>
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
          },
        )}
      </section>
    </main>
  );
}