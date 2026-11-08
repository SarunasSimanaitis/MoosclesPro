import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  Dumbbell,
  Pause,
  Play,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { workoutSessionsApi } from "../api/workoutSessions";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import CelebrationToast from "../components/workout/CelebrationToast";
import PersonalRecordBanner from "../components/workout/PersonalRecordBanner";
import RestTimerDock from "../components/workout/RestTimer";
import WorkoutExerciseCard, { type ExerciseActions } from "../components/workout/WorkoutExerciseCard";
import { routines } from "../data/routines";
import { useCustomRoutines } from "../hooks/useCustomRoutines";
import { useWorkoutSession } from "../hooks/useWorkoutSession";
import { useWorkoutTimer } from "../hooks/useWorkoutTimer";
import { authClient } from "../lib/auth-client";
import { launchConfetti } from "../lib/confetti";
import { primeAudio, tapFeedback, vibrate } from "../lib/feedback";
import {
  collectPersonalRecords,
  findWorkoutPersonalRecords,
  getRecordLabel,
  type WorkoutPersonalRecord,
} from "../lib/personalRecords";
import { getAppPreferences, getRestOverrides, saveRestOverride } from "../lib/preferences";
import { formatVolume } from "../lib/units";
import { useActiveWorkoutStore } from "../stores/activeWorkoutStore";
import { useRestTimerStore } from "../stores/restTimerStore";
import type { Routine } from "../types/Routine";

export default function WorkoutSessionPage() {
  const navigate = useNavigate();

  const {
    routineId,
  } = useParams<{
    routineId: string;
  }>();

  const {
    data: session,
    isPending: sessionPending,
  } = authClient.useSession();

  const isBuiltInRoutine = routines.some((item) => item.id === routineId);

  const {
    customRoutines,
    status: customRoutinesStatus,
  } = useCustomRoutines(Boolean(session?.user) && !isBuiltInRoutine);

  const activeWorkout =
    useActiveWorkoutStore(
      (state) => state.activeWorkout,
    );

  const startWorkout = useActiveWorkoutStore((state) => state.startWorkout);

  const clearActiveWorkout =
    useActiveWorkoutStore(
      (state) =>
        state.clearActiveWorkout,
    );

  const [isStarting, setIsStarting] = useState(false);
  /* Bumped to start a fresh workout (with last-time prefill) after discarding one. */
  const [startRequest, setStartRequest] = useState(0);
  const userId = session?.user?.id;

  const allRoutines = useMemo(
    () => [
      ...routines,
      ...customRoutines,
    ],
    [customRoutines],
  );

  const routine = allRoutines.find(
    (item) =>
      item.id === routineId,
  );

  useEffect(() => {
    if (sessionPending || !userId || !routine || !routineId) {
      return;
    }

    let cancelled = false;
    const currentUserId = userId;
    const current = useActiveWorkoutStore.getState().activeWorkout;

    if (current?.userId === currentUserId) {
      return;
    }

    async function start() {
      setIsStarting(true);

      try {
        const previous = await workoutSessionsApi.latestForRoutine(routine!.id);

        if (cancelled) return;

        const latest = useActiveWorkoutStore.getState().activeWorkout;

        if (latest?.userId === currentUserId) {
          return;
        }

        startWorkout(routine!, currentUserId, {
          previousSession: previous,
          restOverrides: getRestOverrides(routine!.id),
        });
      } catch (error) {
        console.error("Could not load previous workout performance:", error);

        if (!cancelled) {
          startWorkout(routine!, currentUserId, {
            restOverrides: getRestOverrides(routine!.id),
          });
        }
      } finally {
        if (!cancelled) {
          setIsStarting(false);
        }
      }
    }

    void start();

    return () => {
      cancelled = true;
    };
  }, [
    routine,
    routineId,
    userId,
    sessionPending,
    startWorkout,
    startRequest,
  ]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, []);

  if (sessionPending || isStarting) {
    return <SessionLoading />;
  }

  if (!session?.user) {
    return null;
  }

  if (!routine && customRoutinesStatus === "loading") {
    return <SessionLoading />;
  }

  if (!routine) {
    return (
      <MissingWorkout
        onBack={() =>
          navigate("/workouts")
        }
      />
    );
  }

  /*
   * If the currently active workout is another
   * routine owned by this user, don't silently
   * overwrite it.
   */
  const activeBelongsToUser =
    activeWorkout?.userId ===
    session.user.id;

  const activeIsDifferentRoutine =
    Boolean(
      activeWorkout &&
      activeBelongsToUser &&
      activeWorkout.routineId !==
      routine.id,
    );

  if (activeIsDifferentRoutine) {
    return (
      <WorkoutConflict
        currentRoutine={
          allRoutines.find(
            (item) =>
              item.id ===
              activeWorkout!.routineId,
          )?.name ??
          "Current workout"
        }
        requestedRoutine={
          routine.name
        }
        onResumeCurrent={() =>
          navigate(
            `/workout/${activeWorkout!.routineId}`,
          )
        }
        onStartNew={() => {
          clearActiveWorkout();
          setStartRequest((value) => value + 1);
        }}
        onBack={() =>
          navigate("/workouts")
        }
      />
    );
  }

  if (
    !activeWorkout ||
    activeWorkout.routineId !==
    routine.id ||
    activeWorkout.userId !==
    session.user.id
  ) {
    return <SessionLoading />;
  }

  return (
    <WorkoutSession
      routine={routine}
      onBack={() =>
        navigate("/workouts")
      }
    />
  );
}

