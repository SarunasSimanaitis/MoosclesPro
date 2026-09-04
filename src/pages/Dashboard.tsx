import {
  ArrowRight,
  Dumbbell,
  Flame,
  RefreshCw,
  Target,
  TrendingUp,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  dashboardApi,
  type DashboardData,
} from "../api/dashboard";
import { ApiError } from "../api/client";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import ProgressBar from "../components/ui/ProgressBar";
import StatCard from "../components/ui/StatCard";
import { authClient } from "../lib/auth-client";

const WEEKLY_GOAL_TARGET = 5;

function getFirstName(
  name?: string | null,
) {
  const normalizedName =
    name?.trim() ?? "";

  return (
    normalizedName.split(/\s+/)[0] ||
    "there"
  );
}

function formatVolume(volume: number) {
  return volume.toLocaleString();
}

function formatHours(hours: number) {
  return hours.toLocaleString(
    undefined,
    {
      maximumFractionDigits: 1,
    },
  );
}

export default function Dashboard() {
  const navigate = useNavigate();

  const {
    data: session,
    isPending: isSessionPending,
  } = authClient.useSession();

  const [
    dashboardData,
    setDashboardData,
  ] = useState<DashboardData | null>(null);

  const [
    isLoading,
    setIsLoading,
  ] = useState(false);

  const [
    isRetryingAuth,
    setIsRetryingAuth,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<string | null>(null);

  const firstName = useMemo(
    () =>
      getFirstName(
        session?.user?.name,
      ),
    [session?.user?.name],
  );

  useEffect(() => {
    if (
      isSessionPending ||
      !session?.user
    ) {
      return;
    }

    let cancelled = false;

    async function loadDashboard() {
      setIsLoading(true);
      setError(null);

      try {
        const data =
          await dashboardApi.get();

        if (cancelled) {
          return;
        }

        setDashboardData(data);
      } catch (requestError) {
        if (
          !cancelled &&
          requestError instanceof ApiError &&
          requestError.status === 401
        ) {
          try {
            setIsRetryingAuth(true);

            const refreshedSession =
              await authClient.getSession();

            if (
              cancelled
            ) {
              return;
            }

            if (
              refreshedSession.data?.user
            ) {
              const data =
                await dashboardApi.get();

              if (!cancelled) {
                setDashboardData(data);
              }

              return;
            }

            setError(
              "Your session could not be verified. Please sign in again.",
            );
          } catch (retryError) {
            if (!cancelled) {
              console.error(
                "Failed to refresh dashboard session:",
                retryError,
              );

              setError(
                "Your session could not be verified. Please sign in again.",
              );
            }
          } finally {
            if (!cancelled) {
              setIsRetryingAuth(false);
            }
          }

          return;
        }

        if (!cancelled) {
          console.error(
            "Failed to load dashboard:",
            requestError,
          );

          setError(
            "We couldn't load your training data right now.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [
    isSessionPending,
    session?.user,
  ]);

  if (
    isSessionPending ||
    isLoading ||
    isRetryingAuth
  ) {
    return <DashboardSkeleton />;
  }

  if (!session?.user) {
    return null;
  }

  if (error || !dashboardData) {
    const requiresSignIn =
      error?.includes(
        "session could not be verified",
      ) ?? false;

    return (
      <DashboardError
        message={
          error ??
          "Your dashboard could not be loaded."
        }
        requiresSignIn={
          requiresSignIn
        }
        onRetry={() => {
          if (requiresSignIn) {
            navigate("/login");
            return;
          }

          window.location.reload();
        }}
      />
    );
  }

  const {
    stats,
    todayWorkout,
    weeklyGoal,
  } = dashboardData;

  const weeklyTarget =
    weeklyGoal.target ||
    WEEKLY_GOAL_TARGET;

  const weeklyCompleted =
    Math.max(
      0,
      weeklyGoal.completed,
    );

  const weeklyPercentage =
    weeklyTarget > 0
      ? Math.min(
          100,
          Math.round(
            (weeklyCompleted /
              weeklyTarget) *
              100,
          ),
        )
      : 0;

  const remaining = Math.max(
    0,
    weeklyTarget -
      weeklyCompleted,
  );

  return (
    <div className="space-y-10">
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--primary)]">
          Dashboard
        </p>

        <div className="mt-3 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-[var(--text)] md:text-5xl">
              Welcome back,{" "}
              {firstName}.
            </h1>

            <p className="mt-3 max-w-2xl text-lg leading-relaxed text-[var(--text-muted)]">
              Stay consistent, keep
              progressing, and let the
              results follow.
            </p>
          </div>

          <NavLink to="/workouts">
            <Button>
              Start workout
              <ArrowRight size={18} />
            </Button>
          </NavLink>
        </div>
      </section>

      <section
        aria-label="Training overview"
        className="grid gap-5 md:grid-cols-2 xl:grid-cols-4"
      >
        <StatCard
          icon={<Flame size={20} />}
          label="Current streak"
          value={stats.streak.toString()}
          suffix={
            stats.streak === 1
              ? "day"
              : "days"
          }
        />

        <StatCard
          icon={<Dumbbell size={20} />}
          label="Workouts"
          value={stats.workouts.toString()}
          suffix="completed"
        />

        <StatCard
          icon={<TrendingUp size={20} />}
          label="Total volume"
          value={formatVolume(
            stats.volume,
          )}
          suffix="kg"
        />

        <StatCard
          icon={<Target size={20} />}
          label="Training time"
          value={formatHours(
            stats.hours,
          )}
          suffix={
            stats.hours === 1
              ? "hour"
              : "hours"
          }
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Card className="relative overflow-hidden p-8 md:p-10">
          <div
            aria-hidden="true"
            className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[var(--primary)] opacity-10 blur-3xl"
          />

          <div className="relative">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
              Today's workout
            </p>

            {todayWorkout ? (
              <>
                <h2 className="mt-4 text-3xl font-black tracking-tight text-[var(--text)] md:text-4xl">
                  {todayWorkout.title}
                </h2>

                <p className="mt-3 max-w-xl leading-relaxed text-[var(--text-muted)]">
                  Focus on controlled reps,
                  progressive overload, and
                  quality movement.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <WorkoutTag>
                    <Dumbbell size={15} />
                    {todayWorkout.exercises}{" "}
                    exercises
                  </WorkoutTag>

                  <WorkoutTag>
                    {todayWorkout.duration}
                  </WorkoutTag>
                </div>

                <NavLink
                  to={`/workout/${todayWorkout.routineId}`}
                >
                  <Button
                    variant="secondary"
                    className="mt-8"
                  >
                    Start workout
                    <ArrowRight size={17} />
                  </Button>
                </NavLink>
              </>
            ) : (
              <>
                <h2 className="mt-4 text-3xl font-black tracking-tight text-[var(--text)] md:text-4xl">
                  Build your first routine
                </h2>

                <p className="mt-3 max-w-xl leading-relaxed text-[var(--text-muted)]">
                  Create a routine that
                  fits your goals,
                  equipment, and training
                  style. Your next workout
                  will appear here.
                </p>

                <NavLink to="/workouts/create">
                  <Button
                    variant="secondary"
                    className="mt-8"
                  >
                    Create routine
                    <ArrowRight size={17} />
                  </Button>
                </NavLink>
              </>
            )}
          </div>
        </Card>

        <Card className="p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
            Weekly goal
          </p>

          <div className="mt-3 flex items-end justify-between gap-4">
            <h2 className="text-2xl font-black tracking-tight text-[var(--text)]">
              Keep showing up.
            </h2>

            <span className="shrink-0 text-sm font-semibold text-[var(--text-muted)]">
              {weeklyPercentage}%
            </span>
          </div>

          <div className="mt-8">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black tracking-tight text-[var(--text)]">
                {weeklyCompleted}
              </span>

              <span className="text-lg font-semibold text-[var(--text-muted)]">
                / {weeklyTarget}
              </span>
            </div>

            <ProgressBar
              value={weeklyCompleted}
              max={weeklyTarget}
              label="Weekly workout goal"
              className="mt-4"
            />

            <p className="mt-4 text-sm leading-relaxed text-[var(--text-muted)]">
              {remaining === 0
                ? "You've hit your goal this week. Great work."
                : `${remaining} more workout${
                    remaining === 1
                      ? ""
                      : "s"
                  } to reach your weekly goal.`}
            </p>
          </div>

          {remaining > 0 && (
            <NavLink
              to="/workouts"
              className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)] transition-opacity hover:opacity-80"
            >
              Find a workout
              <ArrowRight size={15} />
            </NavLink>
          )}
        </Card>
      </section>

      <section className="relative overflow-hidden rounded-[var(--radius-xl)] bg-[var(--feature-background)] p-8 shadow-[var(--shadow-md)] md:p-10">
        <div
          aria-hidden="true"
          className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[var(--primary)] opacity-10 blur-3xl"
        />

        <div className="relative">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
            Mindset
          </p>

          <blockquote className="mt-4 max-w-4xl text-2xl font-bold leading-relaxed text-[var(--feature-text)] md:text-3xl">
            “You don't need to be
            motivated every day. You
            just need to keep showing
            up.”
          </blockquote>

          <NavLink to="/mindset">
            <Button
              variant="ghost"
              className="mt-7 px-0 text-[var(--feature-text)] hover:bg-transparent hover:text-[var(--primary)]"
            >
              Explore mindset
              <ArrowRight size={16} />
            </Button>
          </NavLink>
        </div>
      </section>
    </div>
  );
}

function WorkoutTag({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-2 text-sm font-medium text-[var(--text-muted)]">
      {children}
    </span>
  );
}

function DashboardSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading dashboard"
      className="space-y-10"
    >
      <span className="sr-only">
        Loading your dashboard
      </span>

      <div>
        <div className="h-4 w-28 animate-pulse rounded bg-[var(--surface-soft)]" />
        <div className="mt-4 h-12 w-full max-w-2xl animate-pulse rounded-xl bg-[var(--surface-soft)]" />
        <div className="mt-4 h-6 w-full max-w-xl animate-pulse rounded-lg bg-[var(--surface-soft)]" />
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({
          length: 4,
        }).map((_, index) => (
          <Card
            key={index}
            className="p-6"
          >
            <div className="h-10 w-10 animate-pulse rounded-[var(--radius-md)] bg-[var(--surface-soft)]" />
            <div className="mt-6 h-4 w-24 animate-pulse rounded bg-[var(--surface-soft)]" />
            <div className="mt-2 h-9 w-28 animate-pulse rounded-lg bg-[var(--surface-soft)]" />
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Card className="p-8 md:p-10">
          <div className="h-4 w-36 animate-pulse rounded bg-[var(--surface-soft)]" />
          <div className="mt-5 h-10 w-64 animate-pulse rounded-lg bg-[var(--surface-soft)]" />
          <div className="mt-4 h-5 w-full max-w-xl animate-pulse rounded-lg bg-[var(--surface-soft)]" />
        </Card>

        <Card className="p-8">
          <div className="h-4 w-32 animate-pulse rounded bg-[var(--surface-soft)]" />
          <div className="mt-4 h-8 w-56 animate-pulse rounded-lg bg-[var(--surface-soft)]" />
          <div className="mt-8 h-10 w-28 animate-pulse rounded-lg bg-[var(--surface-soft)]" />
          <div className="mt-4 h-3 w-full animate-pulse rounded-full bg-[var(--surface-soft)]" />
        </Card>
      </div>

      <div className="h-64 animate-pulse rounded-[var(--radius-xl)] bg-[var(--surface-soft)]" />
    </div>
  );
}

function DashboardError({
  message,
  requiresSignIn,
  onRetry,
}: {
  message: string;
  requiresSignIn: boolean;
  onRetry: () => void;
}) {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl items-center justify-center">
      <Card
        role="alert"
        className="w-full p-8 text-center md:p-10"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[var(--radius-md)] bg-[var(--primary-soft)] text-[var(--primary)]">
          {requiresSignIn ? (
            <Target size={25} />
          ) : (
            <TrendingUp size={25} />
          )}
        </div>

        <h1 className="mt-6 text-2xl font-black tracking-tight text-[var(--text)]">
          {requiresSignIn
            ? "Your session needs attention"
            : "Dashboard unavailable"}
        </h1>

        <p className="mx-auto mt-3 max-w-lg leading-relaxed text-[var(--text-muted)]">
          {message}
        </p>

        <Button
          variant="secondary"
          onClick={onRetry}
          className="mt-7"
        >
          {requiresSignIn ? (
            <>
              Sign in again
              <ArrowRight size={17} />
            </>
          ) : (
            <>
              Try again
              <RefreshCw size={16} />
            </>
          )}
        </Button>
      </Card>
    </main>
  );
}