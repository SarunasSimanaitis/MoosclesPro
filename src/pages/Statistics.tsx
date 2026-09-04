import {
  Activity,
  BarChart3,
  Clock3,
  Dumbbell,
  Flame,
  TrendingUp,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  statisticsApi,
  type ExerciseStatistic,
  type StatisticsData,
} from "../api/statistics";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import StatCard from "../components/ui/StatCard";

export default function Statistics() {
  const [
    statistics,
    setStatistics,
  ] = useState<StatisticsData | null>(
    null,
  );

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

    async function loadStatistics() {
      try {
        setIsLoading(true);
        setError(null);

        const data =
          await statisticsApi.get();

        if (!cancelled) {
          setStatistics(data);
        }
      } catch (requestError) {
        console.error(
          "Failed to load statistics:",
          requestError,
        );

        if (!cancelled) {
          setError(
            "Could not load your statistics.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadStatistics();

    return () => {
      cancelled = true;
    };
  }, []);

  const weeklyTotal = useMemo(
    () =>
      statistics?.weeklyActivity.reduce(
        (total, week) =>
          total + week.workouts,
        0,
      ) ?? 0,
    [statistics],
  );

  const weeklyAverage =
    statistics &&
    statistics.weeklyActivity.length >
      0
      ? (
          weeklyTotal /
          statistics.weeklyActivity.length
        ).toFixed(1)
      : "0";

  const maxWeeklyWorkouts =
    Math.max(
      1,
      ...(statistics?.weeklyActivity.map(
        (week) => week.workouts,
      ) ?? [0]),
    );

  if (isLoading) {
    return <StatisticsSkeleton />;
  }

  if (error || !statistics) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-2xl items-center justify-center">
        <Card
          role="alert"
          className="w-full p-10 text-center"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]">
            <BarChart3 size={28} />
          </div>

          <h1 className="mt-6 text-2xl font-black text-[var(--text)]">
            Statistics unavailable
          </h1>

          <p className="mt-3 text-[var(--text-muted)]">
            {error ??
              "There was a problem loading your statistics."}
          </p>

          <Button
            variant="secondary"
            onClick={() =>
              window.location.reload()
            }
            className="mt-7"
          >
            Try again
          </Button>
        </Card>
      </main>
    );
  }

  const hasExerciseData =
    statistics.topExercises.length >
      0 ||
    statistics.topVolumeExercises.length >
      0;

  return (
    <main className="mx-auto max-w-6xl space-y-10">
      {/* Header */}
      <section>
        <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.25em] text-[var(--primary)]">
          <TrendingUp size={16} />
          Performance
        </p>

        <h1 className="mt-3 text-4xl font-black tracking-tight text-[var(--text)] md:text-5xl">
          Statistics
        </h1>

        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-[var(--text-muted)]">
          Turn your training history into
          useful feedback and spot the habits
          that are actually moving you forward.
        </p>
      </section>

      {/* Overview */}
      <section
        aria-label="Training overview"
        className="grid gap-5 md:grid-cols-2 xl:grid-cols-4"
      >
        <StatCard
          icon={<Dumbbell size={20} />}
          label="Total workouts"
          value={statistics.overview.workouts.toString()}
          suffix={
            statistics.overview.workouts ===
            1
              ? "completed"
              : "completed"
          }
        />

        <StatCard
          icon={<TrendingUp size={20} />}
          label="Total volume"
          value={statistics.overview.volume.toLocaleString()}
          suffix="kg"
        />

        <StatCard
          icon={<Clock3 size={20} />}
          label="Training time"
          value={statistics.overview.trainingHours.toLocaleString(
            undefined,
            {
              maximumFractionDigits: 1,
            },
          )}
          suffix="hours"
        />

        <StatCard
          icon={<Flame size={20} />}
          label="Current streak"
          value={statistics.overview.streak.toString()}
          suffix={
            statistics.overview.streak ===
            1
              ? "day"
              : "days"
          }
        />
      </section>

      {/* Consistency */}
      <Card className="p-7 md:p-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
          <div>
            <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-[var(--primary)]">
              <Activity size={16} />
              Consistency
            </p>

            <h2 className="mt-2 text-2xl font-black tracking-tight text-[var(--text)]">
              Weekly activity
            </h2>

            <p className="mt-2 text-sm text-[var(--text-muted)]">
              Completed workouts over the last
              8 weeks.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <InsightStat
              label="8-week total"
              value={weeklyTotal.toString()}
            />

            <InsightStat
              label="Avg / week"
              value={weeklyAverage}
            />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-8 items-end gap-2 md:gap-4">
          {statistics.weeklyActivity.map(
            (week) => {
              const height =
                week.workouts === 0
                  ? 5
                  : Math.max(
                      10,
                      (week.workouts /
                        maxWeeklyWorkouts) *
                        100,
                    );

              const isCurrentHighest =
                week.workouts ===
                  maxWeeklyWorkouts &&
                week.workouts > 0;

              return (
                <div
                  key={week.start}
                  className="group flex min-w-0 flex-col items-center gap-3"
                >
                  <span className="text-xs font-black text-[var(--text)]">
                    {week.workouts}
                  </span>

                  <div className="flex h-40 w-full items-end rounded-[var(--radius-md)] bg-[var(--surface-soft)] p-1">
                    <div
                      className={`
                        w-full
                        rounded-[var(--radius-sm)]
                        transition-[height,opacity]
                        duration-500
                        ${
                          isCurrentHighest
                            ? "bg-[var(--primary)]"
                            : "bg-[var(--primary)] opacity-75"
                        }
                      `}
                      style={{
                        height: `${height}%`,
                      }}
                    />
                  </div>

                  <span className="truncate text-center text-[10px] font-semibold text-[var(--text-muted)] md:text-xs">
                    {week.label}
                  </span>
                </div>
              );
            },
          )}
        </div>
      </Card>

      {/* Exercise insights */}
      <section className="grid gap-6 lg:grid-cols-2">
        <ExerciseRanking
          title="Most trained"
          eyebrow="Frequency"
          description="Exercises you've returned to most often."
          exercises={
            statistics.topExercises
          }
          valueFormatter={(exercise) =>
            `${exercise.workouts} ${
              exercise.workouts === 1
                ? "workout"
                : "workouts"
            }`
          }
        />

        <ExerciseRanking
          title="Highest volume"
          eyebrow="Volume"
          description="Exercises contributing the most total weight moved."
          exercises={
            statistics.topVolumeExercises
          }
          valueFormatter={(exercise) =>
            `${exercise.volume.toLocaleString()} kg`
          }
        />
      </section>

      {!hasExerciseData && (
        <Card className="border-dashed p-10 text-center">
          <BarChart3
            size={25}
            className="mx-auto text-[var(--text-muted)]"
          />

          <h2 className="mt-4 text-xl font-black text-[var(--text)]">
            Your exercise insights are waiting
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[var(--text-muted)]">
            Complete a few workouts and
            MoosclesPro will start showing which
            exercises you train most and where
            you're moving the most volume.
          </p>
        </Card>
      )}
    </main>
  );
}

