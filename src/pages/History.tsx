import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Dumbbell,
  Filter,
  History as HistoryIcon,
  Weight,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import { workoutSessionsApi } from "../api/workoutSessions";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { routines } from "../data/routines";
import { useRoutineStore } from "../stores/routineStore";
import {
  formatNumber,
  formatWorkoutDate,
  getCompletedSets,
  getSessionDuration,
  getSessionVolume,
} from "../lib/workoutPresentation";

import type { WorkoutSession } from "../types/WorkoutSession";

type HistoryFilter =
  | "all"
  | "this-month"
  | "last-month";

export default function History() {
  const navigate = useNavigate();

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

  const [
    filter,
    setFilter,
  ] = useState<HistoryFilter>("all");

  useEffect(() => {
    let cancelled = false;

    async function loadSessions() {
      try {
        setIsLoading(true);
        setError(null);

        const data =
          await workoutSessionsApi.list();

        if (cancelled) {
          return;
        }

        const sorted =
          [...data].sort(
            (a, b) =>
              new Date(
                b.completedAt,
              ).getTime() -
              new Date(
                a.completedAt,
              ).getTime(),
          );

        setSessions(sorted);
      } catch (requestError) {
        console.error(
          "Failed to load workout history:",
          requestError,
        );

        if (!cancelled) {
          setError(
            "Could not load your workout history.",
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

  const routineNames = useMemo(
    () =>
      new Map(
        allRoutines.map(
          (routine) => [
            routine.id,
            routine.name,
          ],
        ),
      ),
    [allRoutines],
  );

  const filteredSessions =
    useMemo(() => {
      if (filter === "all") {
        return sessions;
      }

      const now = new Date();

      if (filter === "this-month") {
        return sessions.filter(
          (session) => {
            const date = new Date(
              session.completedAt,
            );

            return (
              date.getFullYear() ===
                now.getFullYear() &&
              date.getMonth() ===
                now.getMonth()
            );
          },
        );
      }

      const previousMonth =
        new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          1,
        );

      return sessions.filter(
        (session) => {
          const date = new Date(
            session.completedAt,
          );

          return (
            date.getFullYear() ===
              previousMonth.getFullYear() &&
            date.getMonth() ===
              previousMonth.getMonth()
          );
        },
      );
    }, [filter, sessions]);

  const totalVolume = useMemo(
    () =>
      sessions.reduce(
        (total, session) =>
          total +
          getSessionVolume(session),
        0,
      ),
    [sessions],
  );

  const totalCompletedSets =
    useMemo(
      () =>
        sessions.reduce(
          (total, session) =>
            total +
            getCompletedSets(session),
          0,
        ),
      [sessions],
    );

  if (isLoading) {
    return <HistorySkeleton />;
  }

  if (error) {
    return (
      <HistoryError
        message={error}
        onRetry={() =>
          window.location.reload()
        }
      />
    );
  }

  return (
    <main className="mx-auto max-w-6xl space-y-10">
      {/* Header */}
      <section>
        <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.25em] text-[var(--primary)]">
          <HistoryIcon size={16} />
          Training log
        </p>

        <div className="mt-3 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-[var(--text)] md:text-5xl">
              Workout History
            </h1>

            <p className="mt-3 max-w-2xl text-lg leading-relaxed text-[var(--text-muted)]">
              Look back at the work you've
              put in and keep building on it.
            </p>
          </div>

          <Button
            variant="secondary"
            onClick={() =>
              navigate("/workouts")
            }
          >
            <Dumbbell size={17} />
            Start a workout
          </Button>
        </div>
      </section>

      {/* Overview */}
      <section
        aria-label="History overview"
        className="grid gap-4 sm:grid-cols-3"
      >
        <HistoryMetric
          label="Workouts"
          value={sessions.length}
          suffix="completed"
        />

        <HistoryMetric
          label="Volume"
          value={formatNumber(
            totalVolume,
          )}
          suffix="kg"
        />

        <HistoryMetric
          label="Completed sets"
          value={totalCompletedSets}
          suffix="sets"
        />
      </section>

      {sessions.length === 0 ? (
        <EmptyHistory
          onStart={() =>
            navigate("/workouts")
          }
        />
      ) : (
        <>
          {/* Filters */}
          <Card className="p-4 md:p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">
                  <Filter size={16} />
                </div>

                <div>
                  <p className="text-sm font-bold text-[var(--text)]">
                    Training history
                  </p>

                  <p className="text-xs text-[var(--text-muted)]">
                    {filteredSessions.length}{" "}
                    {filteredSessions.length ===
                    1
                      ? "workout"
                      : "workouts"}{" "}
                    shown
                  </p>
                </div>
              </div>

              <div
                role="group"
                aria-label="History date filter"
                className="grid grid-cols-3 rounded-[var(--radius-md)] bg-[var(--surface-soft)] p-1"
              >
                <FilterOption
                  active={
                    filter === "all"
                  }
                  label="All"
                  onClick={() =>
                    setFilter("all")
                  }
                />

                <FilterOption
                  active={
                    filter ===
                    "this-month"
                  }
                  label="This month"
                  onClick={() =>
                    setFilter(
                      "this-month",
                    )
                  }
                />

                <FilterOption
                  active={
                    filter ===
                    "last-month"
                  }
                  label="Last month"
                  onClick={() =>
                    setFilter(
                      "last-month",
                    )
                  }
                />
              </div>
            </div>
          </Card>

          {filteredSessions.length === 0 ? (
            <Card className="p-10 text-center">
              <CalendarDays
                size={24}
                className="mx-auto text-[var(--text-muted)]"
              />

              <h2 className="mt-4 text-xl font-black text-[var(--text)]">
                Nothing here yet
              </h2>

              <p className="mt-2 text-sm text-[var(--text-muted)]">
                You don't have any workouts in
                this period.
              </p>

              <Button
                variant="secondary"
                onClick={() =>
                  setFilter("all")
                }
                className="mt-6"
              >
                Show all workouts
              </Button>
            </Card>
          ) : (
            <section className="space-y-4">
              {filteredSessions.map(
                (session) => (
                  <HistoryItem
                    key={session.id}
                    session={session}
                    routineName={
                      routineNames.get(
                        session.routineId,
                      ) ??
                      "Unknown Routine"
                    }
                    onView={() =>
                      navigate(
                        `/history/${session.id}`,
                      )
                    }
                  />
                ),
              )}
            </section>
          )}
        </>
      )}
    </main>
  );
}

function HistoryItem({
  session,
  routineName,
  onView,
}: {
  session: WorkoutSession;
  routineName: string;
  onView: () => void;
}) {
  const completedSets =
    getCompletedSets(session);

  const totalVolume =
    getSessionVolume(session);

  const duration =
    getSessionDuration(session);

  return (
    <Card
      hover
      className="p-6 md:p-7"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--success)]">
            <CheckCircle2 size={15} />
            Completed workout
          </div>

          <h2 className="mt-3 truncate text-2xl font-black tracking-tight text-[var(--text)] md:text-3xl">
            {routineName}
          </h2>

          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[var(--text-muted)]">
            <span className="inline-flex items-center gap-2">
              <CalendarDays size={15} />
              {formatWorkoutDate(
                session.completedAt,
              )}
            </span>

            <span className="inline-flex items-center gap-2">
              <Clock3 size={15} />
              {duration}
            </span>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onView}
          className="w-fit shrink-0 px-0 lg:ml-auto"
        >
          View details
          <ArrowRight size={16} />
        </Button>
      </div>

      <div className="mt-6 grid gap-3 border-t border-[var(--border)] pt-6 sm:grid-cols-3">
        <MiniMetric
          icon={<Dumbbell size={15} />}
          label="Exercises"
          value={
            session.exercises.length.toString()
          }
        />

        <MiniMetric
          icon={<CheckCircle2 size={15} />}
          label="Completed sets"
          value={
            completedSets.toString()
          }
        />

        <MiniMetric
          icon={<Weight size={15} />}
          label="Volume"
          value={`${formatNumber(
            totalVolume,
          )} kg`}
        />
      </div>
    </Card>
  );
}

function HistoryMetric({
  label,
  value,
  suffix,
}: {
  label: string;
  value: number | string;
  suffix: string;
}) {
  return (
    <Card className="p-5">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
        {label}
      </p>

      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-black text-[var(--text)]">
          {value}
        </span>

        <span className="text-xs font-semibold text-[var(--text-muted)]">
          {suffix}
        </span>
      </div>
    </Card>
  );
}

function MiniMetric({
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

function FilterOption({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`
        rounded-[var(--radius-sm)]
        px-3
        py-2
        text-xs
        font-bold
        transition-[background-color,color,box-shadow]
        duration-200
        ${
          active
            ? "bg-[var(--surface)] text-[var(--text)] shadow-[var(--shadow-sm)]"
            : "text-[var(--text-muted)] hover:text-[var(--text)]"
        }
      `}
    >
      {label}
    </button>
  );
}

function EmptyHistory({
  onStart,
}: {
  onStart: () => void;
}) {
  return (
    <Card className="border-dashed p-12 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]">
        <HistoryIcon size={28} />
      </div>

      <h2 className="mt-6 text-2xl font-black text-[var(--text)]">
        Your training story starts here
      </h2>

      <p className="mx-auto mt-2 max-w-md leading-relaxed text-[var(--text-muted)]">
        Complete your first workout and
        MoosclesPro will start building your
        training history.
      </p>

      <Button
        onClick={onStart}
        className="mt-7"
      >
        Start your first workout
        <ArrowRight size={17} />
      </Button>
    </Card>
  );
}

function HistorySkeleton() {
  return (
    <main
      role="status"
      aria-label="Loading workout history"
      className="mx-auto max-w-6xl space-y-8"
    >
      <span className="sr-only">
        Loading your workout history
      </span>

      <div className="space-y-4">
        <div className="h-4 w-32 animate-pulse rounded bg-[var(--surface-soft)]" />
        <div className="h-12 w-80 animate-pulse rounded-xl bg-[var(--surface-soft)]" />
        <div className="h-6 w-full max-w-2xl animate-pulse rounded-lg bg-[var(--surface-soft)]" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-24 animate-pulse rounded-[var(--radius-xl)] bg-[var(--surface-soft)]"
          />
        ))}
      </div>

      <div className="space-y-4">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-64 animate-pulse rounded-[var(--radius-xl)] bg-[var(--surface-soft)]"
          />
        ))}
      </div>
    </main>
  );
}

function HistoryError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl items-center justify-center">
      <Card
        role="alert"
        className="w-full p-10 text-center"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--danger-soft)] text-[var(--danger)]">
          <HistoryIcon size={24} />
        </div>

        <h1 className="mt-6 text-2xl font-black text-[var(--text)]">
          History unavailable
        </h1>

        <p className="mt-3 text-[var(--text-muted)]">
          {message}
        </p>

        <Button
          variant="secondary"
          onClick={onRetry}
          className="mt-7"
        >
          Try again
        </Button>
      </Card>
    </main>
  );
}