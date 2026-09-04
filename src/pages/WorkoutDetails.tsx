import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Dumbbell,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  workoutSessionsApi,
} from "../api/workoutSessions";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import { routines } from "../data/routines";
import { useRoutineStore } from "../stores/routineStore";

import type { WorkoutSession } from "../types/WorkoutSession";

import {
  formatNumber,
  formatWorkoutDate,
  formatWorkoutTime,
  getCompletedSets,
  getSessionDuration,
  getSessionVolume,
  getTotalSets,
} from "../lib/workoutPresentation";

export default function WorkoutDetails() {
  const navigate = useNavigate();

  const {
    sessionId,
  } = useParams<{
    sessionId: string;
  }>();

  const customRoutines =
    useRoutineStore(
      (state) => state.customRoutines,
    );

  const [
    sessions,
    setSessions,
  ] = useState<WorkoutSession[]>([]);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadSessions() {
      try {
        setIsLoading(true);
        setError(null);

        const data =
          await workoutSessionsApi.list();

        if (!cancelled) {
          setSessions(data);
        }
      } catch (requestError) {
        console.error(
          "Failed to load workout session:",
          requestError,
        );

        if (!cancelled) {
          setError(
            "Could not load this workout.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadSessions();

    return () => {
      cancelled = true;
    };
  }, []);

  const allRoutines = useMemo(
    () => [
      ...routines,
      ...customRoutines,
    ],
    [customRoutines],
  );

  const session = useMemo(
    () =>
      sessions.find(
        (item) =>
          item.id === sessionId,
      ),
    [sessionId, sessions],
  );

  const routineName = useMemo(
    () =>
      allRoutines.find(
        (routine) =>
          routine.id ===
          session?.routineId,
      )?.name ??
      "Unknown Routine",
    [allRoutines, session?.routineId],
  );

  if (isLoading) {
    return <DetailsSkeleton />;
  }

  if (error || !session) {
    return (
      <main className="mx-auto flex min-h-[65vh] max-w-3xl items-center justify-center">
        <Card
          role="alert"
          className="w-full p-10 text-center"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--surface-soft)] text-[var(--text-muted)]">
            <Dumbbell size={28} />
          </div>

          <h1 className="mt-6 text-3xl font-black tracking-tight text-[var(--text)]">
            Workout not found
          </h1>

          <p className="mt-3 leading-relaxed text-[var(--text-muted)]">
            {error ??
              "This workout session could not be found."}
          </p>

          <Button
            variant="secondary"
            onClick={() =>
              navigate("/history")
            }
            className="mt-7"
          >
            <ArrowLeft size={17} />
            Back to history
          </Button>
        </Card>
      </main>
    );
  }

  const completedSets =
    getCompletedSets(session);

  const totalSets =
    getTotalSets(session);

  const totalVolume =
    getSessionVolume(session);

  const duration =
    getSessionDuration(session);

  const completionPercentage =
    totalSets > 0
      ? Math.round(
          (completedSets /
            totalSets) *
            100,
        )
      : 0;

  return (
    <main className="mx-auto max-w-5xl space-y-8 pb-10">
      <Link
        to="/history"
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
        Workout History
      </Link>

      {/* Header */}
      <section className="relative overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-sm)] md:p-8">
        <div
          aria-hidden="true"
          className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[var(--primary)] opacity-10 blur-3xl"
        />

        <div className="relative">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[var(--success)]">
                <CheckCircle2
                  size={16}
                />
                Completed workout
              </div>

              <h1 className="mt-4 text-3xl font-black tracking-tight text-[var(--text)] md:text-4xl">
                {routineName}
              </h1>

              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[var(--text-muted)]">
                <span className="inline-flex items-center gap-2">
                  <CalendarDays
                    size={16}
                  />
                  {formatWorkoutDate(
                    session.completedAt,
                  )}
                </span>

                <span className="inline-flex items-center gap-2">
                  <Clock3 size={16} />
                  {formatWorkoutTime(
                    session.completedAt,
                  )}
                </span>

                <span className="inline-flex items-center gap-2">
                  <Clock3 size={16} />
                  {duration}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <SummaryStat
                label="Exercises"
                value={session.exercises.length.toString()}
              />

              <SummaryStat
                label="Sets"
                value={`${completedSets}/${totalSets}`}
              />

              <SummaryStat
                label="Volume"
                value={`${formatNumber(
                  totalVolume,
                )} kg`}
              />
            </div>
          </div>

          <div className="mt-7 border-t border-[var(--border)] pt-6">
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="font-semibold text-[var(--text)]">
                Workout completion
              </span>

              <span className="font-black text-[var(--primary)]">
                {completionPercentage}%
              </span>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--surface-soft)]">
              <div
                className="h-full rounded-full bg-[var(--primary)] transition-[width] duration-500"
                style={{
                  width: `${completionPercentage}%`,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Exercise breakdown */}
      <section className="space-y-5">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--primary)]">
            Performance
          </p>

          <h2 className="mt-2 text-3xl font-black tracking-tight text-[var(--text)]">
            Exercise breakdown
          </h2>

          <p className="mt-2 text-[var(--text-muted)]">
            Every set from this workout,
            including what you completed and
            what you skipped.
          </p>
        </div>

        {session.exercises.map(
          (exercise) => {
            const exerciseCompletedSets =
              exercise.sets.filter(
                (set) => set.completed,
              ).length;

            const exerciseVolume =
              exercise.sets.reduce(
                (total, set) =>
                  total +
                  (set.completed
                    ? set.weight *
                      set.reps
                    : 0),
                0,
              );

            return (
              <Card
                key={exercise.exercise.id}
                className="overflow-hidden"
              >
                <div className="p-6 md:p-7">
                  <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                    <div className="min-w-0">
                      <div className="flex flex-wrap gap-2">
                        <Badge>
                          {
                            exercise
                              .exercise
                              .muscleGroup
                          }
                        </Badge>

                        <Badge>
                          {
                            exercise
                              .exercise
                              .equipment
                          }
                        </Badge>
                      </div>

                      <h3 className="mt-4 text-xl font-black tracking-tight text-[var(--text)] md:text-2xl">
                        {
                          exercise
                            .exercise.name
                        }
                      </h3>

                      <p className="mt-2 text-sm font-semibold text-[var(--primary)]">
                        Target:{" "}
                        {
                          exercise.targetSets
                        }{" "}
                        sets ·{" "}
                        {
                          exercise.targetReps
                        }
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge variant="success">
                        {exerciseCompletedSets}/
                        {
                          exercise.sets
                            .length
                        }{" "}
                        complete
                      </Badge>

                      <Badge>
                        {formatNumber(
                          exerciseVolume,
                        )}{" "}
                        kg
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto border-t border-[var(--border)]">
                  <table className="w-full min-w-[560px] border-collapse">
                    <thead>
                      <tr className="bg-[var(--surface-soft)] text-left text-xs font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                        <th className="px-5 py-3">
                          Set
                        </th>
                        <th className="px-5 py-3">
                          Weight
                        </th>
                        <th className="px-5 py-3">
                          Reps
                        </th>
                        <th className="px-5 py-3">
                          Volume
                        </th>
                        <th className="px-5 py-3 text-right">
                          Status
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {exercise.sets.map(
                        (set) => (
                          <tr
                            key={set.id}
                            className="border-t border-[var(--border)]"
                          >
                            <td className="px-5 py-4 font-bold text-[var(--text)]">
                              {set.order}
                            </td>

                            <td className="px-5 py-4 text-[var(--text)]">
                              {formatNumber(
                                set.weight,
                              )}{" "}
                              kg
                            </td>

                            <td className="px-5 py-4 text-[var(--text)]">
                              {set.reps}
                            </td>

                            <td className="px-5 py-4 text-[var(--text-muted)]">
                              {formatNumber(
                                set.weight *
                                  set.reps,
                              )}{" "}
                              kg
                            </td>

                            <td className="px-5 py-4 text-right">
                              {set.completed ? (
                                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--success)]">
                                  <CheckCircle2
                                    size={15}
                                  />
                                  Complete
                                </span>
                              ) : (
                                <span className="text-sm font-medium text-[var(--text-muted)]">
                                  Skipped
                                </span>
                              )}
                            </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            );
          },
        )}
      </section>

      {/* Footer action */}
      <Card className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-bold text-[var(--text)]">
            Ready for the next one?
          </p>

          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Keep the momentum going with another
            workout.
          </p>
        </div>

        <Button
          onClick={() =>
            navigate("/workouts")
          }
          className="w-full sm:w-auto"
        >
          Browse workouts
          <ArrowLeft
            size={17}
            className="rotate-180"
          />
        </Button>
      </Card>
    </main>
  );
}

function SummaryStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-20 rounded-[var(--radius-md)] bg-[var(--surface-soft)] px-3 py-3 text-center sm:min-w-24">
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
        {label}
      </p>

      <p className="mt-1 text-sm font-black text-[var(--text)]">
        {value}
      </p>
    </div>
  );
}

function DetailsSkeleton() {
  return (
    <main
      role="status"
      aria-label="Loading workout details"
      className="mx-auto max-w-5xl space-y-6"
    >
      <span className="sr-only">
        Loading workout details
      </span>

      <div className="h-5 w-36 animate-pulse rounded bg-[var(--surface-soft)]" />

      <div className="h-72 animate-pulse rounded-[var(--radius-xl)] bg-[var(--surface-soft)]" />

      {[1, 2].map((item) => (
        <div
          key={item}
          className="h-72 animate-pulse rounded-[var(--radius-xl)] bg-[var(--surface-soft)]"
        />
      ))}
    </main>
  );
}