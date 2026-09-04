import {
  ArrowLeft,
  Check,
  Dumbbell,
  Plus,
  Trash2,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  routinesApi,
} from "../api/routines";

import { exercises } from "../data/exercises";
import { useRoutineStore } from "../stores/routineStore";

import type { Routine } from "../types/Routine";
import type { RoutineExercise } from "../types/RoutineExercise";

export default function RoutineBuilder() {
  const navigate = useNavigate();

  const [
    searchParams,
  ] = useSearchParams();

  const editRoutineId =
    searchParams.get("edit");

  const customRoutines =
    useRoutineStore(
      (state) =>
        state.customRoutines,
    );

  const addRoutine =
    useRoutineStore(
      (state) =>
        state.addRoutine,
    );

  const updateRoutine =
    useRoutineStore(
      (state) =>
        state.updateRoutine,
    );

  const setCustomRoutines =
    useRoutineStore(
      (state) =>
        state.setCustomRoutines,
    );

  const editingRoutine =
    editRoutineId
      ? customRoutines.find(
        (routine) =>
          routine.id ===
          editRoutineId,
      )
      : undefined;

  const [
    name,
    setName,
  ] = useState("");

  const [
    routineExercises,
    setRoutineExercises,
  ] = useState<RoutineExercise[]>(
    [],
  );

  const [
    showExercisePicker,
    setShowExercisePicker,
  ] = useState(false);

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    isLoadingRoutine,
    setIsLoadingRoutine,
  ] = useState(
    Boolean(editRoutineId),
  );

  const [
    isSaving,
    setIsSaving,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<string | null>(null);

  const isEditing =
    Boolean(editRoutineId);

  /*
   * Load the routine when editing.
   *
   * Prefer the already loaded store data.
   * If the page is refreshed directly,
   * fetch the server source of truth.
   */
  useEffect(() => {
    let cancelled = false;

    async function initializeRoutine() {
      if (!editRoutineId) {
        return;
      }

      if (editingRoutine) {
        setName(
          editingRoutine.name,
        );

        setRoutineExercises(
          editingRoutine.exercises,
        );

        setIsLoadingRoutine(false);
        return;
      }

      try {
        setIsLoadingRoutine(true);
        setError(null);

        const data =
          await routinesApi.list();

        if (cancelled) {
          return;
        }

        setCustomRoutines(data);

        const routine = data.find(
          (item) =>
            item.id === editRoutineId,
        );

        if (!routine) {
          setError(
            "The routine you're trying to edit could not be found.",
          );
          return;
        }

        setName(routine.name);

        setRoutineExercises(
          routine.exercises,
        );
      } catch (requestError) {
        if (cancelled) {
          return;
        }

        console.error(
          "Failed to load routine:",
          requestError,
        );

        setError(
          requestError instanceof Error
            ? requestError.message
            : "Could not load this routine. Please try again.",
        );
      } finally {
        if (!cancelled) {
          setIsLoadingRoutine(false);
        }
      }
    }

    void initializeRoutine();

    return () => {
      cancelled = true;
    };
  }, [
    editRoutineId,
    editingRoutine,
    setCustomRoutines,
  ]);

  const availableExercises =
    useMemo(() => {
      const normalizedSearch =
        search
          .trim()
          .toLowerCase();

      if (!normalizedSearch) {
        return exercises;
      }

      return exercises.filter(
        (exercise) =>
          exercise.name
            .toLowerCase()
            .includes(
              normalizedSearch,
            ) ||
          exercise.muscleGroup
            .toLowerCase()
            .includes(
              normalizedSearch,
            ),
      );
    }, [search]);

  function addExercise(
    exerciseId: string,
  ) {
    const exercise =
      exercises.find(
        (item) =>
          item.id ===
          exerciseId,
      );

    if (!exercise) {
      return;
    }

    const alreadyAdded =
      routineExercises.some(
        (item) =>
          item.exercise.id ===
          exercise.id,
      );

    if (alreadyAdded) {
      return;
    }

    setRoutineExercises(
      (current) => [
        ...current,
        {
          exercise,
          targetSets: 3,
          targetReps: "8-12",
          restSeconds: 90,
        },
      ],
    );

    setShowExercisePicker(false);
    setSearch("");
  }

  function removeExercise(
    exerciseId: string,
  ) {
    setRoutineExercises(
      (current) =>
        current.filter(
          (item) =>
            item.exercise.id !==
            exerciseId,
        ),
    );
  }

  function updateExercise(
    exerciseId: string,
    changes: Partial<
      Omit<RoutineExercise, "exercise">
    >,
  ) {
    setRoutineExercises(
      (current) =>
        current.map(
          (item) =>
            item.exercise.id ===
              exerciseId
              ? {
                ...item,
                ...changes,
              }
              : item,
        ),
    );
  }

  async function saveRoutine() {
    const trimmedName =
      name.trim();

    if (!trimmedName) {
      setError(
        "Please enter a routine name.",
      );
      return;
    }

    if (
      routineExercises.length ===
      0
    ) {
      setError(
        "Add at least one exercise to your routine.",
      );
      return;
    }

    setError(null);
    setIsSaving(true);

    const routine: Routine = {
      id:
        editingRoutine?.id ??
        editRoutineId ??
        `custom-${crypto.randomUUID()}`,

      name: trimmedName,

      exercises: routineExercises,
    };

    try {
      const savedRoutine =
        isEditing
          ? await routinesApi.update(
            routine,
          )
          : await routinesApi.create(
            routine,
          );

      if (isEditing) {
        updateRoutine(
          savedRoutine,
        );
      } else {
        addRoutine(
          savedRoutine,
        );
      }

      navigate("/workouts", {
        replace: true,
      });
    } catch (requestError) {
      console.error(
        "Failed to save routine:",
        requestError,
      );

      setError(
        requestError instanceof Error
          ? requestError.message
          : "Could not save the routine. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoadingRoutine) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-5xl items-center justify-center">
        <p className="text-sm font-medium text-[var(--text-muted)]">
          Loading routine...
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl space-y-8">
      {/* Back */}

      <button
        type="button"
        onClick={() =>
          navigate("/workouts")
        }
        className="flex items-center gap-2 text-sm font-semibold text-[var(--text-muted)] transition hover:text-[var(--primary)]"
      >
        <ArrowLeft size={17} />
        Back to workouts
      </button>

      {/* Header */}

      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--primary)]">
          Routine Builder
        </p>

        <h1 className="mt-3 text-4xl font-black tracking-tight text-[var(--text)]">
          {isEditing
            ? "Edit your routine"
            : "Create your routine"}
        </h1>

        <p className="mt-3 text-lg text-[var(--text-muted)]">
          {isEditing
            ? "Fine-tune your exercises, sets, reps, and rest."
            : "Build a workout around your own training goals."}
        </p>
      </section>

      {/* Error */}

      {error && (
        <div
          role="alert"
          className="rounded-2xl border border-[var(--danger)]/30 bg-[var(--danger)]/10 px-5 py-4 text-sm font-medium text-[var(--danger)]"
        >
          {error}
        </div>
      )}

      {/* Routine name */}

      <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm md:p-8">
        <label
          htmlFor="routine-name"
          className="text-sm font-bold text-[var(--text)]"
        >
          Routine name
        </label>

        <input
          id="routine-name"
          type="text"
          value={name}
          onChange={(event) =>
            setName(
              event.target.value,
            )
          }
          placeholder="e.g. Monday Push"
          maxLength={80}
          className="mt-3 w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface-soft)] px-4 py-3 text-[var(--text)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-soft)]"
        />
      </section>

      {/* Exercises */}

      <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm md:p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-[var(--text)]">
              Exercises
            </h2>

            <p className="mt-1 text-sm text-[var(--text-muted)]">
              {routineExercises.length}{" "}
              exercises
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setShowExercisePicker(
                (current) => !current,
              )
            }
            className="flex items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--primary-hover)]"
          >
            <Plus size={17} />
            Add Exercise
          </button>
        </div>

        {/* Exercise picker */}

        {showExercisePicker && (
          <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-5">
            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value,
                )
              }
              placeholder="Search exercises..."
              className="w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-soft)]"
            />

            <div className="mt-4 max-h-72 space-y-2 overflow-y-auto">
              {availableExercises.length ===
                0 ? (
                <p className="py-6 text-center text-sm text-[var(--text-muted)]">
                  No exercises match your search.
                </p>
              ) : (
                availableExercises.map(
                  (exercise) => {
                    const alreadyAdded =
                      routineExercises.some(
                        (item) =>
                          item.exercise.id ===
                          exercise.id,
                      );

                    return (
                      <button
                        key={exercise.id}
                        type="button"
                        disabled={
                          alreadyAdded
                        }
                        onClick={() =>
                          addExercise(
                            exercise.id,
                          )
                        }
                        className="flex w-full items-center justify-between rounded-xl border border-transparent bg-[var(--surface)] px-4 py-3 text-left transition hover:border-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <div className="flex items-center gap-3">
                          <Dumbbell
                            size={18}
                            className="text-[var(--primary)]"
                          />

                          <div>
                            <p className="font-semibold text-[var(--text)]">
                              {
                                exercise.name
                              }
                            </p>

                            <p className="text-xs text-[var(--text-muted)]">
                              {
                                exercise.muscleGroup
                              }{" "}
                              ·{" "}
                              {
                                exercise.equipment
                              }
                            </p>
                          </div>
                        </div>

                        {alreadyAdded && (
                          <Check
                            size={18}
                            className="text-[var(--primary)]"
                          />
                        )}
                      </button>
                    );
                  },
                )
              )}
            </div>
          </div>
        )}

        {/* Selected exercises */}

        {routineExercises.length >
          0 ? (
          <div className="mt-6 space-y-4">
            {routineExercises.map(
              (
                routineExercise,
                index,
              ) => (
                <div
                  key={
                    routineExercise
                      .exercise.id
                  }
                  className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-sm font-black text-[var(--primary)]">
                        {index + 1}
                      </div>

                      <div>
                        <h3 className="font-bold text-[var(--text)]">
                          {
                            routineExercise
                              .exercise
                              .name
                          }
                        </h3>

                        <p className="mt-1 text-xs text-[var(--text-muted)]">
                          {
                            routineExercise
                              .exercise
                              .muscleGroup
                          }{" "}
                          ·{" "}
                          {
                            routineExercise
                              .exercise
                              .equipment
                          }
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        removeExercise(
                          routineExercise
                            .exercise
                            .id,
                        )
                      }
                      className="rounded-lg p-2 text-[var(--text-muted)] transition hover:bg-[var(--danger)]/10 hover:text-[var(--danger)]"
                      aria-label={`Remove ${routineExercise.exercise.name}`}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>

                  <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr_2fr]">
                    <label className="text-sm">
                      <span className="mb-2 block font-semibold text-[var(--text-muted)]">
                        Sets
                      </span>

                      <input
                        type="number"
                        min={1}
                        max={100}
                        step={1}
                        value={
                          routineExercise.targetSets
                        }
                        onChange={(
                          event,
                        ) => {
                          const value =
                            Number(
                              event
                                .target
                                .value,
                            );

                          updateExercise(
                            routineExercise
                              .exercise
                              .id,
                            {
                              targetSets:
                                Number.isFinite(
                                  value,
                                )
                                  ? Math.min(
                                    100,
                                    Math.max(
                                      1,
                                      Math.floor(
                                        value,
                                      ),
                                    ),
                                  )
                                  : 1,
                            },
                          );
                        }}
                        className="w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-2.5 text-[var(--text)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-soft)]"
                      />
                    </label>

                    <label className="text-sm">
                      <span className="mb-2 block font-semibold text-[var(--text-muted)]">
                        Target reps
                      </span>

                      <input
                        type="text"
                        value={
                          routineExercise.targetReps
                        }
                        onChange={(
                          event,
                        ) =>
                          updateExercise(
                            routineExercise
                              .exercise
                              .id,
                            {
                              targetReps:
                                event
                                  .target
                                  .value,
                            },
                          )
                        }
                        placeholder="8-12"
                        maxLength={20}
                        className="w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-2.5 text-[var(--text)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-soft)]"
                      />
                    </label>

                    <div className="text-sm">
                      <span className="mb-2 block font-semibold text-[var(--text-muted)]">
                        Rest between sets
                      </span>

                      <div className="grid grid-cols-3 gap-2">
                        {[30, 45, 60, 90, 120, 150].map(
                          (seconds) => {
                            const isSelected =
                              routineExercise.restSeconds ===
                              seconds;

                            return (
                              <button
                                key={seconds}
                                type="button"
                                onClick={() =>
                                  updateExercise(
                                    routineExercise
                                      .exercise
                                      .id,
                                    {
                                      restSeconds:
                                        seconds,
                                    },
                                  )
                                }
                                className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${isSelected
                                  ? "border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]"
                                  : "border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text-muted)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                                  }`}
                              >
                                {seconds}s
                              </button>
                            );
                          },
                        )}
                      </div>

                      <label className="mt-2 flex items-center gap-2">
                        <input
                          type="number"
                          min={0}
                          max={3600}
                          step={5}
                          value={
                            routineExercise.restSeconds
                          }
                          onChange={(
                            event,
                          ) => {
                            const value =
                              Number(
                                event
                                  .target
                                  .value,
                              );

                            updateExercise(
                              routineExercise
                                .exercise
                                .id,
                              {
                                restSeconds:
                                  Number.isFinite(
                                    value,
                                  )
                                    ? Math.min(
                                      3600,
                                      Math.max(
                                        0,
                                        Math.floor(
                                          value,
                                        ),
                                      ),
                                    )
                                    : 0,
                              },
                            );
                          }}
                          className="w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-2.5 text-[var(--text)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-soft)]"
                        />

                        <span className="shrink-0 text-sm text-[var(--text-muted)]">
                          seconds
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-[var(--border-strong)] p-10 text-center">
            <Dumbbell
              size={28}
              className="mx-auto text-[var(--text-muted)]"
            />

            <p className="mt-4 font-semibold text-[var(--text)]">
              No exercises yet
            </p>

            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Add exercises to start building your
              routine.
            </p>
          </div>
        )}
      </section>

      {/* Save */}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() =>
            void saveRoutine()
          }
          disabled={
            isSaving ||
            !name.trim() ||
            routineExercises.length ===
            0
          }
          className="rounded-xl bg-[var(--primary)] px-7 py-3.5 font-semibold text-white transition hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isSaving
            ? "Saving..."
            : isEditing
              ? "Save Changes"
              : "Save Routine"}
        </button>
      </div>
    </main>
  );
}