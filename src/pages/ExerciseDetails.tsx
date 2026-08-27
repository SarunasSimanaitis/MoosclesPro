import {
  ArrowLeft,
  Check,
  Dumbbell,
  ExternalLink,
  Play,
  Plus,
  X,
} from "lucide-react";
import {
  NavLink,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useState } from "react";

import { exercises } from "../data/exercises";
import { useRoutineStore } from "../stores/routineStore";

import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

export default function ExerciseDetails() {
  const { exerciseId } = useParams();
  const navigate = useNavigate();

  const [showRoutinePicker, setShowRoutinePicker] =
    useState(false);

  const [addedRoutineId, setAddedRoutineId] =
    useState<string | null>(null);

  const customRoutines = useRoutineStore(
    (state) => state.customRoutines,
  );

  const addExerciseToRoutine = useRoutineStore(
    (state) => state.addExerciseToRoutine,
  );

  const exercise = exercises.find(
    (item) => item.id === exerciseId,
  );

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
            This exercise doesn't exist in the current exercise library.
          </p>

          <Button
            variant="secondary"
            onClick={() => navigate("/exercises")}
            className="mt-6"
          >
            <ArrowLeft size={17} />
            Back to Exercises
          </Button>
        </Card>
      </main>
    );
  }

const selectedExercise = exercise;

function handleAddToRoutine(routineId: string) {
  addExerciseToRoutine(routineId, {
    exercise: selectedExercise,
    targetSets: 3,
    targetReps: "8-12",
    restSeconds: 90,
  });

  setAddedRoutineId(routineId);

  setTimeout(() => {
    setShowRoutinePicker(false);
    setAddedRoutineId(null);
  }, 700);
}

  return (
    <main className="space-y-8">
      {/* Back */}
      <NavLink
        to="/exercises"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--text-muted)] transition hover:text-[var(--primary)]"
      >
        <ArrowLeft size={17} />
        Exercise Library
      </NavLink>

      {/* Hero */}
      <section className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        {/* Media */}
        <Card className="overflow-hidden p-0">
          <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden bg-[var(--surface-soft)] md:min-h-[460px]">
            {exercise.imageUrl ? (
              <img
                src={exercise.imageUrl}
                alt={exercise.name}
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
                  Exercise imagery or video can be added here when media is
                  available.
                </p>
              </div>
            )}

            {exercise.videoUrl && (
              <a
                href={exercise.videoUrl}
                target="_blank"
                rel="noreferrer"
                className="absolute bottom-5 right-5 inline-flex items-center gap-2 rounded-xl bg-[var(--text)] px-4 py-3 text-sm font-semibold text-[var(--surface)] shadow-lg transition hover:opacity-90"
              >
                <Play size={16} />
                Watch Video
                <ExternalLink size={14} />
              </a>
            )}
          </div>
        </Card>

        {/* Overview */}
        <Card className="flex flex-col p-7 md:p-9">
          <div className="flex flex-wrap gap-2">
            <Badge variant="primary">
              {exercise.category}
            </Badge>

            <Badge>
              {exercise.muscleGroup}
            </Badge>

            <Badge>
              {exercise.equipment}
            </Badge>
          </div>

          <h1 className="mt-6 text-4xl font-black tracking-tight text-[var(--text)] md:text-5xl">
            {exercise.name}
          </h1>

          <p className="mt-4 leading-relaxed text-[var(--text-muted)]">
            A structured {exercise.category.toLowerCase()} exercise
            targeting the {exercise.muscleGroup.toLowerCase()}.
          </p>

          <div className="mt-8 space-y-6">
            <MuscleSection
              title="Primary Muscles"
              muscles={exercise.primaryMuscles}
              primary
            />

            {exercise.secondaryMuscles.length > 0 && (
              <MuscleSection
                title="Secondary Muscles"
                muscles={exercise.secondaryMuscles}
              />
            )}
          </div>

          <div className="mt-auto pt-8">
            <Button
              className="w-full"
              onClick={() => setShowRoutinePicker(true)}
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
          {exercise.instructions.length > 0 ? (
            <ol className="space-y-6">
              {exercise.instructions.map(
                (instruction, index) => (
                  <li
                    key={`${exercise.id}-instruction-${index}`}
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
              No instructions have been added for this exercise yet.
            </p>
          )}
        </Card>
      </section>

      {/* Training Information */}
      <section className="grid gap-5 md:grid-cols-3">
        <InfoCard
          label="Muscle Group"
          value={exercise.muscleGroup}
        />

        <InfoCard
          label="Equipment"
          value={exercise.equipment}
        />

        <InfoCard
          label="Category"
          value={exercise.category}
        />
      </section>

      {/* Routine Picker */}
      {showRoutinePicker && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-5 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowRoutinePicker(false);
            }
          }}
        >
          <div className="w-full max-w-lg rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
                  Add Exercise
                </p>

                <h2 className="mt-2 text-2xl font-black text-[var(--text)]">
                  Choose a routine
                </h2>

                <p className="mt-2 text-sm text-[var(--text-muted)]">
                  Add {exercise.name} to one of your custom routines.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowRoutinePicker(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-[var(--text-muted)] transition hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {customRoutines.length > 0 ? (
              <div className="mt-6 space-y-3">
                {customRoutines.map((routine) => {
                  const alreadyExists =
                    routine.exercises.some(
                      (routineExercise) =>
                        routineExercise.exercise.id === exercise.id,
                    );

                  const wasAdded =
                    addedRoutineId === routine.id;

                  return (
                    <button
                      key={routine.id}
                      type="button"
                      disabled={alreadyExists || wasAdded}
                      onClick={() =>
                        handleAddToRoutine(routine.id)
                      }
                      className="flex w-full items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4 text-left transition hover:border-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <div>
                        <p className="font-bold text-[var(--text)]">
                          {routine.name}
                        </p>

                        <p className="mt-1 text-sm text-[var(--text-muted)]">
                          {routine.exercises.length} exercises
                        </p>
                      </div>

                      {wasAdded ? (
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--success)] text-white">
                          <Check size={18} />
                        </div>
                      ) : alreadyExists ? (
                        <span className="text-xs font-semibold text-[var(--text-muted)]">
                          Already added
                        </span>
                      ) : (
                        <Plus
                          size={19}
                          className="text-[var(--primary)]"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-[var(--border-strong)] p-8 text-center">
                <Dumbbell
                  size={26}
                  className="mx-auto text-[var(--text-muted)]"
                />

                <h3 className="mt-4 font-bold text-[var(--text)]">
                  No custom routines yet
                </h3>

                <p className="mt-2 text-sm text-[var(--text-muted)]">
                  Create a routine first, then you can add exercises to it.
                </p>

                <Button
                  onClick={() => navigate("/workouts/create")}
                  className="mt-5"
                >
                  <Plus size={17} />
                  Create Routine
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
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
            className={`rounded-xl px-3 py-2 text-sm font-semibold ${
              primary
                ? "bg-[var(--primary-soft)] text-[var(--primary)]"
                : "bg-[var(--surface-soft)] text-[var(--text-muted)]"
            }`}
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