import {
  ArrowLeft,
  CheckCircle2,
  Dumbbell,
  Plus,
  Save,
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

import { routinesApi } from "../api/routines";

import ExercisePicker from "../components/workout/ExercisePicker";
import RoutineExerciseEditor from "../components/workout/RoutineExerciseEditor";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";

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
      (state) => state.customRoutines,
    );

  const editingRoutine =
    editRoutineId
      ? customRoutines.find(
          (routine) =>
            routine.id ===
            editRoutineId,
        )
      : undefined;

  /*
   * Keying the editor by routine/mode gives each
   * editing context a fresh local state instance.
   *
   * This avoids synchronously resetting form state
   * inside an effect when the URL changes.
   */
  const editorKey =
    editRoutineId ?? "create";

  return (
    <RoutineEditor
      key={editorKey}
      routine={editingRoutine}
      editRoutineId={editRoutineId}
      onBack={() =>
        navigate("/workouts")
      }
    />
  );
}

type RoutineEditorProps = {
  routine?: Routine;
  editRoutineId: string | null;
  onBack: () => void;
};

function RoutineEditor({
  routine,
  editRoutineId,
  onBack,
}: RoutineEditorProps) {
  const navigate = useNavigate();

  const setCustomRoutines =
    useRoutineStore(
      (state) =>
        state.setCustomRoutines,
    );

  const addRoutine =
    useRoutineStore(
      (state) => state.addRoutine,
    );

  const updateRoutine =
    useRoutineStore(
      (state) =>
        state.updateRoutine,
    );

  const [
    name,
    setName,
  ] = useState(
    routine?.name ?? "",
  );

  const [
    routineExercises,
    setRoutineExercises,
  ] = useState<RoutineExercise[]>(
    () =>
      routine?.exercises ?? [],
  );

  const [
    showExercisePicker,
    setShowExercisePicker,
  ] = useState(false);

  const [
    isLoadingRoutine,
    setIsLoadingRoutine,
  ] = useState(
    Boolean(
      editRoutineId &&
        !routine,
    ),
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
   * If an edit page was refreshed before the
   * routine store had been populated, fetch the
   * server source of truth.
   *
   * State updates happen after the asynchronous
   * request, never as synchronous effect resets.
   */
  useEffect(() => {
    if (
      !editRoutineId ||
      routine
    ) {
      return;
    }

    let cancelled = false;

    async function loadRoutine() {
      try {
        setIsLoadingRoutine(true);
        setError(null);

        const data =
          await routinesApi.list();

        if (cancelled) {
          return;
        }

        setCustomRoutines(data);

        const foundRoutine =
          data.find(
            (item) =>
              item.id ===
              editRoutineId,
          );

        if (!foundRoutine) {
          setError(
            "The routine you're trying to edit could not be found.",
          );
          return;
        }

        /*
         * These updates happen after await, so this
         * is an asynchronous server synchronization
         * rather than a synchronous effect reset.
         */
        setName(
          foundRoutine.name,
        );

        setRoutineExercises(
          foundRoutine.exercises,
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

    void loadRoutine();

    return () => {
      cancelled = true;
    };
  }, [
    editRoutineId,
    routine,
    setCustomRoutines,
  ]);

  const selectedExerciseIds =
    useMemo(
      () =>
        new Set(
          routineExercises.map(
            (item) =>
              item.exercise.id,
          ),
        ),
      [routineExercises],
    );

  const totalExercises =
    routineExercises.length;

  const estimatedMinutes =
    Math.max(
      20,
      totalExercises * 10,
    );

  function addExercise(
    exerciseId: string,
  ) {
    const exercise =
      exercises.find(
        (item) =>
          item.id === exerciseId,
      );

    if (!exercise) {
      return;
    }

    if (
      selectedExerciseIds.has(
        exercise.id,
      )
    ) {
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

  function moveExercise(
    index: number,
    direction: -1 | 1,
  ) {
    setRoutineExercises(
      (current) => {
        const nextIndex =
          index + direction;

        if (
          nextIndex < 0 ||
          nextIndex >=
            current.length
        ) {
          return current;
        }

        const next = [
          ...current,
        ];

        const [
          movedExercise,
        ] = next.splice(
          index,
          1,
        );

        next.splice(
          nextIndex,
          0,
          movedExercise,
        );

        return next;
      },
    );
  }

  function handleAddExercise(
    exercise: RoutineExercise["exercise"],
  ) {
    addExercise(exercise.id);
  }

  async function saveRoutine() {
    const trimmedName =
      name.trim();

    if (!trimmedName) {
      setError(
        "Give your routine a name before saving it.",
      );
      return;
    }

    if (
      routineExercises.length ===
      0
    ) {
      setError(
        "Add at least one exercise before saving your routine.",
      );
      return;
    }

    setError(null);
    setIsSaving(true);

    const nextRoutine: Routine = {
      id:
        routine?.id ??
        editRoutineId ??
        `custom-${crypto.randomUUID()}`,

      name: trimmedName,

      exercises:
        routineExercises,
    };

    try {
      const savedRoutine =
        isEditing
          ? await routinesApi.update(
              nextRoutine,
            )
          : await routinesApi.create(
              nextRoutine,
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

  function handleBack() {
    const hasChanges =
      name.trim() !==
        (routine?.name ?? "") ||
      JSON.stringify(
        routineExercises,
      ) !==
        JSON.stringify(
          routine?.exercises ?? [],
        );

    if (!hasChanges) {
      onBack();
      return;
    }

    const confirmed =
      window.confirm(
        "You have unsaved changes. Leave without saving?",
      );

    if (confirmed) {
      onBack();
    }
  }

  if (isLoadingRoutine) {
    return (
      <main
        role="status"
        aria-label="Loading routine"
        className="mx-auto max-w-5xl"
      >
        <span className="sr-only">
          Loading routine
        </span>

        <div className="space-y-6">
          <div className="h-5 w-36 animate-pulse rounded bg-[var(--surface-soft)]" />

          <div className="space-y-4">
            <div className="h-10 w-80 animate-pulse rounded-xl bg-[var(--surface-soft)]" />

            <div className="h-6 w-full max-w-2xl animate-pulse rounded-lg bg-[var(--surface-soft)]" />
          </div>

          <div className="h-32 animate-pulse rounded-[var(--radius-xl)] bg-[var(--surface-soft)]" />

          <div className="h-96 animate-pulse rounded-[var(--radius-xl)] bg-[var(--surface-soft)]" />
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl space-y-8 pb-10">
      {/* Back */}
      <button
        type="button"
        onClick={handleBack}
        className="
          inline-flex
          items-center
          gap-2
          text-sm
          font-semibold
          text-[var(--text-muted)]
          transition-colors
          hover:text-[var(--primary)]
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-[var(--primary)]
        "
      >
        <ArrowLeft size={17} />
        Back to workouts
      </button>

      {/* Header */}
      <section>
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-[var(--primary)]">
          Routine Builder
        </p>

        <div className="mt-3 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-[var(--text)] md:text-5xl">
              {isEditing
                ? "Edit your routine"
                : "Create your routine"}
            </h1>

            <p className="mt-3 max-w-2xl text-lg leading-relaxed text-[var(--text-muted)]">
              {isEditing
                ? "Fine-tune the workout, then save your changes."
                : "Build a workout around your own goals, equipment, and training style."}
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-[var(--primary-soft)] px-4 py-2 text-sm font-semibold text-[var(--primary)]">
            <Dumbbell size={16} />
            {totalExercises}{" "}
            {totalExercises === 1
              ? "exercise"
              : "exercises"}
          </div>
        </div>
      </section>

      {/* Error */}
      {error && (
        <Card
          role="alert"
          className="border-[var(--danger)]/30 bg-[var(--danger-soft)] p-5 shadow-none"
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--danger)]/10 text-[var(--danger)]">
              !
            </div>

            <p className="text-sm font-semibold leading-relaxed text-[var(--danger)]">
              {error}
            </p>
          </div>
        </Card>
      )}

      {/* Routine details */}
      <Card className="p-6 md:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">
            <Dumbbell size={19} />
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--primary)]">
              Basics
            </p>

            <h2 className="mt-1 text-xl font-black text-[var(--text)]">
              Routine details
            </h2>
          </div>
        </div>

        <Input
          id="routine-name"
          label="Routine name"
          value={name}
          onChange={(event) =>
            setName(
              event.target.value,
            )
          }
          placeholder="e.g. Monday Push"
          maxLength={80}
          hint="Use a name you'll recognize quickly when you're ready to train."
          className="mt-6 bg-[var(--surface-soft)]"
        />
      </Card>

      {/* Exercises */}
      <Card className="p-6 md:p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--primary)]">
              Workout structure
            </p>

            <h2 className="mt-1 text-2xl font-black tracking-tight text-[var(--text)]">
              Exercises
            </h2>

            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Set the order, rep target, and rest
              period for every exercise.
            </p>
          </div>

          <Button
            variant={
              showExercisePicker
                ? "secondary"
                : "primary"
            }
            onClick={() =>
              setShowExercisePicker(
                (current) =>
                  !current,
              )
            }
          >
            <Plus size={18} />

            {showExercisePicker
              ? "Hide library"
              : "Add exercise"}
          </Button>
        </div>

        {showExercisePicker && (
          <ExercisePicker
            exercises={exercises}
            selectedExerciseIds={
              selectedExerciseIds
            }
            onSelect={
              handleAddExercise
            }
            onClose={() =>
              setShowExercisePicker(
                false,
              )
            }
          />
        )}

        {routineExercises.length >
        0 ? (
          <div className="mt-6 space-y-4">
            {routineExercises.map(
              (
                routineExercise,
                index,
              ) => (
                <RoutineExerciseEditor
                  key={
                    routineExercise
                      .exercise.id
                  }
                  routineExercise={
                    routineExercise
                  }
                  index={index}
                  totalExercises={
                    routineExercises.length
                  }
                  onChange={(
                    changes,
                  ) =>
                    updateExercise(
                      routineExercise
                        .exercise.id,
                      changes,
                    )
                  }
                  onRemove={() =>
                    removeExercise(
                      routineExercise
                        .exercise.id,
                    )
                  }
                  onMoveUp={() =>
                    moveExercise(
                      index,
                      -1,
                    )
                  }
                  onMoveDown={() =>
                    moveExercise(
                      index,
                      1,
                    )
                  }
                />
              ),
            )}
          </div>
        ) : (
          <div className="mt-6 rounded-[var(--radius-lg)] border border-dashed border-[var(--border-strong)] px-6 py-14 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]">
              <Dumbbell size={28} />
            </div>

            <h3 className="mt-5 text-xl font-black text-[var(--text)]">
              Your routine is empty
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[var(--text-muted)]">
              Add your first exercise to start
              building the workout.
            </p>

            <Button
              variant="secondary"
              onClick={() =>
                setShowExercisePicker(
                  true,
                )
              }
              className="mt-6"
            >
              <Plus size={17} />
              Add your first exercise
            </Button>
          </div>
        )}
      </Card>

      {/* Summary */}
      <section className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={
            <Dumbbell size={18} />
          }
          label="Exercises"
          value={totalExercises.toString()}
        />

        <SummaryCard
          icon={
            <CheckCircle2 size={18} />
          }
          label="Planned sets"
          value={routineExercises
            .reduce(
              (
                total,
                item,
              ) =>
                total +
                item.targetSets,
              0,
            )
            .toString()}
        />

        <SummaryCard
          icon={
            <Save size={18} />
          }
          label="Estimated session"
          value={`~${estimatedMinutes} min`}
        />
      </section>

      {/* Save bar */}
      <div className="sticky bottom-4 z-20">
        <Card className="flex flex-col gap-4 border-[var(--border-strong)] bg-[var(--surface)]/95 p-4 shadow-[var(--shadow-lg)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex items-center gap-3">
            <div className="hidden h-9 w-9 items-center justify-center rounded-xl bg-[var(--success-soft)] text-[var(--success)] sm:flex">
              <CheckCircle2 size={18} />
            </div>

            <div>
              <p className="text-sm font-bold text-[var(--text)]">
                {isEditing
                  ? "Ready to save your changes?"
                  : "Happy with your routine?"}
              </p>

              <p className="text-xs text-[var(--text-muted)]">
                {totalExercises}{" "}
                {totalExercises === 1
                  ? "exercise"
                  : "exercises"}{" "}
                · ~{estimatedMinutes} min
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={isSaving}
              className="flex-1 sm:flex-none"
            >
              Cancel
            </Button>

            <Button
              loading={isSaving}
              disabled={
                !name.trim() ||
                totalExercises === 0
              }
              onClick={() =>
                void saveRoutine()
              }
              className="flex-1 sm:flex-none"
            >
              <Save size={17} />
              {isEditing
                ? "Save changes"
                : "Save routine"}
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
}

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 text-[var(--primary)]">
        {icon}

        <span className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]">
          {label}
        </span>
      </div>

      <p className="mt-3 text-2xl font-black tracking-tight text-[var(--text)]">
        {value}
      </p>
    </Card>
  );
}