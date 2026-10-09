import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  Dumbbell,
  TriangleAlert,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  workoutSessionsApi,
} from "../api/workoutSessions";

import ExerciseCard from "../components/workout/ExerciseCard";
import RestTimerPanel from "../components/workout/RestTimerPanel";
import WorkoutFinishCard from "../components/workout/WorkoutFinishCard";
import WorkoutSessionHeader from "../components/workout/WorkoutSessionHeader";
import PersonalRecordBanner from "../components/workout/PersonalRecordBanner";

import type { Routine } from "../types/Routine";
import type { WorkoutExercise } from "../types/WorkoutExercise";
import { applyPreviousPerformance } from "../lib/workoutEngine";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

import { routines } from "../data/routines";
import { useRestTimer } from "../hooks/useRestTimer";
import { useWorkoutSession } from "../hooks/useWorkoutSession";
import { useWorkoutTimer } from "../hooks/useWorkoutTimer";
import { useRoutineStore } from "../stores/routineStore";
import { useActiveWorkoutStore } from "../stores/activeWorkoutStore";
import { authClient } from "../lib/auth-client";
import { getAppPreferences } from "../lib/preferences";
import { collectPersonalRecords, findWorkoutPersonalRecords } from "../lib/personalRecords";

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

  const customRoutines =
    useRoutineStore(
      (state) => state.customRoutines,
    );

  const activeWorkout =
    useActiveWorkoutStore(
      (state) => state.activeWorkout,
    );

  const startWorkout = useActiveWorkoutStore((state) => state.startWorkout);
  const updateExercises = useActiveWorkoutStore((state) => state.updateExercises);

  const clearActiveWorkout =
    useActiveWorkoutStore(
      (state) =>
        state.clearActiveWorkout,
    );

  const [isStarting, setIsStarting] = useState(false);
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

        const created = startWorkout(routine!, currentUserId);

        if (previous) {
          updateExercises(() =>
            applyPreviousPerformance(created.exercises, previous),
          );
        }
      } catch (error) {
        console.error("Could not load previous workout performance:", error);

        if (!cancelled) {
          startWorkout(routine!, currentUserId);
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
    updateExercises,
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

          startWorkout(
            routine,
            session.user.id,
          );
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
    updateWeight,
    commitWeight,
    updateReps,
    commitReps,
    toggleSet,
    addSet,
    createSession,
  } =
    useWorkoutSession();

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
  const [activeExerciseId, setActiveExerciseId] = useState<string | null>(null);
  const activeExercise =
    workoutExercises.find((exercise) => exercise.exercise.id === activeExerciseId) ??
    workoutExercises.find((exercise) => exercise.sets.some((set) => !set.completed)) ??
    workoutExercises[0];
  const activeExerciseIndex = activeExercise
    ? workoutExercises.findIndex((exercise) => exercise.exercise.id === activeExercise.exercise.id)
    : 0;

  function focusExercise(exerciseId: string) {
    setActiveExerciseId(exerciseId);
    window.requestAnimationFrame(() => {
      document.getElementById("active-exercise-card")?.scrollIntoView({ block: "start", behavior: "smooth" });
    });
  }

  const {
    isPaused,
    formattedTime,
    togglePause,
  } = useWorkoutTimer();

  const {
    restTime,
    restDuration,
    start: startRestTimer,
    stop: stopRestTimer,
    addTime,
    removeTime,
  } = useRestTimer();

  const clearActiveWorkout =
    useActiveWorkoutStore(
      (state) =>
        state.clearActiveWorkout,
    );

  const [
    isFinishing,
    setIsFinishing,
  ] = useState(false);

  const [
    saveError,
    setSaveError,
  ] = useState<string | null>(
    null,
  );

  function handleToggleSet(
    exerciseId: string,
    setId: string,
  ) {
    const exercise =
      workoutExercises.find(
        (item) =>
          item.exercise.id ===
          exerciseId,
      );

    if (!exercise) {
      return;
    }

    const set = exercise.sets.find(
      (item) =>
        item.id === setId,
    );

    if (!set) {
      return;
    }

    toggleSet(
      exerciseId,
      setId,
    );

    if (!set.completed) {
      startRestTimer(
        exercise.restSeconds,
      );

      const exerciseFinished = exercise.sets.every((item) => item.id === setId || item.completed);
      if (exerciseFinished) {
        const currentIndex = workoutExercises.findIndex((item) => item.exercise.id === exerciseId);
        const nextExercise = workoutExercises
          .slice(currentIndex + 1)
          .find((item) => item.sets.some((itemSet) => !itemSet.completed));
        if (nextExercise) focusExercise(nextExercise.exercise.id);
      }
    }
  }

  async function finishWorkout() {
    if (isFinishing) {
      return;
    }

    const isIncomplete =
      totalSets > 0 &&
      completedSets < totalSets;

    if (isIncomplete) {
      const confirmed =
        window.confirm(
          `You have completed ${completedSets} of ${totalSets} sets. Finish the workout anyway?`,
        );

      if (!confirmed) {
        return;
      }
    }

    setIsFinishing(true);
    setSaveError(null);

    try {
      const session =
        createSession();

      await workoutSessionsApi.create(
        session,
      );

      stopRestTimer();
      clearActiveWorkout();

      navigate("/history", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Failed to save workout:",
        error,
      );

      setSaveError(
        error instanceof Error
          ? error.message
          : "Could not save your workout. Please try again.",
      );

      setIsFinishing(false);
    }
  }

  function handleExit() {
    stopRestTimer();
    onBack();
  }

  return (
    <main className="mx-auto max-w-7xl space-y-6 pb-10">
      <button
        type="button"
        onClick={handleExit}
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
        Leave workout
      </button>

      <WorkoutSessionHeader
        routineName={routine.name}
        exerciseCount={
          workoutExercises.length
        }
        completedSets={
          completedSets
        }
        totalSets={totalSets}
        progress={progress}
        totalVolume={totalVolume}
        weightUnit={weightUnit}
        formattedTime={
          formattedTime
        }
        isPaused={isPaused}
        onTogglePause={
          togglePause
        }
      />

      {saveError && (
        <Card
          role="alert"
          className="border-[var(--danger)]/30 bg-[var(--danger-soft)] p-5 shadow-none"
        >
          <div className="flex items-start gap-3">
            <TriangleAlert
              size={19}
              className="mt-0.5 shrink-0 text-[var(--danger)]"
            />

            <div>
              <p className="font-bold text-[var(--danger)]">
                Your workout wasn't saved
              </p>

              <p className="mt-1 text-sm text-[var(--danger)]">
                {saveError}
              </p>
            </div>
          </div>
        </Card>
      )}

      {restTime !== null && (
        <RestTimerPanel
          restTime={restTime}
          restDuration={
            restDuration
          }
          onAdd={() =>
            addTime(15)
          }
          onRemove={() =>
            removeTime(15)
          }
          onStop={
            stopRestTimer
          }
        />
      )}

      <section
        aria-label="Workout exercises"
        className="space-y-5"
      >
        {activeExercise && (
          <>
            <ExerciseFocusNavigation
              exercises={workoutExercises}
              activeExercise={activeExercise}
              activeIndex={activeExerciseIndex}
              onSelect={focusExercise}
            />
            <div id="active-exercise-card" className="scroll-mt-44">
              <ExerciseCard
                key={activeExercise.exercise.id}
                workoutExercise={activeExercise}
                weightUnit={weightUnit}
                personalRecords={newPersonalRecords}
                updateWeight={updateWeight}
                commitWeight={commitWeight}
                updateReps={updateReps}
                commitReps={commitReps}
                updateCompleted={handleToggleSet}
                onAddSet={addSet}
              />
            </div>
          </>
        )}
      </section>

      <PersonalRecordBanner
        records={newPersonalRecords}
        weightUnit={weightUnit}
      />

      <WorkoutFinishCard
        completedSets={
          completedSets
        }
        totalSets={totalSets}
        personalRecordCount={newPersonalRecords.length}
        isFinishing={isFinishing}
        onFinish={() =>
          void finishWorkout()
        }
      />
    </main>
  );
}

