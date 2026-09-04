import {
  ArrowLeft,
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

import { workoutSessionsApi } from "../api/workoutSessions";

import ExerciseCard from "../components/workout/ExerciseCard";
import RestTimerPanel from "../components/workout/RestTimerPanel";
import WorkoutFinishCard from "../components/workout/WorkoutFinishCard";
import WorkoutSessionHeader from "../components/workout/WorkoutSessionHeader";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

import { routines } from "../data/routines";
import { useRestTimer } from "../hooks/useRestTimer";
import { useWorkoutSession } from "../hooks/useWorkoutSession";
import { useWorkoutTimer } from "../hooks/useWorkoutTimer";
import { useRoutineStore } from "../stores/routineStore";

import type { Routine } from "../types/Routine";

export default function WorkoutSessionPage() {
  const navigate = useNavigate();
  const { routineId } = useParams<{
    routineId: string;
  }>();

  const customRoutines =
    useRoutineStore(
      (state) => state.customRoutines,
    );

  const allRoutines = useMemo(
    () => [
      ...routines,
      ...customRoutines,
    ],
    [customRoutines],
  );

  const routine = allRoutines.find(
    (item) => item.id === routineId,
  );

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, []);

  if (!routine) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center">
        <Card className="w-full p-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]">
            <Dumbbell size={28} />
          </div>

          <h1 className="mt-6 text-3xl font-black tracking-tight text-[var(--text)]">
            Workout not found
          </h1>

          <p className="mx-auto mt-3 max-w-md text-[var(--text-muted)]">
            The routine you're trying to
            start doesn't exist or is no longer
            available.
          </p>

          <Button
            variant="secondary"
            onClick={() =>
              navigate("/workouts")
            }
            className="mt-7"
          >
            <ArrowLeft size={17} />
            Back to workouts
          </Button>
        </Card>
      </main>
    );
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

type WorkoutSessionProps = {
  routine: Routine;
  onBack: () => void;
};

function WorkoutSession({
  routine,
  onBack,
}: WorkoutSessionProps) {
  const navigate = useNavigate();

  const {
    startedAt,
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
  } = useWorkoutSession(routine);

  const {
    isPaused,
    formattedTime,
    togglePause,
  } = useWorkoutTimer(startedAt);

  const {
    restTime,
    restDuration,
    start: startRestTimer,
    stop: stopRestTimer,
    addTime,
    removeTime,
  } = useRestTimer();

  const [
    isFinishing,
    setIsFinishing,
  ] = useState(false);

  const [
    saveError,
    setSaveError,
  ] = useState<string | null>(null);

  const hasProgress =
    completedSets > 0 ||
    workoutExercises.some(
      (exercise) =>
        exercise.sets.some(
          (set) =>
            set.weight > 0 ||
            set.reps > 0,
        ),
    );

  /*
   * Protect an active workout from accidental
   * browser refresh/tab closing.
   */
  useEffect(() => {
    if (!hasProgress) {
      return;
    }

    function handleBeforeUnload(
      event: BeforeUnloadEvent,
    ) {
      event.preventDefault();
      event.returnValue = "";
    }

    window.addEventListener(
      "beforeunload",
      handleBeforeUnload,
    );

    return () => {
      window.removeEventListener(
        "beforeunload",
        handleBeforeUnload,
      );
    };
  }, [hasProgress]);

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
      (item) => item.id === setId,
    );

    if (!set) {
      return;
    }

    toggleSet(
      exerciseId,
      setId,
    );

    /*
     * Starting the rest timer when a set is
     * completed keeps the timer tied to the
     * user's actual workout action.
     */
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

  function handleBack() {
    if (!hasProgress) {
      onBack();
      return;
    }

    const confirmed =
      window.confirm(
        "You have an active workout. Leave without saving it?",
      );

    if (confirmed) {
      stopRestTimer();
      onBack();
    }
  }

  return (
    <main className="mx-auto max-w-5xl space-y-6 pb-12">
      {/* Navigation */}
      <button
        type="button"
        onClick={handleBack}
        className="
          inline-flex
          items-center
          gap-2
          text-sm
          font-semibold
          text-[var(--text-muted)]
          transition-colors
          hover:text-[var(--primary)]
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-[var(--primary)]
        "
      >
        <ArrowLeft size={17} />
        Exit workout
      </button>

      {/* Header */}
      <WorkoutSessionHeader
        routineName={routine.name}
        exerciseCount={
          workoutExercises.length
        }
        completedSets={completedSets}
        totalSets={totalSets}
        progress={progress}
        totalVolume={totalVolume}
        formattedTime={formattedTime}
        isPaused={isPaused}
        onTogglePause={
          togglePause
        }
      />

      {/* Save error */}
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

              <p className="mt-1 text-sm leading-relaxed text-[var(--danger)]">
                {saveError}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Rest timer */}
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

      {/* Exercises */}
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

      {/* Finish */}
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