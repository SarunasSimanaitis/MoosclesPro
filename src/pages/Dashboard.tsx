import {
  ArrowRight,
  Dumbbell,
  Flame,
  History,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { ApiError } from "../api/client";
import { dashboardApi, type DashboardData } from "../api/dashboard";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import ProgressBar from "../components/ui/ProgressBar";
import { authClient } from "../lib/auth-client";

const WEEKLY_GOAL_TARGET = 5;

function getFirstName(name?: string | null) {
  return name?.trim().split(/\s+/)[0] || "there";
}

function formatVolume(value: number) {
  return value.toLocaleString();
}

function formatHours(value: number) {
  return value.toLocaleString(undefined, { maximumFractionDigits: 1 });
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: session, isPending: isSessionPending } = authClient.useSession();

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRetryingAuth, setIsRetryingAuth] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const firstName = useMemo(
    () => getFirstName(session?.user?.name),
    [session?.user?.name],
  );

  useEffect(() => {
    if (isSessionPending || !session?.user) return;

    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);

      try {
        setDashboardData(await dashboardApi.get());
      } catch (requestError) {
        if (
          requestError instanceof ApiError &&
          requestError.status === 401
        ) {
          try {
            setIsRetryingAuth(true);
            const refreshed = await authClient.getSession();

            if (refreshed.data?.user) {
              setDashboardData(await dashboardApi.get());
            } else {
              setError("Your session could not be verified. Please sign in again.");
            }
          } catch {
            setError("Your session could not be verified. Please sign in again.");
          } finally {
            if (!cancelled) setIsRetryingAuth(false);
          }
          return;
        }

        if (!cancelled) {
          console.error("Failed to load dashboard:", requestError);
          setError("We couldn't load your training data right now.");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [isSessionPending, session?.user]);

  if (isSessionPending || isLoading || isRetryingAuth) {
    return <DashboardSkeleton />;
  }

  if (!session?.user) return null;

  if (error || !dashboardData) {
    const requiresSignIn = error?.includes("session could not be verified") ?? false;

    return (
      <main className="mx-auto max-w-2xl">
        <Card className="p-7 text-center sm:p-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--danger-soft)] text-[var(--danger)]">
            <Target size={26} />
          </div>
          <h1 className="mt-5 text-2xl font-black">Something went wrong</h1>
          <p className="mx-auto mt-2 max-w-md leading-relaxed text-[var(--text-muted)]">
            {error ?? "Your dashboard could not be loaded."}
          </p>
          <Button
            variant="secondary"
            onClick={() => {
              if (requiresSignIn) navigate("/login");
              else window.location.reload();
            }}
            className="mt-6"
          >
            {requiresSignIn ? "Sign in again" : "Try again"}
          </Button>
        </Card>
      </main>
    );
  }

  const { stats, todayWorkout, weeklyGoal } = dashboardData;
  const weeklyTarget = weeklyGoal.target || WEEKLY_GOAL_TARGET;
  const weeklyCompleted = Math.max(0, weeklyGoal.completed);
  const weeklyPercentage =
    weeklyTarget > 0
      ? Math.min(100, Math.round((weeklyCompleted / weeklyTarget) * 100))
      : 0;
  const remaining = Math.max(0, weeklyTarget - weeklyCompleted);

  return (
    <main className="space-y-6 sm:space-y-8">
      <PageHeader
        eyebrow="Today"
        title={`Good to see you, ${firstName}.`}
        description="Keep the next step simple. Pick a workout and get moving."
        icon={<Sparkles size={15} />}
        action={
          <NavLink to="/workouts" className="block w-full sm:w-auto">
            <Button className="w-full sm:w-auto">
              Start workout
              <ArrowRight size={17} />
            </Button>
          </NavLink>
        }
      />

      <section className="grid gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardStat icon={<Flame size={20} />} label="Streak" value={stats.streak} suffix={stats.streak === 1 ? "day" : "days"} tone="primary" />
        <DashboardStat icon={<Dumbbell size={20} />} label="Workouts" value={stats.workouts} suffix="completed" tone="success" />
        <DashboardStat icon={<TrendingUp size={20} />} label="Volume" value={formatVolume(stats.volume)} suffix="kg" tone="primary" />
        <DashboardStat icon={<Target size={20} />} label="Training time" value={formatHours(stats.hours)} suffix={stats.hours === 1 ? "hour" : "hours"} tone="danger" />
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
        <Card className="p-5 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="inline-flex min-h-7 items-center rounded-full bg-[var(--primary-soft)] px-3 py-1 text-xs font-bold text-[var(--primary)]">
                {todayWorkout ? "Up next" : "Get started"}
              </span>
              <h2 className="mt-4 text-2xl font-black tracking-tight sm:text-3xl">
                {todayWorkout?.title ?? "Build your first routine"}
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--text-muted)] sm:text-base">
                {todayWorkout
                  ? "Your next planned session is ready. Everything you need is waiting here."
                  : "Create a simple routine once, then come back and press start whenever you're ready."}
              </p>
            </div>
            <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--success-soft)] text-[var(--success)] sm:flex">
              <Dumbbell size={22} />
            </div>
          </div>

          {todayWorkout && (
            <div className="mt-6 grid grid-cols-2 gap-3 sm:max-w-sm">
              <InfoTile label="Exercises" value={todayWorkout.exercises.toString()} />
              <InfoTile label="Time" value={todayWorkout.duration} />
            </div>
          )}

          <NavLink
            to={todayWorkout ? `/workout/${todayWorkout.routineId}` : "/workouts/create"}
            className="mt-6 inline-flex w-full sm:w-auto"
          >
            <Button variant="secondary" className="w-full sm:w-auto">
              {todayWorkout ? "Start this workout" : "Create routine"}
              <ArrowRight size={16} />
            </Button>
          </NavLink>
        </Card>

        <Card className="border-[var(--success)]/25 bg-[var(--success-soft)] p-5 sm:p-7">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--success)]">
            This week
          </p>
          <div className="mt-3 flex items-end justify-between gap-3">
            <div>
              <p className="text-4xl font-black tracking-tight">{weeklyCompleted}</p>
              <p className="text-sm font-semibold text-[var(--text-muted)]">
                of {weeklyTarget} workouts
              </p>
            </div>
            <span className="text-sm font-black text-[var(--success)]">
              {weeklyPercentage}%
            </span>
          </div>
          <ProgressBar value={weeklyCompleted} max={weeklyTarget} label="Weekly workout goal" className="mt-5" />
          <p className="mt-4 text-sm leading-relaxed text-[var(--text-muted)]">
            {remaining === 0
              ? "Goal reached. Nice work."
              : `${remaining} more workout${remaining === 1 ? "" : "s"} to hit your goal.`}
          </p>
          <NavLink
            to="/history"
            className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[var(--text)]"
          >
            See your history
            <ArrowRight size={15} />
          </NavLink>
        </Card>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <QuickLink
          icon={<Dumbbell size={20} />}
          title="Find an exercise"
          description="Find a movement and see how to perform it."
          href="/exercises"
          tone="violet"
        />
        <QuickLink
          icon={<History size={20} />}
          title="See your history"
          description="Look back at completed sessions and volume."
          href="/history"
          tone="rose"
        />
      </section>
    </main>
  );
}

