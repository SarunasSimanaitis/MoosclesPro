import {
  ArrowRight,
  Dumbbell,
  Plus,
  Users,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import { routinesApi } from "../api/routines";
import ProgramCard from "../components/workout/ProgramCard";
import RoutineCard from "../components/workout/RoutineCard";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { programs } from "../data/programs";
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
      (state) => state.customRoutines,
    );

  const setCustomRoutines =
    useRoutineStore(
      (state) =>
        state.setCustomRoutines,
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
        (item) =>
          item.id === routineId,
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
          (exercise) => ({
            ...exercise,
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
      `/program/${encodeURIComponent(
        programId,
      )}`,
    );
  }

  function closeMenu() {
    setOpenMenu(null);
  }

  if (isLoading) {
    return <WorkoutsSkeleton />;
  }

  return (
    <main
      className="space-y-14"
      onClick={closeMenu}
    >
      {/* Hero */}
      <section className="relative overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] px-6 py-10 shadow-[var(--shadow-sm)] md:px-10 md:py-14">
        <div
          aria-hidden="true"
          className="absolute -right-32 -top-32 h-72 w-72 rounded-full bg-[var(--primary)] opacity-10 blur-3xl"
        />

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
            Follow a structured
            program, start a quick
            routine, or build something
            completely your own.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              onClick={() =>
                navigate(
                  "/workouts/create",
                )
              }
            >
              <Plus size={18} />
              Create your own routine
            </Button>

            <Button
              variant="secondary"
              onClick={() =>
                document
                  .getElementById(
                    "programs",
                  )
                  ?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  })
              }
            >
              Explore programs
              <ArrowRight size={17} />
            </Button>
          </div>
        </div>
      </section>

      {/* Error */}
      {error && (
        <Card
          role="alert"
          className="border-[var(--danger)]/30 bg-[var(--danger-soft)] p-5 shadow-none"
          onClick={(event) =>
            event.stopPropagation()
          }
        >
          <p className="text-sm font-semibold text-[var(--danger)]">
            {error}
          </p>
        </Card>
      )}

      {/* Programs */}
      <section
        id="programs"
        className="scroll-mt-28 space-y-6"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <SectionHeader
          eyebrow="Start here"
          title="Free training programs"
          description="Structured plans built around different goals, schedules, and equipment."
          action={
            <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
              <Users size={16} />
              Built for real life
            </div>
          }
        />

        {programs.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {programs.map(
              (program) => (
                <ProgramCard
                  key={program.id}
                  program={program}
                  onView={
                    handleViewProgram
                  }
                />
              ),
            )}
          </div>
        ) : (
          <EmptyPrograms />
        )}
      </section>

      {/* Routines */}
      <section
        className="space-y-6"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <SectionHeader
          eyebrow="Your training"
          title="Your routines"
          description="Workouts you've created and saved."
          action={
            <Button
              variant="secondary"
              size="sm"
              onClick={() =>
                navigate(
                  "/workouts/create",
                )
              }
            >
              <Plus size={17} />
              Create routine
            </Button>
          }
        />

        {customRoutines.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {customRoutines.map(
              (routine) => (
                <RoutineCard
                  key={routine.id}
                  routine={routine}
                  menuOpen={
                    openMenu ===
                    routine.id
                  }
                  isDeleting={
                    deletingRoutineId ===
                    routine.id
                  }
                  isDuplicating={
                    duplicatingRoutineId ===
                    routine.id
                  }
                  onStart={(id) =>
                    navigate(
                      `/workout/${id}`,
                    )
                  }
                  onEdit={(id) =>
                    navigate(
                      `/workouts/create?edit=${encodeURIComponent(
                        id,
                      )}`,
                    )
                  }
                  onDuplicate={(id) =>
                    void handleDuplicate(
                      id,
                    )
                  }
                  onDelete={(
                    id,
                    name,
                  ) =>
                    void handleDelete(
                      id,
                      name,
                    )
                  }
                  onToggleMenu={() =>
                    setOpenMenu(
                      openMenu ===
                        routine.id
                        ? null
                        : routine.id,
                    )
                  }
                />
              ),
            )}
          </div>
        ) : (
          <EmptyRoutines
            onCreate={() =>
              navigate(
                "/workouts/create",
              )
            }
          />
        )}
      </section>

      {/* Personalization */}
      <section className="overflow-hidden rounded-[var(--radius-xl)] bg-[var(--feature-background)] px-7 py-10 md:px-10 md:py-12">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--primary)]">
            Coming later
          </p>

          <h2 className="mt-4 text-3xl font-black tracking-tight text-[var(--feature-text)] md:text-4xl">
            Your training shouldn't
            look like everyone else's.
          </h2>

          <p className="mt-4 max-w-2xl leading-relaxed text-[var(--feature-muted)]">
            Tell MoosclesPro your goal,
            experience, schedule,
            available equipment, and what
            you want to improve. We'll
            eventually use that information
            to build a plan around you.
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
                className="
                  rounded-full
                  border
                  border-[var(--feature-border)]
                  bg-[var(--feature-surface)]
                  px-3
                  py-1.5
                  text-xs
                  font-semibold
                  text-[var(--feature-muted)]
                "
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--primary)]">
          {eyebrow}
        </p>

        <h2 className="mt-2 text-3xl font-black tracking-tight text-[var(--text)] md:text-4xl">
          {title}
        </h2>

        <p className="mt-2 max-w-2xl text-[var(--text-muted)]">
          {description}
        </p>
      </div>

      {action}
    </div>
  );
}

function EmptyPrograms() {
  return (
    <Card className="p-10 text-center">
      <p className="font-semibold text-[var(--text)]">
        Programs are coming soon.
      </p>
    </Card>
  );
}

function EmptyRoutines({
  onCreate,
}: {
  onCreate: () => void;
}) {
  return (
    <Card className="border-dashed p-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]">
        <Dumbbell size={24} />
      </div>

      <h3 className="mt-5 text-xl font-black text-[var(--text)]">
        Build your first routine
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[var(--text-muted)]">
        Choose your exercises, sets,
        reps, and rest times. Make the
        workout fit you.
      </p>

      <Button
        onClick={onCreate}
        className="mt-6"
      >
        <Plus size={18} />
        Create routine
      </Button>
    </Card>
  );
}

function WorkoutsSkeleton() {
  return (
    <main
      role="status"
      aria-label="Loading workouts"
      className="space-y-10"
    >
      <span className="sr-only">
        Loading your workouts
      </span>

      <div className="h-72 animate-pulse rounded-[var(--radius-xl)] bg-[var(--surface-soft)]" />

      <div className="grid gap-6 lg:grid-cols-2">
        {[1, 2].map((item) => (
          <div
            key={item}
            className="h-96 animate-pulse rounded-[var(--radius-xl)] bg-[var(--surface-soft)]"
          />
        ))}
      </div>

      <div className="space-y-5">
        <div className="h-10 w-64 animate-pulse rounded-lg bg-[var(--surface-soft)]" />

        <div className="grid gap-6 lg:grid-cols-2">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="h-80 animate-pulse rounded-[var(--radius-xl)] bg-[var(--surface-soft)]"
            />
          ))}
        </div>
      </div>
    </main>
  );
}