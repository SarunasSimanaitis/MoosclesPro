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
import {
  formatElapsedTime,
  getActiveWorkoutCompletedSets,
  getActiveWorkoutTotalSets,
  getActiveWorkoutVolume,
  getElapsedSeconds,
} from "../lib/activeWorkout";
import { useActiveWorkoutStore } from "../stores/activeWorkoutStore";
import { authClient } from "../lib/auth-client";
import { getAppPreferences } from "../lib/preferences";
import { formatVolume } from "../lib/units";
import { useCustomRoutines } from "../hooks/useCustomRoutines";

export default function Session() {
  const navigate = useNavigate();
  const weightUnit = getAppPreferences().weightUnit;

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

  const { customRoutines } = useCustomRoutines();

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
      <div className="mx-auto max-w-4xl">
        <Card className="p-8">
          <div className="h-8 w-48 animate-pulse rounded-[var(--radius-md)] bg-[var(--surface-soft)]" />

          <div className="mt-6 h-16 w-full animate-pulse rounded-[var(--radius-md)] bg-[var(--surface-soft)]" />

          <div className="mt-4 h-20 w-full animate-pulse rounded-[var(--radius-md)] bg-[var(--surface-soft)]" />
        </Card>
      </div>
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
    <div className="mx-auto max-w-3xl space-y-7 sm:space-y-8">
      <section>
        <p className="text-sm font-bold text-[var(--primary)]">
          Active session
        </p>

        <h1 className="mt-3 font-bold tracking-tight text-[var(--text)] text-[22px] sm:text-2xl">
          Continue training
        </h1>

        <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--text-muted)] sm:text-lg">
          Your active workout is saved while
          you move around the app, so your sets
          stay exactly where you left them.
        </p>
      </section>

      <Card className="overflow-hidden">
        <div className="relative bg-[var(--feature-background)] p-6 sm:p-8">


          <div className="relative">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-[var(--primary)]">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--primary)]" />
                  In progress
                </div>

                <h2 className="mt-3 font-bold tracking-tight text-[var(--feature-text)] text-lg sm:text-xl">
                  {routineName}
                </h2>

                <p className="mt-2 text-sm text-[var(--feature-muted)]">
                  {currentWorkout.isPaused
                    ? "Paused"
                    : "Training now"}
                </p>
              </div>

              <div className="rounded-[var(--radius-lg)] border border-[var(--feature-border)] bg-[var(--feature-surface)] px-5 py-4 text-center">
                <p className="text-[11px] font-bold text-[var(--feature-subtle)]">
                  Elapsed
                </p>

                <p className="mt-1 font-mono text-2xl font-bold text-[var(--feature-text)]">
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

                <span className="font-bold text-[var(--primary)]">
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

        <div className="p-5 sm:p-7">
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
              value={`${formatVolume(volume, weightUnit)} ${weightUnit}`}
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
    </div>
  );
}

function EmptySession({
  onBrowse,
}: {
  onBrowse: () => void;
}) {
  return (
    <div className="mx-auto max-w-3xl">
      <Card className="p-10 text-center md:p-14">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--primary-soft)] text-[var(--primary)]">
          <Play size={27} />
        </div>

        <p className="mt-6 text-sm font-bold text-[var(--primary)]">
          Session
        </p>

        <h1 className="mt-2 font-bold tracking-tight text-[var(--text)] text-[22px] sm:text-2xl">
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
    </div>
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

      <p className="mt-2 font-bold text-[var(--text)]">
        {value}
      </p>
    </div>
  );
}