function DashboardStat({
  icon,
  label,
  value,
  suffix,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  suffix: string;
  tone: "primary" | "accent" | "violet" | "rose";
}) {
  const styles = {
    primary: ["var(--primary-soft)", "var(--primary)"],
    accent: ["var(--success-soft)", "var(--success)"],
    violet: ["var(--primary-soft)", "var(--primary)"],
    rose: ["var(--danger-soft)", "var(--danger)"],
  }[tone];

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-[var(--text-muted)]">{label}</p>
        <div
          className="flex h-10 w-10 items-center justify-center rounded-2xl"
          style={{ backgroundColor: styles[0], color: styles[1] }}
        >
          {icon}
        </div>
      </div>
      <div className="mt-5 flex items-baseline gap-2">
        <span className="text-3xl font-black tracking-tight">{value}</span>
        <span className="text-sm font-semibold text-[var(--text-muted)]">{suffix}</span>
      </div>
    </Card>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[var(--radius-md)] bg-[var(--surface-soft)] p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--text-muted)]">{label}</p>
      <p className="mt-1 font-black">{value}</p>
    </div>
  );
}

function QuickLink({
  icon,
  title,
  description,
  href,
  tone,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  tone: "violet" | "rose";
}) {
  const styles = tone === "violet"
    ? ["var(--primary-soft)", "var(--primary)"]
    : ["var(--danger-soft)", "var(--danger)"];

  return (
    <NavLink
      to={href}
      className="group flex min-h-28 items-center gap-4 rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-5 transition-colors hover:bg-[var(--surface-hover)]"
    >
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
        style={{ backgroundColor: styles[0], color: styles[1] }}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="font-black">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-[var(--text-muted)]">{description}</p>
      </div>
      <ArrowRight size={17} className="shrink-0 text-[var(--text-muted)] transition-transform group-hover:translate-x-0.5" />
    </NavLink>
  );
}

function DashboardSkeleton() {
  return (
    <main className="space-y-6">
      <div className="space-y-3">
        <div className="h-4 w-20 animate-pulse rounded bg-[var(--surface-soft)]" />
        <div className="h-10 w-80 max-w-full animate-pulse rounded-xl bg-[var(--surface-soft)]" />
        <div className="h-5 w-full max-w-xl animate-pulse rounded bg-[var(--surface-soft)]" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="h-32 animate-pulse rounded-[var(--radius-xl)] bg-[var(--surface-soft)]" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="h-72 animate-pulse rounded-[var(--radius-xl)] bg-[var(--surface-soft)]" />
        <div className="h-72 animate-pulse rounded-[var(--radius-xl)] bg-[var(--surface-soft)]" />
      </div>
    </main>
  );
}