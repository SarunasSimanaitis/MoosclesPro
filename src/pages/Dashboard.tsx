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
  type DashboardStats,
  type DashboardTodayWorkout,
} from "../api/dashboard";

import { dashboard } from "../data/dashboard";
import { authClient } from "../lib/auth-client";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import ProgressBar from "../components/ui/ProgressBar";

export default function Dashboard() {
  const {
    stats: demoStats,
    todayWorkout: demoTodayWorkout,
    weeklyGoal: demoWeeklyGoal,
  } = dashboard;

  const {
    data: session,
    isPending: isSessionPending,
  } = authClient.useSession();

  const isLoggedIn = Boolean(
    session?.user,
  );

  const [
    dashboardData,
    setDashboardData,
  ] = useState<DashboardData | null>(null);

  const [
    isDashboardLoading,
    setIsDashboardLoading,
  ] = useState(false);

  const [
    dashboardError,
    setDashboardError,
  ] = useState<string | null>(null);

  useEffect(() => {
    if (
      isSessionPending ||
      !isLoggedIn
    ) {
      setDashboardData(null);
      setDashboardError(null);
      setIsDashboardLoading(false);

      return;
    }

    let cancelled = false;

    async function loadDashboard() {
      try {
        setIsDashboardLoading(true);
        setDashboardError(null);

        const data =
          await dashboardApi.get();

        if (!cancelled) {
          setDashboardData(data);
        }
      } catch (error) {
        console.error(
          "Failed to load dashboard:",
          error,
        );

        if (!cancelled) {
          setDashboardError(
            "Could not load your latest dashboard data.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsDashboardLoading(false);
        }
      }
    }

    void loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [
    isLoggedIn,
    isSessionPending,
  ]);

  const stats: DashboardStats =
    isLoggedIn && dashboardData
      ? dashboardData.stats
      : demoStats;

  const currentWeeklyGoal =
    isLoggedIn && dashboardData
      ? dashboardData.weeklyGoal
      : demoWeeklyGoal;

  const todayWorkout: DashboardTodayWorkout | null =
    isLoggedIn && dashboardData
      ? dashboardData.todayWorkout
      : {
          title: demoTodayWorkout.title,
          duration:
            demoTodayWorkout.duration,
          exercises:
            demoTodayWorkout.exercises,
          routineId: "",
        };

  const userName =
    session?.user?.name ?? "";

  const greetingTitle =
    isSessionPending
      ? "MoosclesPro."
      : isLoggedIn
        ? `Welcome back, ${userName}.`
        : "Start your journey.";

  const greetingSubtitle =
    isSessionPending
      ? "Your training journey starts here."
      : isLoggedIn
        ? "Stay consistent, keep progressing, and let the results follow."
        : "Track workouts, build routines, and see how MoosclesPro can help you train smarter.";

  const weeklyPercentage =
    currentWeeklyGoal.target > 0
      ? Math.min(
          100,
          Math.round(
            (currentWeeklyGoal.completed /
              currentWeeklyGoal.target) *
              100,
          ),
        )
      : 0;

  const isStatsReady =
    !isLoggedIn ||
    !isDashboardLoading;

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
              {greetingTitle}
            </h1>

            <p className="mt-3 max-w-2xl text-lg text-[var(--text-muted)]">
              {greetingSubtitle}
            </p>
          </div>

          <NavLink
            to={
              isLoggedIn
                ? "/workouts"
                : "/register"
            }
          >
            <Button>
              {isLoggedIn
                ? "Start Workout"
                : "Create Account"}

              <ArrowRight size={18} />
            </Button>
          </NavLink>
        </div>
      </section>

      {/* Demo notice */}

      {!isLoggedIn &&
        !isSessionPending && (
          <section className="rounded-2xl border border-[var(--primary)]/20 bg-[var(--primary-soft)] px-5 py-4">
            <p className="text-sm leading-relaxed text-[var(--text)]">
              <span className="font-bold">
                You're viewing a demo dashboard.
              </span>{" "}
              Create an account to track your own
              workouts, routines, progress, and
              training history.
            </p>
          </section>
        )}

      {/* Dashboard error */}

      {dashboardError && (
        <section className="rounded-2xl border border-[var(--danger)]/30 bg-[var(--danger)]/10 px-5 py-4">
          <p className="text-sm font-medium text-[var(--danger)]">
            {dashboardError}
          </p>
        </section>
      )}

      {/* Stats */}

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<Flame size={20} />}
          label={
            isLoggedIn
              ? "Current Streak"
              : "Example Streak"
          }
          value={
            isStatsReady
              ? stats.streak.toString()
              : "..."
          }
          suffix="days"
        />

        <StatCard
          icon={<Dumbbell size={20} />}
          label={
            isLoggedIn
              ? "Workouts"
              : "Example Workouts"
          }
          value={
            isStatsReady
              ? stats.workouts.toString()
              : "..."
          }
          suffix="completed"
        />

        <StatCard
          icon={<TrendingUp size={20} />}
          label={
            isLoggedIn
              ? "Total Volume"
              : "Example Volume"
          }
          value={
            isStatsReady
              ? stats.volume.toLocaleString()
              : "..."
          }
          suffix="kg"
        />

        <StatCard
          icon={<Target size={20} />}
          label={
            isLoggedIn
              ? "Training Hours"
              : "Example Hours"
          }
          value={
            isStatsReady
              ? stats.hours.toString()
              : "..."
          }
          suffix="hours"
        />
      </section>

      {/* Main Content */}

      <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Today's Workout */}

        <Card className="relative overflow-hidden p-8 md:p-10">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[var(--primary)]/10 blur-3xl" />

          <div className="relative">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
              {isLoggedIn
                ? "Today's Workout"
                : "Example Workout"}
            </p>

            {isLoggedIn &&
            isDashboardLoading ? (
              <>
                <div className="mt-4 h-9 w-64 animate-pulse rounded-lg bg-[var(--surface-soft)]" />

                <div className="mt-4 h-12 max-w-xl animate-pulse rounded-lg bg-[var(--surface-soft)]" />

                <div className="mt-8 flex gap-3">
                  <div className="h-10 w-32 animate-pulse rounded-full bg-[var(--surface-soft)]" />

                  <div className="h-10 w-24 animate-pulse rounded-full bg-[var(--surface-soft)]" />
                </div>
              </>
            ) : todayWorkout ? (
              <>
                <h2 className="mt-4 text-3xl font-black text-[var(--text)]">
                  {todayWorkout.title}
                </h2>

                <p className="mt-3 max-w-xl leading-relaxed text-[var(--text-muted)]">
                  {isLoggedIn
                    ? "Focus on controlled reps, progressive overload, and quality movement."
                    : "Explore structured workouts, track your sets, and build consistent training habits."}
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
                  to={
                    isLoggedIn &&
                    todayWorkout.routineId
                      ? `/workout/${todayWorkout.routineId}`
                      : "/register"
                  }
                >
                  <Button
                    variant="secondary"
                    className="mt-8"
                  >
                    {isLoggedIn
                      ? "Start Workout"
                      : "Get Started"}

                    <ArrowRight size={17} />
                  </Button>
                </NavLink>
              </>
            ) : (
              <>
                <h2 className="mt-4 text-3xl font-black text-[var(--text)]">
                  No workout yet
                </h2>

                <p className="mt-3 max-w-xl leading-relaxed text-[var(--text-muted)]">
                  Create your first routine and
                  it will appear here on your
                  dashboard.
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

        {/* Weekly Goal */}

        <Card className="p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
            {isLoggedIn
              ? "Weekly Goal"
              : "Example Weekly Goal"}
          </p>

          <h2 className="mt-3 text-2xl font-bold text-[var(--text)]">
            {isLoggedIn
              ? "Keep the streak alive."
              : "Build a consistent routine."}
          </h2>

          <div className="mt-8">
            <div className="flex items-end justify-between">
              <span className="text-4xl font-black text-[var(--text)]">
                {currentWeeklyGoal.completed}/
                {currentWeeklyGoal.target}
              </span>

              <span className="text-sm text-[var(--text-muted)]">
                {weeklyPercentage}%
              </span>
            </div>

            <ProgressBar
              value={
                currentWeeklyGoal.completed
              }
              max={
                currentWeeklyGoal.target
              }
              className="mt-4"
            />

            <p className="mt-4 text-sm leading-relaxed text-[var(--text-muted)]">
              {isLoggedIn
                ? currentWeeklyGoal.completed >=
                  currentWeeklyGoal.target
                  ? "You've hit your goal this week. Great work."
                  : `${
                      currentWeeklyGoal.target -
                      currentWeeklyGoal.completed
                    } more workout${
                      currentWeeklyGoal.target -
                        currentWeeklyGoal.completed ===
                      1
                        ? ""
                        : "s"
                    } to reach your goal.`
                : "Create an account to set goals and track your weekly progress."}
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
          “You don't need to be motivated every day. You just need to keep
          showing up.”
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

type StatCardProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  suffix: string;
};

function StatCard({
  icon,
  label,
  value,
  suffix,
}: StatCardProps) {
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