import {
  Activity,
  BarChart3,
  Clock3,
  Dumbbell,
  Flame,
  TrendingUp,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  statisticsApi,
  type ExerciseStatistic,
  type StatisticsData,
} from "../api/statistics";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import StatCard from "../components/ui/StatCard";

export default function Statistics() {
  const [statistics, setStatistics] = useState<StatisticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await statisticsApi.get();
        if (!cancelled) setStatistics(data);
      } catch (requestError) {
        console.error("Failed to load statistics:", requestError);
        if (!cancelled) setError("Could not load your statistics.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const weeklyTotal = useMemo(
    () =>
      statistics?.weeklyActivity.reduce(
        (total, week) => total + week.workouts,
        0,
      ) ?? 0,
    [statistics],
  );

  const weeklyAverage =
    statistics && statistics.weeklyActivity.length > 0
      ? (weeklyTotal / statistics.weeklyActivity.length).toFixed(1)
      : "0";

  const maxWeeklyWorkouts = Math.max(
    1,
    ...(statistics?.weeklyActivity.map((week) => week.workouts) ?? [0]),
  );

  if (isLoading) return <StatisticsSkeleton />;

  if (error || !statistics) {
    return (
      <main className="mx-auto max-w-2xl">
        <Card className="p-7 text-center sm:p-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--danger-soft)] text-[var(--danger)]">
            <BarChart3 size={26} />
          </div>
          <h1 className="mt-5 text-2xl font-black">Stats are unavailable</h1>
          <p className="mt-2 leading-relaxed text-[var(--text-muted)]">
            {error ?? "There was a problem loading your statistics."}
          </p>
          <Button variant="secondary" className="mt-6" onClick={() => window.location.reload()}>
            Try again
          </Button>
        </Card>
      </main>
    );
  }

  return (
    <main className="space-y-6 sm:space-y-8">
      <PageHeader
        eyebrow="Progress"
        icon={<TrendingUp size={15} />}
        title="Statistics"
        description="Useful numbers about the work you've already done."
      />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={<Dumbbell size={20} />} label="Workouts" value={statistics.overview.workouts.toString()} suffix="completed" />
        <StatCard icon={<TrendingUp size={20} />} label="Volume" value={statistics.overview.volume.toLocaleString()} suffix="kg" />
        <StatCard icon={<Clock3 size={20} />} label="Training time" value={statistics.overview.trainingHours.toLocaleString(undefined, { maximumFractionDigits: 1 })} suffix="hours" tone="success" />
        <StatCard icon={<Flame size={20} />} label="Streak" value={statistics.overview.streak.toString()} suffix={statistics.overview.streak === 1 ? "day" : "days"} tone="success" />
      </section>

      <Card className="p-5 sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[var(--primary)]">
              <Activity size={15} />
              Consistency
            </p>
            <h2 className="mt-2 text-2xl font-black">Last 8 weeks</h2>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              How often you've trained, week by week.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Insight label="8-week total" value={weeklyTotal.toString()} />
            <Insight label="Average" value={weeklyAverage} />
          </div>
        </div>

        <div className="mt-7 grid grid-cols-8 items-end gap-2 sm:gap-3">
          {statistics.weeklyActivity.map((week) => {
            const height =
              week.workouts === 0
                ? 6
                : Math.max(12, (week.workouts / maxWeeklyWorkouts) * 100);

            const highest =
              week.workouts === maxWeeklyWorkouts && week.workouts > 0;

            return (
              <div key={week.start} className="flex min-w-0 flex-col items-center gap-2">
                <span className="text-xs font-black text-[var(--text)]">
                  {week.workouts}
                </span>
                <div className="flex h-36 w-full items-end rounded-[var(--radius-md)] bg-[var(--surface-soft)] p-1">
                  <div
                    className={`w-full rounded-[var(--radius-sm)] ${highest ? "bg-[var(--primary)]" : "bg-[var(--success)]"}`}
                    style={{ height: `${height}%` }}
                  />
                </div>
                <span className="truncate text-[10px] font-bold text-[var(--text-muted)] sm:text-xs">
                  {week.label}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      <section className="grid gap-4 lg:grid-cols-2">
        <ExerciseRanking
          eyebrow="Frequency"
          title="Most trained"
          description="Exercises you keep coming back to."
          exercises={statistics.topExercises}
          valueFormatter={(item) =>
            `${item.workouts} ${item.workouts === 1 ? "workout" : "workouts"}`
          }
          tone="primary"
        />
        <ExerciseRanking
          eyebrow="Volume"
          title="Highest volume"
          description="Exercises contributing the most total weight."
          exercises={statistics.topVolumeExercises}
          valueFormatter={(item) => `${item.volume.toLocaleString()} kg`}
          tone="primary"
        />
      </section>

      {statistics.topExercises.length === 0 &&
        statistics.topVolumeExercises.length === 0 && (
          <Card className="border-dashed p-7 text-center sm:p-10">
            <BarChart3 size={25} className="mx-auto text-[var(--text-muted)]" />
            <h2 className="mt-4 text-xl font-black">More data will appear here</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[var(--text-muted)]">
              Complete a few workouts and your exercise trends will start to fill in.
            </p>
          </Card>
        )}
    </main>
  );
}

function Insight({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[var(--radius-md)] bg-[var(--surface-soft)] px-3 py-2.5 text-center">
      <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[var(--text-muted)]">{label}</p>
      <p className="mt-1 text-sm font-black">{value}</p>
    </div>
  );
}

function ExerciseRanking({
  eyebrow,
  title,
  description,
  exercises,
  valueFormatter,
  tone,
}: {
  eyebrow: string;
  title: string;
  description: string;
  exercises: ExerciseStatistic[];
  valueFormatter: (exercise: ExerciseStatistic) => string;
  tone: "primary" | "success";
}) {
  const color =
    tone === "primary" ? "var(--primary)" : "var(--primary)";
  const bg =
    tone === "primary" ? "var(--primary-soft)" : "var(--primary-soft)";

  return (
    <Card className="p-5 sm:p-7">
      <p className="text-xs font-black uppercase tracking-[0.18em]" style={{ color }}>
        {eyebrow}
      </p>
      <h2 className="mt-2 text-2xl font-black">{title}</h2>
      <p className="mt-1 text-sm leading-relaxed text-[var(--text-muted)]">{description}</p>

      {exercises.length === 0 ? (
        <div className="mt-6 rounded-[var(--radius-md)] border border-dashed border-[var(--border-strong)] p-6 text-center">
          <p className="font-semibold">Not enough data yet</p>
          <p className="mt-1 text-sm text-[var(--text-muted)]">Complete more workouts first.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-2">
          {exercises.map((exercise, index) => (
            <div key={exercise.exerciseId} className="flex items-center gap-3 rounded-[var(--radius-md)] bg-[var(--surface-soft)] p-3.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-black" style={{ backgroundColor: bg, color }}>
                {index + 1}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold">{exercise.name}</p>
                <p className="mt-1 text-xs font-medium text-[var(--text-muted)]">
                  {exercise.sets} {exercise.sets === 1 ? "set" : "sets"}
                </p>
              </div>
              <span className="shrink-0 text-right text-sm font-black">
                {valueFormatter(exercise)}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function StatisticsSkeleton() {
  return (
    <main className="space-y-6" role="status" aria-label="Loading statistics">
      <div className="space-y-3">
        <div className="h-4 w-24 animate-pulse rounded bg-[var(--surface-soft)]" />
        <div className="h-10 w-56 animate-pulse rounded-xl bg-[var(--surface-soft)]" />
        <div className="h-5 w-full max-w-xl animate-pulse rounded bg-[var(--surface-soft)]" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="h-32 animate-pulse rounded-[var(--radius-xl)] bg-[var(--surface-soft)]" />
        ))}
      </div>
      <div className="h-80 animate-pulse rounded-[var(--radius-xl)] bg-[var(--surface-soft)]" />
      <div className="grid gap-4 lg:grid-cols-2">
        {[1, 2].map((item) => (
          <div key={item} className="h-72 animate-pulse rounded-[var(--radius-xl)] bg-[var(--surface-soft)]" />
        ))}
      </div>
    </main>
  );
}