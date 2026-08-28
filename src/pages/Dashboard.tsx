import {
  ArrowRight,
  Dumbbell,
  Flame,
  Target,
  TrendingUp,
} from "lucide-react";
import { NavLink } from "react-router-dom";

import { dashboard } from "../data/dashboard";
import { authClient } from "../lib/auth-client";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import ProgressBar from "../components/ui/ProgressBar";

export default function Dashboard() {
  const {
    stats,
    todayWorkout,
    weeklyGoal,
  } = dashboard;

  const {
    data: session,
    isPending,
  } = authClient.useSession();

  const isLoggedIn = Boolean(session?.user);

  const userName =
    session?.user?.name ?? "";

  const weeklyPercentage =
    weeklyGoal.target > 0
      ? Math.round(
          (weeklyGoal.completed /
            weeklyGoal.target) *
            100,
        )
      : 0;

  const greetingTitle = isPending
    ? "MoosclesPro."
    : isLoggedIn
      ? `Welcome back, ${userName}.`
      : "Start your journey.";

  const greetingSubtitle = isPending
    ? "Your training journey starts here."
    : isLoggedIn
      ? "Stay consistent, keep progressing, and let the results follow."
      : "Track workouts, build routines, and see how MoosclesPro can help you train smarter.";

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
      {!isLoggedIn && !isPending && (
        <section className="rounded-2xl border border-[var(--primary)]/20 bg-[var(--primary-soft)] px-5 py-4">
          <p className="text-sm leading-relaxed text-[var(--text)]">
            <span className="font-bold">
              You're viewing a demo dashboard.
            </span>{" "}
            Create an account to track your own workouts,
            routines, progress, and training history.
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
          value={stats.streak.toString()}
          suffix="days"
        />

        <StatCard
          icon={<Dumbbell size={20} />}
          label={
            isLoggedIn
              ? "Workouts"
              : "Example Workouts"
          }
          value={stats.workouts.toString()}
          suffix="completed"
        />

        <StatCard
          icon={<TrendingUp size={20} />}
          label={
            isLoggedIn
              ? "Total Volume"
              : "Example Volume"
          }
          value={stats.volume.toLocaleString()}
          suffix="kg"
        />

        <StatCard
          icon={<Target size={20} />}
          label={
            isLoggedIn
              ? "Training Hours"
              : "Example Hours"
          }
          value={stats.hours.toString()}
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
                {todayWorkout.exercises} exercises
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
                isLoggedIn
                  ? "/workouts"
                  : "/register"
              }
            >
              <Button
                variant="secondary"
                className="mt-8"
              >
                {isLoggedIn
                  ? "Continue Workout"
                  : "Get Started"}

                <ArrowRight size={17} />
              </Button>
            </NavLink>
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
                {weeklyGoal.completed}/
                {weeklyGoal.target}
              </span>

              <span className="text-sm text-[var(--text-muted)]">
                {weeklyPercentage}%
              </span>
            </div>

            <ProgressBar
              value={weeklyGoal.completed}
              max={weeklyGoal.target}
              className="mt-4"
            />

            <p className="mt-4 text-sm leading-relaxed text-[var(--text-muted)]">
              {isLoggedIn
                ? weeklyGoal.completed >=
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