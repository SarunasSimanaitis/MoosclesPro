import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Dumbbell,
  Play,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

import { routines } from "../data/routines";
import { useRoutineStore } from "../stores/routineStore";
import {
  formatElapsedTime,
  getActiveWorkoutCompletedSets,
  getActiveWorkoutTotalSets,
  getActiveWorkoutVolume,
  getElapsedSeconds,
} from "../lib/activeWorkout";
import { useActiveWorkoutStore } from "../stores/activeWorkoutStore";
import { authClient } from "../lib/auth-client";

export default function Session() {
  const navigate = useNavigate();

  const {
    data: session,
    isPending,
  } = authClient.useSession();

  const activeWorkout =
    useActiveWorkoutStore(
      (state) => state.activeWorkout,
    );

  const togglePause =
    useActiveWorkoutStore(
      (state) => state.togglePause,
    );

  const clearActiveWorkout =
    useActiveWorkoutStore(
      (state) =>
        state.clearActiveWorkout,
    );

  const customRoutines =
    useRoutineStore(
      (state) => state.customRoutines,
    );

  const [now, setNow] =
    useState(() => Date.now());

  useEffect(() => {
    if (!activeWorkout) {
      return;
    }

    const interval =
      window.setInterval(() => {
        setNow(Date.now());
      }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [activeWorkout]);

  const currentWorkout =
    activeWorkout &&
    session?.user?.id ===
      activeWorkout.userId
      ? activeWorkout
      : null;

  const routineName = useMemo(() => {
    if (!currentWorkout) {
      return "Active workout";
    }

    return (
      [
        ...routines,
        ...customRoutines,
      ].find(
        (routine) =>
          routine.id ===
          currentWorkout.routineId,
      )?.name ??
      "Active workout"
    );
  }, [
    currentWorkout,
    customRoutines,
  ]);

  if (isPending) {
    return (
      <main className="mx-auto max-w-4xl">
        <Card className="p-8">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-[var(--surface-soft)]" />

          <div className="mt-6 h-16 w-full animate-pulse rounded-xl bg-[var(--surface-soft)]" />

          <div className="mt-4 h-20 w-full animate-pulse rounded-xl bg-[var(--surface-soft)]" />
        </Card>
      </main>
    );
  }

  if (!currentWorkout) {
    return (
      <EmptySession
        onBrowse={() =>
          navigate("/workouts")
        }
      />
    );
  }

  const completedSets =
    getActiveWorkoutCompletedSets(
      currentWorkout,
    );

  const totalSets =
    getActiveWorkoutTotalSets(
      currentWorkout,
    );

  const volume =
    getActiveWorkoutVolume(
      currentWorkout,
    );

  const elapsedSeconds =
    getElapsedSeconds(
      currentWorkout,
      now,
    );

  const progress =
    totalSets > 0
      ? Math.round(
          (completedSets /
            totalSets) *
            100,
        )
      : 0;

  function resume() {
    navigate(
      `/workout/${encodeURIComponent(
        currentWorkout!.routineId,
      )}`,
    );
  }

  function discard() {
    const confirmed =
      window.confirm(
        "Discard this active workout? Your unsaved sets will be lost.",
      );

    if (!confirmed) {
      return;
    }

    clearActiveWorkout();
  }

  return (
    <main className="mx-auto max-w-4xl space-y-8">
      <section>
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-[var(--primary)]">
          Active session
        </p>

        <h1 className="mt-3 text-4xl font-black tracking-tight text-[var(--text)] md:text-5xl">
          Continue training
        </h1>

        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-[var(--text-muted)]">
          Your active workout is saved while
          you move around the app, so your sets
          stay exactly where you left them.
        </p>
      </section>

      <Card className="overflow-hidden">
        <div className="relative bg-[var(--feature-background)] p-7 md:p-9">
          <div
            aria-hidden="true"
            className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[var(--primary)] opacity-10 blur-3xl"
          />

          <div className="relative">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--primary)]">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--primary)]" />
                  In progress
                </div>

                <h2 className="mt-3 text-3xl font-black tracking-tight text-[var(--feature-text)]">
                  {routineName}
                </h2>

                <p className="mt-2 text-sm text-[var(--feature-muted)]">
                  {currentWorkout.isPaused
                    ? "Paused"
                    : "Training now"}
                </p>
              </div>

              <div className="rounded-[var(--radius-lg)] border border-[var(--feature-border)] bg-[var(--feature-surface)] px-5 py-4 text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--feature-subtle)]">
                  Elapsed
                </p>

                <p className="mt-1 font-mono text-2xl font-black text-[var(--feature-text)]">
                  {formatElapsedTime(
                    elapsedSeconds,
                  )}
                </p>
              </div>
            </div>

            <div className="mt-7">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-[var(--feature-muted)]">
                  {completedSets}/
                  {totalSets} sets
                </span>

                <span className="font-black text-[var(--primary)]">
                  {progress}%
                </span>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--feature-surface)]">
                <div
                  className="h-full rounded-full bg-[var(--primary)] transition-[width] duration-300"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-7">
          <div className="grid gap-3 sm:grid-cols-3">
            <SessionMetric
              icon={<Dumbbell size={16} />}
              label="Exercises"
              value={currentWorkout.exercises.length.toString()}
            />

            <SessionMetric
              icon={<CheckCircle2 size={16} />}
              label="Completed"
              value={`${completedSets}/${totalSets}`}
            />

            <SessionMetric
              icon={<Clock3 size={16} />}
              label="Volume"
              value={`${volume.toLocaleString()} kg`}
            />
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              onClick={resume}
              className="flex-1"
            >
              <Play size={18} />
              Resume workout
              <ArrowRight size={17} />
            </Button>

            <Button
              variant="secondary"
              size="lg"
              onClick={togglePause}
            >
              {currentWorkout.isPaused
                ? "Resume timer"
                : "Pause timer"}
            </Button>
          </div>

          <button
            type="button"
            onClick={discard}
            className="mx-auto mt-5 block text-sm font-semibold text-[var(--danger)] transition-opacity hover:opacity-80"
          >
            Discard workout
          </button>
        </div>
      </Card>
    </main>
  );
}

function EmptySession({
  onBrowse,
}: {
  onBrowse: () => void;
}) {
  return (
    <main className="mx-auto max-w-3xl">
      <Card className="p-10 text-center md:p-14">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]">
          <Play size={27} />
        </div>

        <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-[var(--primary)]">
          Session
        </p>

        <h1 className="mt-2 text-3xl font-black tracking-tight text-[var(--text)] md:text-4xl">
          No active workout
        </h1>

        <p className="mx-auto mt-3 max-w-md leading-relaxed text-[var(--text-muted)]">
          Start a workout from your routines
          and it will stay available here until
          you finish it.
        </p>

        <Button
          onClick={onBrowse}
          className="mt-7"
        >
          Browse workouts
          <ArrowRight size={17} />
        </Button>
      </Card>
    </main>
  );
}

function SessionMetric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[var(--radius-md)] bg-[var(--surface-soft)] p-4">
      <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-muted)]">
        {icon}
        {label}
      </div>

      <p className="mt-2 font-black text-[var(--text)]">
        {value}
      </p>
    </div>
  );
}