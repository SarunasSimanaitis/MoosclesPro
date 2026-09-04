import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Dumbbell,
  Pause,
  Play,
  X,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import { routines } from "../../data/routines";
import { useRoutineStore } from "../../stores/routineStore";
import { authClient } from "../../lib/auth-client";
import {
  formatElapsedTime,
  getActiveWorkoutCompletedSets,
  getActiveWorkoutTotalSets,
} from "../../lib/activeWorkout";
import { useActiveWorkoutStore } from "../../stores/activeWorkoutStore";

export default function ActiveWorkoutBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    data: session,
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
      window.clearInterval(
        interval,
      );
    };
  }, [activeWorkout]);

  const routineName = useMemo(() => {
    if (!activeWorkout) {
      return "Active workout";
    }

    const routine = [
      ...routines,
      ...customRoutines,
    ].find(
      (item) =>
        item.id ===
        activeWorkout.routineId,
    );

    return (
      routine?.name ??
      "Active workout"
    );
  }, [
    activeWorkout,
    customRoutines,
  ]);

  const completedSets =
    getActiveWorkoutCompletedSets(
      activeWorkout,
    );

  const totalSets =
    getActiveWorkoutTotalSets(
      activeWorkout,
    );

  const progress =
    totalSets > 0
      ? Math.round(
          (completedSets /
            totalSets) *
            100,
        )
      : 0;

  const elapsed =
    formatElapsedTime(
      getElapsedSecondsForDisplay(
        activeWorkout,
        now,
      ),
    );

  const isOnWorkoutPage =
    location.pathname.startsWith(
      "/workout/",
    );

  const isOnSessionPage =
    location.pathname ===
    "/session";

  const belongsToCurrentUser =
    Boolean(
      activeWorkout &&
        session?.user?.id ===
          activeWorkout.userId,
    );

  /*
   * The page itself already has all workout
   * controls, so don't duplicate the bar there.
   */
  if (
    !activeWorkout ||
    !belongsToCurrentUser ||
    isOnWorkoutPage ||
    isOnSessionPage
  ) {
    return null;
  }

  function resumeWorkout() {
    navigate(
      `/workout/${encodeURIComponent(
        activeWorkout!.routineId,
      )}`,
    );
  }

  function discardWorkout() {
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
    <div
      className="
        fixed
        bottom-4
        left-4
        right-4
        z-50
        sm:left-auto
        sm:right-6
        sm:w-[min(30rem,calc(100vw-3rem))]
      "
    >
      <div
        className="
          overflow-hidden
          rounded-[var(--radius-xl)]
          border
          border-[var(--primary)]
          bg-[var(--surface)]
          shadow-[var(--shadow-lg)]
          backdrop-blur-xl
        "
      >
        <div className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">
              <Dumbbell size={19} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--primary)]" />

                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--primary)]">
                  Workout in progress
                </p>
              </div>

              <h2 className="mt-0.5 truncate text-sm font-black text-[var(--text)]">
                {routineName}
              </h2>
            </div>

            <div className="text-right">
              <p className="flex items-center justify-end gap-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                <Clock3 size={12} />
                Time
              </p>

              <p className="font-mono text-sm font-black text-[var(--text)]">
                {elapsed}
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[var(--text-muted)]">
                  {completedSets}/
                  {totalSets} sets
                </span>

                <span className="font-black text-[var(--primary)]">
                  {progress}%
                </span>
              </div>

              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--surface-soft)]">
                <div
                  className="h-full rounded-full bg-[var(--primary)] transition-[width] duration-300"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                onClick={togglePause}
                aria-label={
                  activeWorkout.isPaused
                    ? "Resume timer"
                    : "Pause timer"
                }
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-[var(--border)]
                  bg-[var(--surface-soft)]
                  text-[var(--text-muted)]
                  transition-colors
                  hover:border-[var(--primary)]
                  hover:text-[var(--primary)]
                "
              >
                {activeWorkout.isPaused ? (
                  <Play size={15} />
                ) : (
                  <Pause size={15} />
                )}
              </button>

              <button
                type="button"
                onClick={resumeWorkout}
                className="
                  inline-flex
                  h-9
                  items-center
                  gap-1.5
                  rounded-xl
                  bg-[var(--primary)]
                  px-3
                  text-xs
                  font-bold
                  text-[var(--primary-foreground)]
                  transition-colors
                  hover:bg-[var(--primary-hover)]
                "
              >
                Resume
                <ArrowRight size={14} />
              </button>

              <button
                type="button"
                onClick={discardWorkout}
                aria-label="Discard workout"
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  text-[var(--text-muted)]
                  transition-colors
                  hover:bg-[var(--danger-soft)]
                  hover:text-[var(--danger)]
                "
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {activeWorkout.isPaused && (
            <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-[var(--warning)]">
              <CheckCircle2 size={13} />
              Workout paused
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getElapsedSecondsForDisplay(
  workout: typeof useActiveWorkoutStore extends never
    ? never
    : ReturnType<
        typeof useActiveWorkoutStore.getState
      >["activeWorkout"],
  now: number,
) {
  if (!workout) {
    return 0;
  }

  const startedAt = new Date(
    workout.startedAt,
  ).getTime();

  if (!Number.isFinite(startedAt)) {
    return 0;
  }

  const endTime =
    workout.isPaused &&
    workout.pauseStartedAt !== null
      ? workout.pauseStartedAt
      : now;

  return Math.max(
    0,
    Math.floor(
      (endTime -
        startedAt -
        workout.totalPausedMs) /
        1000,
    ),
  );
}