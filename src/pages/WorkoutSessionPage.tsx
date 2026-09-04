import {
  ArrowLeft,
  ArrowRight,
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

import type { Routine } from "../types/Routine";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

import { routines } from "../data/routines";
import { useRestTimer } from "../hooks/useRestTimer";
import { useWorkoutSession } from "../hooks/useWorkoutSession";
import { useWorkoutTimer } from "../hooks/useWorkoutTimer";
import { useRoutineStore } from "../stores/routineStore";
import { useActiveWorkoutStore } from "../stores/activeWorkoutStore";
import { authClient } from "../lib/auth-client";

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

  const startWorkout =
    useActiveWorkoutStore(
      (state) => state.startWorkout,
    );

  const clearActiveWorkout =
    useActiveWorkoutStore(
      (state) =>
        state.clearActiveWorkout,
    );

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
    if (
      sessionPending ||
      !session?.user ||
      !routine ||
      !routineId
    ) {
      return;
    }

    const current =
      useActiveWorkoutStore.getState()
        .activeWorkout;

    /*
     * No active workout:
     * create one for this route.
     */
    if (!current) {
      startWorkout(
        routine,
        session.user.id,
      );

      return;
    }

    /*
     * Active workout belongs to another user.
     * This can happen when accounts change on the
     * same browser. Start a clean workout for the
     * current account.
     */
    if (
      current.userId !==
      session.user.id
    ) {
      startWorkout(
        routine,
        session.user.id,
      );
    }
  }, [
    routine,
    routineId,
    session?.user,
    sessionPending,
    startWorkout,
  ]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, []);

  if (sessionPending) {
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
    createSession,
  } =
    useWorkoutSession();

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
    <main className="mx-auto max-w-5xl space-y-6 pb-10">
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
        {workoutExercises.map(
          (workoutExercise) => (
            <ExerciseCard
              key={
                workoutExercise.exercise.id
              }
              workoutExercise={
                workoutExercise
              }
              updateWeight={
                updateWeight
              }
              commitWeight={
                commitWeight
              }
              updateReps={
                updateReps
              }
              commitReps={
                commitReps
              }
              updateCompleted={
                handleToggleSet
              }
            />
          ),
        )}
      </section>

      <WorkoutFinishCard
        completedSets={
          completedSets
        }
        totalSets={totalSets}
        isFinishing={isFinishing}
        onFinish={() =>
          void finishWorkout()
        }
      />
    </main>
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
      className="mx-auto max-w-5xl space-y-6"
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