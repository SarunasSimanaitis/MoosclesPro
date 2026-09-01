import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Copy,
  Dumbbell,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { routinesApi } from "../api/routines";
import { programs } from "../data/programs";
import { useRoutineStore } from "../stores/routineStore";

import type { Program } from "../types/Program";
import type { Routine } from "../types/Routine";

type ProgramCardProps = {
  program: Program;
  onView: (programId: string) => void;
};

function ProgramCard({
  program,
  onView,
}: ProgramCardProps) {
  return (
    <article
      className="
        group
        flex
        flex-col
        overflow-hidden
        rounded-[2rem]
        border
        border-[var(--border)]
        bg-[var(--surface)]
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-[var(--border-strong)]
        hover:shadow-[var(--shadow-md)]
      "
    >
      <div className="relative overflow-hidden bg-[#2f261d] p-7 md:p-8">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[var(--primary)]/15 blur-2xl" />

        <div className="relative">
          <div className="flex items-start justify-between gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary)]/15 text-[var(--primary)]">
              <Dumbbell size={23} />
            </div>

            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-[#fffaf0]/70">
              FREE
            </span>
          </div>

          <h2 className="mt-7 text-2xl font-black tracking-tight text-[#fffaf0]">
            {program.name}
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-[#fffaf0]/65">
            {program.description}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-7 md:p-8">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-[var(--surface-soft)] px-4 py-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-muted)]">
              <CalendarDays size={14} />
              Schedule
            </div>

            <p className="mt-1 font-bold text-[var(--text)]">
              {program.daysPerWeek} days/week
            </p>
          </div>

          <div className="rounded-xl bg-[var(--surface-soft)] px-4 py-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-muted)]">
              <Clock3 size={14} />
              Sessions
            </div>

            <p className="mt-1 font-bold text-[var(--text)]">
              ~{program.sessionMinutes} min
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-[var(--primary-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--primary)]">
            {program.goal}
          </span>

          <span className="rounded-full bg-[var(--surface-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--text-muted)]">
            {program.environment}
          </span>

          <span className="rounded-full bg-[var(--surface-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--text-muted)]">
            {program.difficulty}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onView(program.id)}
          className="
            mt-7
            flex
            w-full
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
          View program
          <ArrowRight size={17} />
        </button>
      </div>
    </article>
  );
}

type RoutineCardProps = {
  routine: Routine;
  onStart: (routineId: string) => void;
  onEdit: (routineId: string) => void;
  onDuplicate: (routineId: string) => void;
  onDelete: (routineId: string, name: string) => void;
  menuOpen: boolean;
  onToggleMenu: () => void;
  isDeleting: boolean;
  isDuplicating: boolean;
};

function RoutineCard({
  routine,
  onStart,
  onEdit,
  onDuplicate,
  onDelete,
  menuOpen,
  onToggleMenu,
  isDeleting,
  isDuplicating,
}: RoutineCardProps) {
  const isBusy = isDeleting || isDuplicating;

  const estimatedMinutes = Math.max(
    20,
    routine.exercises.length * 10,
  );

  return (
    <article
      className="
        rounded-[2rem]
        border
        border-[var(--border)]
        bg-[var(--surface)]
        p-6
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-[var(--border-strong)]
        hover:shadow-[var(--shadow-md)]
        md:p-7
      "
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]">
            <Dumbbell size={21} />
          </div>

          <h3 className="mt-5 text-xl font-black text-[var(--text)]">
            {routine.name}
          </h3>

          <p className="mt-2 text-sm text-[var(--text-muted)]">
            {routine.exercises.length} exercises
          </p>
        </div>

        <div className="relative">
          <button
            type="button"
            disabled={isBusy}
            onClick={onToggleMenu}
            aria-label={`Actions for ${routine.name}`}
            aria-expanded={menuOpen}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-xl
              border
              border-[var(--border)]
              bg-[var(--surface)]
              text-[var(--text-muted)]
              transition
              hover:border-[var(--primary)]
              hover:text-[var(--primary)]
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            <MoreHorizontal size={18} />
          </button>

          {menuOpen && (
            <div
              className="
                absolute
                right-0
                top-11
                z-20
                w-48
                overflow-hidden
                rounded-2xl
                border
                border-[var(--border)]
                bg-[var(--surface)]
                p-1.5
                shadow-xl
              "
            >
              <button
                type="button"
                onClick={() => onEdit(routine.id)}
                className="
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-xl
                  px-3
                  py-2.5
                  text-sm
                  font-medium
                  text-[var(--text)]
                  transition
                  hover:bg-[var(--surface-soft)]
                "
              >
                <Pencil size={16} />
                Edit routine
              </button>

              <button
                type="button"
                disabled={isDuplicating}
                onClick={() => onDuplicate(routine.id)}
                className="
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-xl
                  px-3
                  py-2.5
                  text-sm
                  font-medium
                  text-[var(--text)]
                  transition
                  hover:bg-[var(--surface-soft)]
                  disabled:opacity-40
                "
              >
                <Copy size={16} />
                {isDuplicating
                  ? "Duplicating..."
                  : "Duplicate"}
              </button>

              <button
                type="button"
                disabled={isDeleting}
                onClick={() =>
                  onDelete(
                    routine.id,
                    routine.name,
                  )
                }
                className="
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-xl
                  px-3
                  py-2.5
                  text-sm
                  font-medium
                  text-[var(--danger)]
                  transition
                  hover:bg-[var(--danger)]/10
                  disabled:opacity-40
                "
              >
                <Trash2 size={16} />
                {isDeleting
                  ? "Deleting..."
                  : "Delete routine"}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 space-y-2">
        {routine.exercises.slice(0, 3).map(
          (routineExercise) => (
            <div
              key={
                routineExercise.exercise.id
              }
              className="
                flex
                items-center
                justify-between
                gap-3
                rounded-xl
                bg-[var(--surface-soft)]
                px-4
                py-3
              "
            >
              <span className="truncate text-sm font-medium text-[var(--text)]">
                {routineExercise.exercise.name}
              </span>

              <span className="shrink-0 text-xs font-semibold text-[var(--text-muted)]">
                {routineExercise.targetSets} ×{" "}
                {routineExercise.targetReps}
              </span>
            </div>
          ),
        )}

        {routine.exercises.length > 3 && (
          <p className="px-1 pt-1 text-xs font-medium text-[var(--text-muted)]">
            + {routine.exercises.length - 3} more
          </p>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-[var(--border)] pt-5">
        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
          <Clock3 size={15} />
          ~{estimatedMinutes} min
        </div>

        <button
          type="button"
          onClick={() => onStart(routine.id)}
          className="
            flex
            items-center
            gap-2
            rounded-xl
            bg-[var(--primary)]
            px-4
            py-2.5
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-[var(--primary-hover)]
          "
        >
          Start
          <ArrowRight size={16} />
        </button>
      </div>
    </article>
  );
}

export default function Workouts() {
  const navigate = useNavigate();

  const [openMenu, setOpenMenu] =
    useState<string | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [deletingRoutineId, setDeletingRoutineId] =
    useState<string | null>(null);

  const [
    duplicatingRoutineId,
    setDuplicatingRoutineId,
  ] = useState<string | null>(null);

  const customRoutines =
    useRoutineStore(
      (state) => state.customRoutines,
    );

  const setCustomRoutines =
    useRoutineStore(
      (state) => state.setCustomRoutines,
    );

  const deleteRoutine =
    useRoutineStore(
      (state) => state.deleteRoutine,
    );

  const addRoutine =
    useRoutineStore(
      (state) => state.addRoutine,
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

  const sortedCustomRoutines =
    useMemo(
      () => [...customRoutines],
      [customRoutines],
    );

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
      setDeletingRoutineId(routineId);
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
    const routine =
      customRoutines.find(
        (item) => item.id === routineId,
      );

    if (!routine) {
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
      setDuplicatingRoutineId(null);
    }
  }

  function handleViewProgram(
    programId: string,
  ) {
    navigate(
      `/program/${encodeURIComponent(programId)}`,
    );
  }

  if (isLoading) {
    return (
      <main className="space-y-8">
        <section className="animate-pulse space-y-4">
          <div className="h-4 w-24 rounded bg-[var(--surface-soft)]" />
          <div className="h-12 w-80 rounded-xl bg-[var(--surface-soft)]" />
          <div className="h-6 w-full max-w-2xl rounded bg-[var(--surface-soft)]" />
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="h-96 rounded-[2rem] bg-[var(--surface-soft)]"
            />
          ))}
        </section>
      </main>
    );
  }

  return (
    <main
      className="space-y-14"
      onClick={() => {
        if (openMenu) {
          setOpenMenu(null);
        }
      }}
    >
      {/* Hero */}

      <section className="relative overflow-hidden rounded-[2.5rem] border border-[var(--border)] bg-[var(--surface)] px-6 py-10 shadow-sm md:px-10 md:py-14">
        <div className="absolute -right-32 -top-32 h-72 w-72 rounded-full bg-[var(--primary)]/10 blur-3xl" />

        <div className="relative max-w-3xl">
          <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.25em] text-[var(--primary)]">
            <Dumbbell size={16} />
            Training
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-tight text-[var(--text)] md:text-6xl">
            Train with a plan
            <br />
            that fits your life.
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--text-muted)]">
            Follow a structured program, start a
            quick routine, or build something
            completely your own.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                navigate(
                  "/workouts/create",
                );
              }}
              className="
                inline-flex
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
              <Plus size={18} />
              Create your own routine
            </button>

            <button
              type="button"
              onClick={() => {
                document
                  .getElementById(
                    "programs",
                  )
                  ?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
              }}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-[var(--border-strong)]
                bg-[var(--surface)]
                px-5
                py-3
                font-semibold
                text-[var(--text)]
                transition
                hover:border-[var(--primary)]
                hover:text-[var(--primary)]
              "
            >
              Explore programs
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </section>

      {/* Error */}

      {error && (
        <section
          role="alert"
          className="rounded-2xl border border-[var(--danger)]/30 bg-[var(--danger)]/10 px-5 py-4"
          onClick={(event) =>
            event.stopPropagation()
          }
        >
          <p className="text-sm font-medium text-[var(--danger)]">
            {error}
          </p>
        </section>
      )}

      {/* Programs */}

      <section
        id="programs"
        className="scroll-mt-28 space-y-6"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--primary)]">
              Start here
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight text-[var(--text)] md:text-4xl">
              Free training programs
            </h2>

            <p className="mt-2 max-w-2xl text-[var(--text-muted)]">
              Structured plans built around different
              goals, schedules, and equipment.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
            <Users size={16} />
            Built for real life
          </div>
        </div>

        {programs.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {programs.map((program) => (
              <ProgramCard
                key={program.id}
                program={program}
                onView={handleViewProgram}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
            <p className="font-semibold text-[var(--text)]">
              Programs are coming soon.
            </p>
          </div>
        )}
      </section>

      {/* Custom routines */}

      <section
        className="space-y-6"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--primary)]">
              Your training
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight text-[var(--text)] md:text-4xl">
              Your routines
            </h2>

            <p className="mt-2 text-[var(--text-muted)]">
              Workouts you've created and saved.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/workouts/create",
              )
            }
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-[var(--border-strong)]
              bg-[var(--surface)]
              px-4
              py-2.5
              text-sm
              font-semibold
              text-[var(--text)]
              transition
              hover:border-[var(--primary)]
              hover:text-[var(--primary)]
            "
          >
            <Plus size={17} />
            Create routine
          </button>
        </div>

        {sortedCustomRoutines.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {sortedCustomRoutines.map(
              (routine) => (
                <RoutineCard
                  key={routine.id}
                  routine={routine}
                  onStart={(routineId) =>
                    navigate(
                      `/workout/${routineId}`,
                    )
                  }
                  onEdit={(routineId) =>
                    navigate(
                      `/workouts/create?edit=${encodeURIComponent(
                        routineId,
                      )}`,
                    )
                  }
                  onDuplicate={(routineId) =>
                    void handleDuplicate(
                      routineId,
                    )
                  }
                  onDelete={(
                    routineId,
                    name,
                  ) =>
                    void handleDelete(
                      routineId,
                      name,
                    )
                  }
                  menuOpen={
                    openMenu === routine.id
                  }
                  onToggleMenu={() =>
                    setOpenMenu(
                      openMenu === routine.id
                        ? null
                        : routine.id,
                    )
                  }
                  isDeleting={
                    deletingRoutineId ===
                    routine.id
                  }
                  isDuplicating={
                    duplicatingRoutineId ===
                    routine.id
                  }
                />
              ),
            )}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-dashed border-[var(--border-strong)] bg-[var(--surface)] px-6 py-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]">
              <Dumbbell size={24} />
            </div>

            <h3 className="mt-5 text-xl font-black text-[var(--text)]">
              Build your first routine
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[var(--text-muted)]">
              Choose your exercises, sets, reps, and
              rest times. Make the workout fit you.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/workouts/create",
                )
              }
              className="
                mt-6
                inline-flex
                items-center
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
              <Plus size={18} />
              Create routine
            </button>
          </div>
        )}
      </section>

      {/* Personalization teaser */}

      <section
        className="
          overflow-hidden
          rounded-[2.5rem]
          bg-[#2f261d]
          px-7
          py-10
          md:px-10
          md:py-12
        "
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--primary)]">
            Coming later
          </p>

          <h2 className="mt-4 text-3xl font-black tracking-tight text-[#fffaf0] md:text-4xl">
            Your training shouldn't look like
            everyone else's.
          </h2>

          <p className="mt-4 max-w-2xl leading-relaxed text-white/60">
            Tell MoosclesPro your goal, experience,
            schedule, available equipment, and what
            you want to improve. We'll eventually use
            that information to build a plan around
            you.
          </p>

          <div className="mt-7 flex flex-wrap gap-2">
            {[
              "Your goal",
              "Your schedule",
              "Your equipment",
              "Your experience",
            ].map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-[#fffaf0]/70"
              >
                {item}
              </span>
            ))}
          </div>

          <button
            type="button"
            disabled
            className="
              mt-8
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-white/10
              px-5
              py-3
              font-semibold
              text-[#fffaf0]/50
              cursor-not-allowed
            "
          >
            Personalized training
            <span className="text-xs">
              Coming soon
            </span>
          </button>
        </div>
      </section>
    </main>
  );
}