import {
  ArrowRight,
  Dumbbell,
  Flame,
  Target,
  TrendingUp,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  useEffect,
  useState,
} from "react";

import {
  dashboardApi,
  type DashboardData,
} from "../api/dashboard";

import { authClient } from "../lib/auth-client";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import ProgressBar from "../components/ui/ProgressBar";

export default function Dashboard() {
  const {
    data: session,
    isPending: isSessionPending,
  } = authClient.useSession();

  const [
    dashboardData,
    setDashboardData,
  ] = useState<DashboardData | null>(
    null,
  );

  const [
    isLoading,
    setIsLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<string | null>(null);

  useEffect(() => {
    if (
      isSessionPending ||
      !session?.user
    ) {
      return;
    }

    let cancelled = false;

    async function loadDashboard() {
      try {
        setIsLoading(true);
        setError(null);

        const data =
          await dashboardApi.get();

        if (!cancelled) {
          setDashboardData(data);
        }
      } catch (requestError) {
        console.error(
          "Failed to load dashboard:",
          requestError,
        );

        if (!cancelled) {
          setError(
            "Could not load your dashboard data. Please try again.",
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

  if (isSessionPending || isLoading) {
    return (
      <DashboardSkeleton />
    );
  }

  if (error || !dashboardData) {
    return (
      <DashboardError
        message={
          error ??
          "Your dashboard could not be loaded."
        }
      />
    );
  }

  const {
    stats,
    todayWorkout,
    weeklyGoal,
  } = dashboardData;

const userName =
  session?.user?.name?.trim() ??
  "";

const firstName =
  userName.split(/\s+/)[0] ||
  "there";

  const weeklyPercentage =
    weeklyGoal.target > 0
      ? Math.min(
          100,
          Math.round(
            (weeklyGoal.completed /
              weeklyGoal.target) *
              100,
          ),
        )
      : 0;

  return (
    <div className="space-y-10">
      {/* Header */}

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

            <p className="mt-3 max-w-2xl text-lg text-[var(--text-muted)]">
              Stay consistent, keep progressing, and
              let the results follow.
            </p>
          </div>

          <NavLink to="/workouts">
            <Button>
              Start Workout
              <ArrowRight size={18} />
            </Button>
          </NavLink>
        </div>
      </section>

      {/* Stats */}

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<Flame size={20} />}
          label="Current Streak"
          value={stats.streak.toString()}
          suffix="days"
        />

        <StatCard
          icon={<Dumbbell size={20} />}
          label="Workouts"
          value={stats.workouts.toString()}
          suffix="completed"
        />

        <StatCard
          icon={<TrendingUp size={20} />}
          label="Total Volume"
          value={stats.volume.toLocaleString()}
          suffix="kg"
        />

        <StatCard
          icon={<Target size={20} />}
          label="Training Hours"
          value={stats.hours.toString()}
          suffix="hours"
        />
      </section>

      {/* Main content */}

      <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Today's workout */}

        <Card className="relative overflow-hidden p-8 md:p-10">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[var(--primary)]/10 blur-3xl" />

          <div className="relative">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
              Today's Workout
            </p>

            {todayWorkout ? (
              <>
                <h2 className="mt-4 text-3xl font-black text-[var(--text)]">
                  {todayWorkout.title}
                </h2>

                <p className="mt-3 max-w-xl leading-relaxed text-[var(--text-muted)]">
                  Focus on controlled reps, progressive
                  overload, and quality movement.
                </p>

                <div className="mt-8 flex flex-wrap gap-3 text-sm text-[var(--text-muted)]">
                  <WorkoutTag>
                    {todayWorkout.exercises}{" "}
                    exercises
                  </WorkoutTag>

                  <WorkoutTag>
                    ~
                    {todayWorkout.duration.replace(
                      " min",
                      "",
                    )}{" "}
                    min
                  </WorkoutTag>
                </div>

                <NavLink
                  to={`/workout/${todayWorkout.routineId}`}
                >
                  <Button
                    variant="secondary"
                    className="mt-8"
                  >
                    Start Workout
                    <ArrowRight size={17} />
                  </Button>
                </NavLink>
              </>
            ) : (
              <>
                <h2 className="mt-4 text-3xl font-black text-[var(--text)]">
                  Create your first routine
                </h2>

                <p className="mt-3 max-w-xl leading-relaxed text-[var(--text-muted)]">
                  Build a routine and it will become
                  available from your dashboard.
                </p>

                <NavLink to="/workouts/create">
                  <Button
                    variant="secondary"
                    className="mt-8"
                  >
                    Create Routine
                    <ArrowRight size={17} />
                  </Button>
                </NavLink>
              </>
            )}
          </div>
        </Card>

        {/* Weekly goal */}

        <Card className="p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
            Weekly Goal
          </p>

          <h2 className="mt-3 text-2xl font-bold text-[var(--text)]">
            Keep the streak alive.
          </h2>

          <div className="mt-8">
            <div className="flex items-end justify-between">
              <span className="text-4xl font-black text-[var(--text)]">
                {weeklyGoal.completed}/
                {weeklyGoal.target}
              </span>

              <span className="text-sm text-[var(--text-muted)]">
                {weeklyPercentage}%
              </span>
            </div>

            <ProgressBar
              value={
                weeklyGoal.completed
              }
              max={
                weeklyGoal.target
              }
              className="mt-4"
            />

            <p className="mt-4 text-sm leading-relaxed text-[var(--text-muted)]">
              {weeklyGoal.completed >=
              weeklyGoal.target
                ? "You've hit your goal this week. Great work."
                : `${
                    weeklyGoal.target -
                    weeklyGoal.completed
                  } more workout${
                    weeklyGoal.target -
                      weeklyGoal.completed ===
                    1
                      ? ""
                      : "s"
                  } to reach your goal.`}
            </p>
          </div>
        </Card>
      </section>

      {/* Mindset */}

      <section className="rounded-[var(--radius-xl)] bg-[var(--text)] p-8 text-[var(--surface)] shadow-[var(--shadow-md)] md:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
          Mindset
        </p>

        <blockquote className="mt-4 max-w-4xl text-2xl font-bold leading-relaxed md:text-3xl">
          “You don't need to be motivated every day. You
          just need to keep showing up.”
        </blockquote>

        <NavLink to="/mindset">
          <Button
            variant="ghost"
            className="mt-7 px-0 text-[var(--surface)] hover:bg-transparent hover:text-[var(--primary)]"
          >
            Explore Mindset
            <ArrowRight size={16} />
          </Button>
        </NavLink>
      </section>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  suffix,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  suffix: string;
}) {
  return (
    <Card className="p-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">
        {icon}
      </div>

      <p className="mt-6 text-sm text-[var(--text-muted)]">
        {label}
      </p>

      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-3xl font-black text-[var(--text)]">
          {value}
        </span>

        <span className="text-sm text-[var(--text-muted)]">
          {suffix}
        </span>
      </div>
    </Card>
  );
}

function WorkoutTag({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-2">
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
      <div>
        <div className="h-4 w-28 animate-pulse rounded bg-[var(--surface-soft)]" />

        <div className="mt-4 h-12 w-full max-w-2xl animate-pulse rounded-xl bg-[var(--surface-soft)]" />

        <div className="mt-4 h-6 w-full max-w-xl animate-pulse rounded-lg bg-[var(--surface-soft)]" />
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({
          length: 4,
        }).map(
          (_, index) => (
            <Card
              key={index}
              className="p-6"
            >
              <div className="h-10 w-10 animate-pulse rounded-xl bg-[var(--surface-soft)]" />

              <div className="mt-6 h-4 w-24 animate-pulse rounded bg-[var(--surface-soft)]" />

              <div className="mt-2 h-9 w-28 animate-pulse rounded-lg bg-[var(--surface-soft)]" />
            </Card>
          ),
        )}
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

          <div className="mt-8 h-4 w-full animate-pulse rounded-full bg-[var(--surface-soft)]" />
        </Card>
      </div>
    </div>
  );
}

function DashboardError({
  message,
}: {
  message: string;
}) {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center">
      <section
        role="alert"
        className="w-full rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-10 text-center shadow-sm"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]">
          <TrendingUp size={28} />
        </div>

        <h1 className="mt-6 text-2xl font-black text-[var(--text)]">
          Dashboard unavailable
        </h1>

        <p className="mt-3 text-[var(--text-muted)]">
          {message}
        </p>

        <button
          type="button"
          onClick={() =>
            window.location.reload()
          }
          className="mt-6 rounded-xl bg-[var(--primary)] px-6 py-3 font-semibold text-white transition hover:bg-[var(--primary-hover)]"
        >
          Try Again
        </button>
      </section>
    </main>
  );
}