function ExerciseRanking({
  eyebrow,
  title,
  description,
  exercises,
  valueFormatter,
}: {
  eyebrow: string;
  title: string;
  description: string;
  exercises: ExerciseStatistic[];
  valueFormatter: (
    exercise: ExerciseStatistic,
  ) => string;
}) {
  return (
    <Card className="p-7 md:p-8">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--primary)]">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-2xl font-black tracking-tight text-[var(--text)]">
        {title}
      </h2>

      <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
        {description}
      </p>

      {exercises.length === 0 ? (
        <EmptyStatistics />
      ) : (
        <div className="mt-7 space-y-3">
          {exercises.map(
            (
              exercise,
              index,
            ) => (
              <ExerciseRow
                key={
                  exercise.exerciseId
                }
                rank={index + 1}
                name={exercise.name}
                secondary={`${exercise.sets} ${
                  exercise.sets === 1
                    ? "set"
                    : "sets"
                }`}
                primary={valueFormatter(
                  exercise,
                )}
              />
            ),
          )}
        </div>
      )}
    </Card>
  );
}

function ExerciseRow({
  rank,
  name,
  secondary,
  primary,
}: {
  rank: number;
  name: string;
  secondary: string;
  primary: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-[var(--radius-md)] bg-[var(--surface-soft)] p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--surface)] text-sm font-black text-[var(--primary)] shadow-[var(--shadow-sm)]">
        {rank}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-bold text-[var(--text)]">
          {name}
        </p>

        <p className="mt-1 text-xs font-medium text-[var(--text-muted)]">
          {secondary}
        </p>
      </div>

      <span className="shrink-0 text-right text-sm font-black text-[var(--text)]">
        {primary}
      </span>
    </div>
  );
}

function InsightStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[var(--radius-md)] bg-[var(--surface-soft)] px-3 py-2.5 text-center">
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
        {label}
      </p>

      <p className="mt-0.5 text-sm font-black text-[var(--text)]">
        {value}
      </p>
    </div>
  );
}

function EmptyStatistics() {
  return (
    <div className="mt-7 rounded-[var(--radius-md)] border border-dashed border-[var(--border-strong)] p-8 text-center">
      <p className="font-semibold text-[var(--text)]">
        Not enough data yet
      </p>

      <p className="mt-1 text-sm text-[var(--text-muted)]">
        Complete more workouts to build this
        part of your training profile.
      </p>
    </div>
  );
}

function StatisticsSkeleton() {
  return (
    <main
      role="status"
      aria-label="Loading statistics"
      className="mx-auto max-w-6xl space-y-10"
    >
      <span className="sr-only">
        Loading your statistics
      </span>

      <div className="space-y-4">
        <div className="h-4 w-32 animate-pulse rounded bg-[var(--surface-soft)]" />
        <div className="h-12 w-64 animate-pulse rounded-xl bg-[var(--surface-soft)]" />
        <div className="h-6 w-full max-w-2xl animate-pulse rounded-lg bg-[var(--surface-soft)]" />
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map(
          (item) => (
            <div
              key={item}
              className="h-32 animate-pulse rounded-[var(--radius-xl)] bg-[var(--surface-soft)]"
            />
          ),
        )}
      </div>

      <div className="h-80 animate-pulse rounded-[var(--radius-xl)] bg-[var(--surface-soft)]" />

      <div className="grid gap-6 lg:grid-cols-2">
        {[1, 2].map((item) => (
          <div
            key={item}
            className="h-80 animate-pulse rounded-[var(--radius-xl)] bg-[var(--surface-soft)]"
          />
        ))}
      </div>
    </main>
  );
}