function ExerciseFocusNavigation({
  exercises,
  activeExercise,
  activeIndex,
  onSelect,
}: {
  exercises: WorkoutExercise[];
  activeExercise: WorkoutExercise;
  activeIndex: number;
  onSelect: (exerciseId: string) => void;
}) {
  const previous = exercises[activeIndex - 1];
  const next = exercises[activeIndex + 1];
  const isComplete = activeExercise.sets.length > 0 && activeExercise.sets.every((set) => set.completed);

  return (
    <Card className="sticky top-[4.25rem] z-30 overflow-hidden border-[var(--border-strong)] bg-[var(--surface)]/95 p-2.5 shadow-[var(--shadow-md)] backdrop-blur-2xl sm:top-[4.75rem] sm:px-4 sm:py-3">
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          onClick={() => previous && onSelect(previous.exercise.id)}
          disabled={!previous}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-[var(--text-muted)] transition-[background-color,color,opacity] hover:bg-[var(--surface-soft)] hover:text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] disabled:opacity-30"
          aria-label="Previous exercise"
        >
          <ArrowLeft size={18} aria-hidden="true" />
        </button>

        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--primary)]">
            Exercise {activeIndex + 1} of {exercises.length}{isComplete ? " · Complete" : " · In progress"}
          </p>
          <p className="truncate text-sm font-black text-[var(--text)] sm:text-base">{activeExercise.exercise.name}</p>
        </div>

        <button
          type="button"
          onClick={() => next && onSelect(next.exercise.id)}
          disabled={!next}
          className="flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-2xl bg-[var(--primary-soft)] px-3 text-xs font-black text-[var(--primary)] transition-[background-color,opacity,transform] hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] active:scale-[0.97] disabled:opacity-35 disabled:hover:bg-[var(--primary-soft)] disabled:hover:text-[var(--primary)]"
          aria-label={next ? `Next exercise: ${next.exercise.name}` : "Last exercise"}
        >
          Next
          <ArrowRight size={15} aria-hidden="true" />
        </button>
      </div>

      <div className="mt-2 flex gap-1.5 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="group" aria-label="Choose an exercise">
        {exercises.map((exercise, index) => {
          const selected = exercise.exercise.id === activeExercise.exercise.id;
          const done = exercise.sets.length > 0 && exercise.sets.every((set) => set.completed);

          return (
            <button
              key={exercise.exercise.id}
              type="button"
              onClick={() => onSelect(exercise.exercise.id)}
              aria-current={selected ? "step" : undefined}
              aria-label={`Go to exercise ${index + 1}: ${exercise.exercise.name}${done ? ", complete" : ""}`}
              className={`inline-flex min-h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-[11px] font-bold transition-[background-color,border-color,color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] ${selected ? "border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]" : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:bg-[var(--surface-soft)]"}`}
            >
              {done ? <CheckCircle2 size={13} aria-hidden="true" /> : <Circle size={12} aria-hidden="true" />}
              <span>{index + 1}</span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}

function MissingWorkout({
  onBack,
}: {
  onBack: () => void;
}) {
  return (
    <main className="mx-auto flex min-h-[65vh] max-w-2xl items-center justify-center">
      <Card className="w-full p-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]">
          <Dumbbell size={28} />
        </div>

        <h1 className="mt-6 text-3xl font-black text-[var(--text)]">
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
    </main>
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
    <main className="mx-auto flex min-h-[65vh] max-w-2xl items-center justify-center">
      <Card className="w-full p-8 md:p-10">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--warning-soft)] text-[var(--warning)]">
          <TriangleAlert size={25} />
        </div>

        <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-[var(--primary)]">
          Workout already active
        </p>

        <h1 className="mt-2 text-3xl font-black tracking-tight text-[var(--text)]">
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
    </main>
  );
}

function SessionLoading() {
  return (
    <main
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
    </main>
  );
}