function WorkoutSession({
  routine,
  onBack,
}: {
  routine: Routine;
  onBack: () => void;
}) {
  const navigate = useNavigate();
  const weightUnit = getAppPreferences().weightUnit;

  const {
    workoutExercises,
    completedSets,
    totalSets,
    progress,
    totalVolume,
    previous,
    updateWeight,
    commitWeight,
    updateReps,
    commitReps,
    updateRpe,
    fillSet,
    toggleSet,
    addSet,
    removeSet,
    setRest,
    setSkipped,
    createSession,
  } = useWorkoutSession();

  /* Earlier sessions, used to spot new personal records as sets are ticked. */
  const [recordSessions, setRecordSessions] = useState(() => workoutSessionsApi.cachedList() ?? []);
  const [recordsReady, setRecordsReady] = useState(() => workoutSessionsApi.cachedList() !== undefined);

  useEffect(() => {
    let cancelled = false;

    workoutSessionsApi.list().then((sessions) => {
      if (cancelled) return;
      setRecordSessions(sessions);
      setRecordsReady(true);
    }).catch((error: unknown) => {
      console.error("Could not load workout records:", error);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const previousRecords = useMemo(
    () => collectPersonalRecords(recordSessions),
    [recordSessions],
  );
  const newPersonalRecords = useMemo(
    () => recordsReady ? findWorkoutPersonalRecords(workoutExercises, previousRecords) : [],
    [previousRecords, recordsReady, workoutExercises],
  );
  const recordLabels = useMemo(() => {
    const labels = new Map<string, string>();
    for (const record of newPersonalRecords) {
      if (!labels.has(record.setId)) labels.set(record.setId, getRecordLabel(record.kind));
    }
    return labels;
  }, [newPersonalRecords]);

  const { isPaused, formattedTime, togglePause } = useWorkoutTimer();
  const startRest = useRestTimerStore((state) => state.start);
  const stopRest = useRestTimerStore((state) => state.stop);
  const clearActiveWorkout = useActiveWorkoutStore((state) => state.clearActiveWorkout);

  const [isFinishing, setIsFinishing] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [celebration, setCelebration] = useState<{ id: number; title: string; detail: string } | null>(null);
  const dismissCelebration = useCallback(() => setCelebration(null), []);

  function celebrateRecords(records: WorkoutPersonalRecord[]) {
    // One set can beat several records at once (e.g. weight and estimated 1RM).
    const kinds = [...new Set(records.map((record) => getRecordLabel(record.kind)))];
    setCelebration({
      id: Date.now(),
      title: "New personal record!",
      detail: `${records[0].exerciseName} · ${kinds.join(", ")}`,
    });
    launchConfetti({ y: 0.35, count: 90 });
    vibrate([40, 60, 40, 60, 120]);
  }

  function handleToggleSet(exerciseId: string, setId: string) {
    const exercise = workoutExercises.find((item) => item.exercise.id === exerciseId);
    const set = exercise?.sets.find((item) => item.id === setId);
    if (!exercise || !set) return;

    const completing = !set.completed;
    toggleSet(exerciseId, setId);

    if (!completing) return;

    tapFeedback();
    primeAudio();

    if (exercise.restSeconds > 0) {
      startRest(exercise.restSeconds, exercise.exercise.name);
    }

    // The store updates synchronously, so the new state is already readable here.
    const latest = useActiveWorkoutStore.getState().activeWorkout?.exercises ?? [];

    if (recordsReady) {
      const records = findWorkoutPersonalRecords(latest, previousRecords).filter((record) => record.setId === setId);
      if (records.length > 0) celebrateRecords(records);
    }
  }

  function changeRest(exerciseId: string, seconds: number) {
    setRest(exerciseId, seconds);
    saveRestOverride(routine.id, exerciseId, seconds);
  }

  const actions: ExerciseActions = {
    updateWeight,
    commitWeight,
    updateReps,
    commitReps,
    updateRpe,
    fillSet,
    toggleSet: handleToggleSet,
    addSet,
    removeSet,
    changeRest,
    setSkipped,
  };

  async function finishWorkout() {
    if (isFinishing) return;

    if (completedSets === 0) {
      setSaveError("Tick at least one set before finishing this workout.");
      return;
    }

    const remaining = totalSets - completedSets;
    if (remaining > 0) {
      const confirmed = window.confirm(
        `${remaining} ${remaining === 1 ? "set isn't" : "sets aren't"} ticked yet. Finish the workout anyway?`,
      );
      if (!confirmed) return;
    }

    setIsFinishing(true);
    setSaveError(null);

    try {
      const session = createSession();
      await workoutSessionsApi.create(session);
      stopRest();
      clearActiveWorkout();
      navigate(`/history/${session.id}`, {
        replace: true,
        state: { justFinished: true, records: newPersonalRecords.length },
      });
    } catch (error) {
      console.error("Failed to save workout:", error);
      setSaveError(
        error instanceof Error
          ? error.message
          : "Could not save your workout. Please try again.",
      );
      setIsFinishing(false);
    }
  }

  function discardWorkout() {
    if (!window.confirm("Discard this workout? Nothing from it will be saved.")) return;

    stopRest();
    clearActiveWorkout();
    navigate("/workouts", { replace: true });
  }

  const finishedAll = totalSets > 0 && completedSets === totalSets;

  return (
    <div className="mx-auto max-w-2xl pb-40">
      {/* Sticky workout header: timer, progress and Finish are always in reach. */}
      <header className="sticky top-[calc(var(--topbar-height)+env(safe-area-inset-top))] z-30 -mx-4 border-b border-[var(--border)] bg-[var(--background)] px-4 py-2.5 sm:mx-0 sm:px-0 md:top-0">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            aria-label="Leave workout (it keeps running)"
            title="Leave workout. It keeps running."
            className="-ml-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[var(--text)] hover:bg-[var(--surface-soft)]"
          >
            <ChevronLeft size={24} aria-hidden="true" />
          </button>

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-[17px] font-bold leading-tight text-[var(--text)]">{routine.name}</h1>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
              <span className={`font-mono font-semibold tabular-nums ${isPaused ? "text-[var(--warning)]" : "text-[var(--text)]"}`}>
                {formattedTime}
              </span>
              <span aria-hidden="true">·</span>
              <span>{completedSets}/{totalSets} sets</span>
              <span aria-hidden="true">·</span>
              <span className="truncate">{formatVolume(totalVolume, weightUnit)} {weightUnit}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={togglePause}
            aria-label={isPaused ? "Resume workout timer" : "Pause workout timer"}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${isPaused ? "bg-[var(--warning-soft)] text-[var(--warning)]" : "bg-[var(--surface-soft)] text-[var(--text)]"}`}
          >
            {isPaused ? <Play size={17} aria-hidden="true" /> : <Pause size={17} aria-hidden="true" />}
          </button>

          <Button size="sm" onClick={() => void finishWorkout()} loading={isFinishing} className="shrink-0">
            Finish
          </Button>
        </div>

        <div
          className="mt-2.5 h-1 overflow-hidden rounded-full bg-[var(--surface-soft)]"
          role="progressbar"
          aria-label="Sets completed"
          aria-valuemin={0}
          aria-valuemax={totalSets}
          aria-valuenow={completedSets}
        >
          <div
            className={`h-full rounded-full transition-[width] duration-500 ease-out ${finishedAll ? "bg-[var(--success)]" : "bg-[var(--primary)]"}`}
            style={{ width: `${Math.round(progress)}%` }}
          />
        </div>
      </header>

      {isPaused && (
        <p className="mt-3 rounded-[var(--radius-md)] bg-[var(--warning-soft)] px-3 py-2 text-sm text-[var(--warning)]">
          Workout timer paused. Tap play to carry on.
        </p>
      )}

      {saveError && (
        <div role="alert" className="mt-3 flex items-start gap-3 rounded-[var(--radius-md)] bg-[var(--danger-soft)] p-3 text-sm text-[var(--danger)]">
          <TriangleAlert size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-semibold">Your workout wasn't saved</p>
            <p className="mt-0.5">{saveError}</p>
          </div>
        </div>
      )}

      <section aria-label="Exercises" className="mt-4 space-y-3">
        {workoutExercises.map((workoutExercise) => (
          <WorkoutExerciseCard
            key={workoutExercise.exercise.id}
            workoutExercise={workoutExercise}
            previousSets={previous[workoutExercise.exercise.id] ?? []}
            weightUnit={weightUnit}
            recordLabels={recordLabels}
            actions={actions}
          />
        ))}
      </section>

      <div className="mt-5">
        <PersonalRecordBanner records={newPersonalRecords} weightUnit={weightUnit} />
      </div>

      <div className="mt-5 space-y-2">
        <Button size="lg" className="w-full" onClick={() => void finishWorkout()} loading={isFinishing}>
          {finishedAll ? "Finish workout 🎉" : "Finish workout"}
        </Button>
        <button
          type="button"
          onClick={discardWorkout}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-[var(--radius-md)] text-sm font-semibold text-[var(--danger)] hover:bg-[var(--danger-soft)]"
        >
          <Trash2 size={16} aria-hidden="true" />
          Discard workout
        </button>
      </div>

      <RestTimerDock />

      {celebration && (
        <CelebrationToast
          key={celebration.id}
          title={celebration.title}
          detail={celebration.detail}
          onDone={dismissCelebration}
        />
      )}
    </div>
  );
}

function MissingWorkout({
  onBack,
}: {
  onBack: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[65vh] max-w-2xl items-center justify-center">
      <Card className="w-full p-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--primary-soft)] text-[var(--primary)]">
          <Dumbbell size={28} />
        </div>

        <h1 className="mt-6 font-bold text-[var(--text)] text-[22px] sm:text-2xl">
          Workout not found
        </h1>

        <p className="mx-auto mt-3 max-w-md text-[var(--text-muted)]">
          The routine you're trying to
          start doesn't exist or is no
          longer available.
        </p>

        <Button
          variant="secondary"
          onClick={onBack}
          className="mt-7"
        >
          <ArrowLeft size={17} />
          Back to workouts
        </Button>
      </Card>
    </div>
  );
}

function WorkoutConflict({
  currentRoutine,
  requestedRoutine,
  onResumeCurrent,
  onStartNew,
  onBack,
}: {
  currentRoutine: string;
  requestedRoutine: string;
  onResumeCurrent: () => void;
  onStartNew: () => void;
  onBack: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[65vh] max-w-2xl items-center justify-center">
      <Card className="w-full p-8 md:p-10">
        <div className="flex h-14 w-14 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--warning-soft)] text-[var(--warning)]">
          <TriangleAlert size={25} />
        </div>

        <p className="mt-6 text-xs font-semibold text-[var(--text-muted)]">
          Workout already active
        </p>

        <h1 className="mt-2 font-bold tracking-tight text-[var(--text)] text-[22px] sm:text-2xl">
          Finish what you started?
        </h1>

        <p className="mt-3 leading-relaxed text-[var(--text-muted)]">
          You're currently working on{" "}
          <strong className="font-bold text-[var(--text)]">
            {currentRoutine}
          </strong>
          . You tried to open{" "}
          <strong className="font-bold text-[var(--text)]">
            {requestedRoutine}
          </strong>
          .
        </p>

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <Button
            onClick={
              onResumeCurrent
            }
          >
            Resume current
            <ArrowRight size={17} />
          </Button>

          <Button
            variant="secondary"
            onClick={onStartNew}
          >
            Discard & start new
          </Button>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="mx-auto mt-5 block text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text)]"
        >
          Back to workouts
        </button>
      </Card>
    </div>
  );
}

function SessionLoading() {
  return (
    <div
      role="status"
      aria-label="Loading workout"
      className="mx-auto max-w-7xl space-y-6"
    >
      <span className="sr-only">
        Loading workout
      </span>

      <div className="h-5 w-36 animate-pulse rounded bg-[var(--surface-soft)]" />

      <div className="h-64 animate-pulse rounded-[var(--radius-xl)] bg-[var(--surface-soft)]" />

      <div className="h-96 animate-pulse rounded-[var(--radius-xl)] bg-[var(--surface-soft)]" />
    </div>
  );
}
