import { ChevronRight, Pause, Play } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { routines } from "../../data/routines";
import { authClient } from "../../lib/auth-client";
import {
  formatElapsedTime,
  getActiveWorkoutCompletedSets,
  getActiveWorkoutTotalSets,
  getElapsedSeconds,
} from "../../lib/activeWorkout";
import { useActiveWorkoutStore } from "../../stores/activeWorkoutStore";
import { useCustomRoutines } from "../../hooks/useCustomRoutines";

/**
 * A slim "workout in progress" strip shown on every page except the workout
 * itself, so an unfinished workout is always one tap away.
 */
export default function ActiveWorkoutBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { data: session } = authClient.useSession();

  const activeWorkout = useActiveWorkoutStore((state) => state.activeWorkout);
  const togglePause = useActiveWorkoutStore((state) => state.togglePause);
  const needsCustomRoutine = Boolean(
    activeWorkout && !routines.some((item) => item.id === activeWorkout.routineId),
  );
  const { customRoutines } = useCustomRoutines(needsCustomRoutine);

  const [now, setNow] = useState(() => Date.now());

  const isRunning = Boolean(activeWorkout && !activeWorkout.isPaused);

  useEffect(() => {
    if (!isRunning) return;

    const tick = () => setNow(Date.now());
    const firstTick = window.setTimeout(tick, 0);
    const interval = window.setInterval(tick, 1000);
    return () => {
      window.clearTimeout(firstTick);
      window.clearInterval(interval);
    };
  }, [isRunning]);

  const routineName = useMemo(() => {
    if (!activeWorkout) return "Workout";

    const routine = [...customRoutines, ...routines].find((item) => item.id === activeWorkout.routineId);
    return routine?.name ?? "Workout";
  }, [activeWorkout, customRoutines]);

  const onWorkoutScreen = pathname.startsWith("/workout/") || pathname === "/session";
  const belongsToCurrentUser = Boolean(activeWorkout && session?.user?.id === activeWorkout.userId);

  if (!activeWorkout || !belongsToCurrentUser || onWorkoutScreen) {
    return null;
  }

  const completedSets = getActiveWorkoutCompletedSets(activeWorkout);
  const totalSets = getActiveWorkoutTotalSets(activeWorkout);
  const progress = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;
  const elapsed = formatElapsedTime(getElapsedSeconds(activeWorkout, now));

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(var(--bottom-offset)+0.5rem)] z-30 px-3 md:bottom-5 md:left-auto md:right-5 md:w-[22rem] md:px-0">
      <div className="elevated pointer-events-auto relative mx-auto flex max-w-md items-center gap-3 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] py-2 pl-3 pr-2 shadow-[var(--shadow-md)]">
        <button
          type="button"
          onClick={() => navigate(`/workout/${encodeURIComponent(activeWorkout.routineId)}`)}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
          aria-label={`Resume ${routineName}, ${completedSets} of ${totalSets} sets done, ${elapsed} elapsed`}
        >
          <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden="true">
            {isRunning && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--primary)] opacity-60" />}
            <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${isRunning ? "bg-[var(--primary)]" : "bg-[var(--text-subtle)]"}`} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-[var(--text)]">{routineName}</span>
            <span className="block text-xs text-[var(--text-muted)]">
              <span className="font-mono tabular-nums">{elapsed}</span>
              {" · "}
              {completedSets}/{totalSets} sets
              {activeWorkout.isPaused ? " · Paused" : ""}
            </span>
          </span>
          <ChevronRight size={18} className="shrink-0 text-[var(--text-muted)]" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={togglePause}
          aria-label={activeWorkout.isPaused ? "Resume timer" : "Pause timer"}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--surface-soft)] text-[var(--text)] hover:bg-[var(--surface-hover)]"
        >
          {activeWorkout.isPaused ? <Play size={15} aria-hidden="true" /> : <Pause size={15} aria-hidden="true" />}
        </button>

        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-[var(--primary)] transition-transform duration-300"
          style={{ transform: `scaleX(${progress / 100})` }}
        />
      </div>
    </div>
  );
}
