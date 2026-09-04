import {
  ArrowLeft,
  Check,
  Dumbbell,
  ExternalLink,
  Play,
  Plus,
} from "lucide-react";
import {
  NavLink,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useState } from "react";

import { routinesApi } from "../api/routines";
import { exercises } from "../data/exercises";
import { useRoutineStore } from "../stores/routineStore";

import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Modal from "../components/ui/Modal";

export default function ExerciseDetails() {
  const { exerciseId } =
    useParams<{
      exerciseId: string;
    }>();

  const navigate = useNavigate();

  const [showRoutinePicker, setShowRoutinePicker] =
    useState(false);

  const [
    addedRoutineIds,
    setAddedRoutineIds,
  ] = useState<Set<string>>(
    () => new Set(),
  );

  const [
    addingRoutineId,
    setAddingRoutineId,
  ] = useState<string | null>(
    null,
  );

  const [
    addError,
    setAddError,
  ] = useState<string | null>(
    null,
  );

  const customRoutines =
    useRoutineStore(
      (state) => state.customRoutines,
    );

  const updateRoutine =
    useRoutineStore(
      (state) => state.updateRoutine,
    );

  const exercise = exercises.find(
    (item) => item.id === exerciseId,
  );

  /*
   * Keep a narrowed, non-optional reference.
   * This is important because nested callbacks don't
   * inherit TypeScript's control-flow narrowing of
   * the outer variable.
   */
  if (!exercise) {
    return (
      <main className="mx-auto max-w-4xl py-10">
        <Card className="p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--surface-soft)] text-[var(--text-muted)]">
            <Dumbbell size={26} />
          </div>

          <h1 className="mt-5 text-2xl font-black text-[var(--text)]">
            Exercise not found
          </h1>

          <p className="mt-2 text-[var(--text-muted)]">
            This exercise doesn't exist in the
            current exercise library.
          </p>

          <Button
            variant="secondary"
            onClick={() =>
              navigate("/exercises")
            }
            className="mt-6"
          >
            <ArrowLeft size={17} />
            Back to Exercises
          </Button>
        </Card>
      </main>
    );
  }

  const selectedExercise =
    exercise;

  async function handleAddToRoutine(
    routineId: string,
  ) {
    const routine =
      customRoutines.find(
        (item) =>
          item.id === routineId,
      );

    if (!routine) {
      return;
    }

    const alreadyExists =
      routine.exercises.some(
        (routineExercise) =>
          routineExercise.exercise.id ===
          selectedExercise.id,
      );

    if (alreadyExists) {
      return;
    }

    try {
      setAddingRoutineId(
        routineId,
      );
      setAddError(null);

      const updatedRoutine = {
        ...routine,
        exercises: [
          ...routine.exercises,
          {
            exercise: selectedExercise,
            targetSets: 3,
            targetReps: "8-12",
            restSeconds: 90,
          },
        ],
      };

      const savedRoutine =
        await routinesApi.update(
          updatedRoutine,
        );

      updateRoutine(
        savedRoutine,
      );

      setAddedRoutineIds(
        (current) => {
          const next =
            new Set(current);

          next.add(routineId);

          return next;
        },
      );
    } catch (error) {
      console.error(
        "Failed to add exercise to routine:",
        error,
      );

      setAddError(
        error instanceof Error
          ? error.message
          : "Could not add the exercise. Please try again.",
      );
    } finally {
      setAddingRoutineId(null);
    }
  }

  function closeRoutinePicker() {
    setShowRoutinePicker(false);
    setAddError(null);
    setAddedRoutineIds(
      new Set(),
    );
  }

  return (
    <main className="space-y-8">
      {/* Back */}
      <NavLink
        to="/exercises"
        className="
          inline-flex
          items-center
          gap-2
          text-sm
          font-semibold
          text-[var(--text-muted)]
          transition-colors
          hover:text-[var(--primary)]
        "
      >
        <ArrowLeft size={17} />
        Exercise Library
      </NavLink>

      {/* Hero */}
      <section className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        {/* Media */}
        <Card className="overflow-hidden p-0">
          <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden bg-[var(--surface-soft)] md:min-h-[460px]">
            {selectedExercise.imageUrl ? (
              <img
                src={selectedExercise.imageUrl}
                alt={
                  selectedExercise.name
                }
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center px-8 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[var(--primary-soft)] text-[var(--primary)]">
                  <Dumbbell size={36} />
                </div>

                <p className="mt-5 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                  Exercise Media
                </p>

                <p className="mt-2 max-w-sm text-sm leading-relaxed text-[var(--text-muted)]">
                  Exercise imagery or video
                  can be added here when
                  media is available.
                </p>
              </div>
            )}

            {selectedExercise.videoUrl && (
              <a
                href={
                  selectedExercise.videoUrl
                }
                target="_blank"
                rel="noreferrer"
                className="
                  absolute
                  bottom-5
                  right-5
                  inline-flex
                  items-center
                  gap-2
                  rounded-[var(--radius-md)]
                  bg-[var(--text)]
                  px-4
                  py-3
                  text-sm
                  font-semibold
                  text-[var(--background)]
                  shadow-[var(--shadow-md)]
                  transition-opacity
                  hover:opacity-90
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[var(--primary)]
                "
              >
                <Play size={16} />
                Watch video
                <ExternalLink size={14} />
              </a>
            )}
          </div>
        </Card>

        {/* Overview */}
        <Card className="flex flex-col p-7 md:p-9">
          <div className="flex flex-wrap gap-2">
            <Badge variant="primary">
              {selectedExercise.category}
            </Badge>

            <Badge>
              {
                selectedExercise.muscleGroup
              }
            </Badge>

            <Badge>
              {
                selectedExercise.equipment
              }
            </Badge>
          </div>

          <h1 className="mt-6 text-4xl font-black tracking-tight text-[var(--text)] md:text-5xl">
            {selectedExercise.name}
          </h1>

          <p className="mt-4 leading-relaxed text-[var(--text-muted)]">
            A structured{" "}
            {selectedExercise.category.toLowerCase()}{" "}
            exercise targeting the{" "}
            {selectedExercise.muscleGroup.toLowerCase()}.
          </p>

          <div className="mt-8 space-y-6">
            <MuscleSection
              title="Primary Muscles"
              muscles={
                selectedExercise.primaryMuscles
              }
              primary
            />

            {selectedExercise
              .secondaryMuscles.length >
              0 && (
              <MuscleSection
                title="Secondary Muscles"
                muscles={
                  selectedExercise.secondaryMuscles
                }
              />
            )}
          </div>

          <div className="mt-auto pt-8">
            <Button
              className="w-full"
              onClick={() => {
                setAddError(null);
                setAddedRoutineIds(
                  new Set(),
                );
                setShowRoutinePicker(
                  true,
                );
              }}
            >
              <Plus size={18} />
              Add to Routine
            </Button>
          </div>
        </Card>
      </section>

      {/* Instructions */}
      <section>
        <div className="mb-5">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--primary)]">
            Technique
          </p>

          <h2 className="mt-2 text-3xl font-black text-[var(--text)]">
            How to perform it
          </h2>
        </div>

        <Card className="p-7 md:p-9">
          {selectedExercise.instructions
            .length > 0 ? (
            <ol className="space-y-6">
              {selectedExercise.instructions.map(
                (
                  instruction,
                  index,
                ) => (
                  <li
                    key={`${selectedExercise.id}-instruction-${index}`}
                    className="flex gap-5"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-sm font-black text-[var(--primary)]">
                      {index + 1}
                    </div>

                    <p className="pt-1 leading-relaxed text-[var(--text)]">
                      {instruction}
                    </p>
                  </li>
                ),
              )}
            </ol>
          ) : (
            <p className="text-[var(--text-muted)]">
              No instructions have been
              added for this exercise yet.
            </p>
          )}
        </Card>
      </section>

      {/* Training information */}
      <section className="grid gap-5 md:grid-cols-3">
        <InfoCard
          label="Muscle Group"
          value={
            selectedExercise.muscleGroup
          }
        />

        <InfoCard
          label="Equipment"
          value={
            selectedExercise.equipment
          }
        />

        <InfoCard
          label="Category"
          value={
            selectedExercise.category
          }
        />
      </section>

      {/* Routine picker */}
      <Modal
        open={showRoutinePicker}
        onClose={closeRoutinePicker}
        title="Choose a routine"
        description={`Add ${selectedExercise.name} to one of your custom routines.`}
        size="md"
      >
        {addError && (
          <div
            role="alert"
            className="
              mb-5
              rounded-[var(--radius-md)]
              border
              border-[var(--danger)]/30
              bg-[var(--danger-soft)]
              p-4
              text-sm
              font-medium
              text-[var(--danger)]
            "
          >
            {addError}
          </div>
        )}

        {customRoutines.length > 0 ? (
          <div className="space-y-3">
            {customRoutines.map(
              (routine) => {
                const alreadyExists =
                  routine.exercises.some(
                    (
                      routineExercise,
                    ) =>
                      routineExercise
                        .exercise.id ===
                      selectedExercise.id,
                  );

                const wasAdded =
                  addedRoutineIds.has(
                    routine.id,
                  );

                const isAdding =
                  addingRoutineId ===
                  routine.id;

                return (
                  <button
                    key={routine.id}
                    type="button"
                    disabled={
                      alreadyExists ||
                      wasAdded ||
                      isAdding
                    }
                    onClick={() =>
                      void handleAddToRoutine(
                        routine.id,
                      )
                    }
                    className="
                      flex
                      w-full
                      items-center
                      justify-between
                      gap-4
                      rounded-[var(--radius-lg)]
                      border
                      border-[var(--border)]
                      bg-[var(--surface-soft)]
                      p-4
                      text-left
                      transition-[background-color,border-color,opacity]
                      duration-150
                      hover:border-[var(--primary)]
                      hover:bg-[var(--surface-hover)]
                      disabled:cursor-not-allowed
                      disabled:opacity-65
                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-[var(--primary)]
                    "
                  >
                    <div className="min-w-0">
                      <p className="truncate font-bold text-[var(--text)]">
                        {routine.name}
                      </p>

                      <p className="mt-1 text-sm text-[var(--text-muted)]">
                        {routine.exercises.length}{" "}
                        {routine.exercises.length ===
                        1
                          ? "exercise"
                          : "exercises"}
                      </p>
                    </div>

                    {wasAdded ? (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--success)] text-white">
                        <Check
                          size={18}
                        />
                      </div>
                    ) : alreadyExists ? (
                      <span className="shrink-0 text-xs font-semibold text-[var(--text-muted)]">
                        Already added
                      </span>
                    ) : isAdding ? (
                      <span className="shrink-0 text-xs font-semibold text-[var(--primary)]">
                        Adding...
                      </span>
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">
                        <Plus size={19} />
                      </div>
                    )}
                  </button>
                );
              },
            )}
          </div>
        ) : (
          <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--border-strong)] p-8 text-center">
            <Dumbbell
              size={26}
              className="mx-auto text-[var(--text-muted)]"
            />

            <h3 className="mt-4 font-bold text-[var(--text)]">
              No custom routines yet
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
              Create a routine first, then
              you can add exercises to it.
            </p>

            <Button
              onClick={() => {
                closeRoutinePicker();
                navigate(
                  "/workouts/create",
                );
              }}
              className="mt-5"
            >
              <Plus size={17} />
              Create Routine
            </Button>
          </div>
        )}

        {customRoutines.length > 0 && (
          <div className="mt-6 flex justify-end border-t border-[var(--border)] pt-5">
            <Button
              variant="secondary"
              onClick={
                closeRoutinePicker
              }
            >
              Done
            </Button>
          </div>
        )}
      </Modal>
    </main>
  );
}

type MuscleSectionProps = {
  title: string;
  muscles: string[];
  primary?: boolean;
};

function MuscleSection({
  title,
  muscles,
  primary = false,
}: MuscleSectionProps) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-muted)]">
        {title}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {muscles.map((muscle) => (
          <span
            key={muscle}
            className={`
              rounded-xl
              px-3
              py-2
              text-sm
              font-semibold
              ${
                primary
                  ? "bg-[var(--primary-soft)] text-[var(--primary)]"
                  : "bg-[var(--surface-soft)] text-[var(--text-muted)]"
              }
            `}
          >
            {muscle}
          </span>
        ))}
      </div>
    </div>
  );
}

type InfoCardProps = {
  label: string;
  value: string;
};

function InfoCard({
  label,
  value,
}: InfoCardProps) {
  return (
    <Card className="p-6">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-muted)]">
        {label}
      </p>

      <p className="mt-3 text-lg font-bold text-[var(--text)]">
        {value}
      </p>
    </Card>
  );
}