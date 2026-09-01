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
  useState,
} from "react";

import {
  statisticsApi,
  type StatisticsData,
} from "../api/statistics";

import Card from "../components/ui/Card";

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

  if (isLoading) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-6xl items-center justify-center">
        <p className="text-sm font-medium text-[var(--text-muted)]">
          Loading your statistics...
        </p>
      </main>
    );
  }

  if (error || !statistics) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center">
        <section className="w-full rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-10 text-center shadow-sm">
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

  const maxWeeklyWorkouts =
    Math.max(
      1,
      ...statistics.weeklyActivity.map(
        (week) => week.workouts,
      ),
    );

  return (
    <main className="mx-auto max-w-6xl space-y-10">
      {/* Header */}

      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--primary)]">
          Performance
        </p>

        <h1 className="mt-3 text-4xl font-black tracking-tight text-[var(--text)] md:text-5xl">
          Statistics
        </h1>

        <p className="mt-3 max-w-2xl text-lg text-[var(--text-muted)]">
          See how your training is progressing over
          time.
        </p>
      </section>

      {/* Overview */}

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<Dumbbell size={20} />}
          label="Total Workouts"
          value={statistics.overview.workouts.toString()}
          suffix="completed"
        />

        <StatCard
          icon={<TrendingUp size={20} />}
          label="Total Volume"
          value={statistics.overview.volume.toLocaleString()}
          suffix="kg"
        />

        <StatCard
          icon={<Clock3 size={20} />}
          label="Training Time"
          value={statistics.overview.trainingHours.toString()}
          suffix="hours"
        />

        <StatCard
          icon={<Flame size={20} />}
          label="Current Streak"
          value={statistics.overview.streak.toString()}
          suffix="days"
        />
      </section>

      {/* Weekly Activity */}

      <Card className="p-7 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
              Consistency
            </p>

            <h2 className="mt-2 text-2xl font-black text-[var(--text)]">
              Weekly Activity
            </h2>

            <p className="mt-2 text-sm text-[var(--text-muted)]">
              Completed workouts over the last 8 weeks.
            </p>
          </div>

          <Activity
            size={22}
            className="text-[var(--primary)]"
          />
        </div>

        <div className="mt-8 grid grid-cols-8 items-end gap-2 md:gap-4">
          {statistics.weeklyActivity.map(
            (week) => {
              const height =
                Math.max(
                  8,
                  (week.workouts /
                    maxWeeklyWorkouts) *
                    100,
                );

              return (
                <div
                  key={week.start}
                  className="flex min-w-0 flex-col items-center gap-3"
                >
                  <span className="text-xs font-bold text-[var(--text)]">
                    {week.workouts}
                  </span>

                  <div className="flex h-40 w-full items-end rounded-xl bg-[var(--surface-soft)] p-1">
                    <div
                      className="w-full rounded-lg bg-[var(--primary)] transition-all duration-500"
                      style={{
                        height: `${height}%`,
                      }}
                    />
                  </div>

                  <span className="truncate text-center text-[10px] font-medium text-[var(--text-muted)] md:text-xs">
                    {week.label}
                  </span>
                </div>
              );
            },
          )}
        </div>
      </Card>

      {/* Exercise Statistics */}

      <section className="grid gap-6 lg:grid-cols-2">
        {/* Most trained */}

        <Card className="p-7 md:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
              Training Frequency
            </p>

            <h2 className="mt-2 text-2xl font-black text-[var(--text)]">
              Most Trained
            </h2>
          </div>

          {statistics.topExercises.length ===
          0 ? (
            <EmptyStatistics />
          ) : (
            <div className="mt-7 space-y-3">
              {statistics.topExercises.map(
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
                    primaryValue={`${exercise.workouts} workouts`}
                    secondaryValue={`${exercise.sets} sets`}
                  />
                ),
              )}
            </div>
          )}
        </Card>

        {/* Highest volume */}

        <Card className="p-7 md:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
              Volume
            </p>

            <h2 className="mt-2 text-2xl font-black text-[var(--text)]">
              Highest Volume
            </h2>
          </div>

          {statistics.topVolumeExercises.length ===
          0 ? (
            <EmptyStatistics />
          ) : (
            <div className="mt-7 space-y-3">
              {statistics.topVolumeExercises.map(
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
                    primaryValue={`${exercise.volume.toLocaleString()} kg`}
                    secondaryValue={`${exercise.sets} sets`}
                  />
                ),
              )}
            </div>
          )}
        </Card>
      </section>
    </main>
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

type ExerciseRowProps = {
  rank: number;
  name: string;
  primaryValue: string;
  secondaryValue: string;
};

function ExerciseRow({
  rank,
  name,
  primaryValue,
  secondaryValue,
}: ExerciseRowProps) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-[var(--surface-soft)] p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--surface)] text-sm font-black text-[var(--primary)]">
        {rank}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-bold text-[var(--text)]">
          {name}
        </p>

        <p className="mt-1 text-xs text-[var(--text-muted)]">
          {secondaryValue}
        </p>
      </div>

      <span className="shrink-0 text-sm font-bold text-[var(--text)]">
        {primaryValue}
      </span>
    </div>
  );
}

function EmptyStatistics() {
  return (
    <div className="mt-7 rounded-2xl border border-dashed border-[var(--border-strong)] p-8 text-center">
      <BarChart3
        size={24}
        className="mx-auto text-[var(--text-muted)]"
      />

      <p className="mt-3 font-semibold text-[var(--text)]">
        Not enough data yet
      </p>

      <p className="mt-1 text-sm text-[var(--text-muted)]">
        Complete some workouts to see your training
        statistics.
      </p>
    </div>
  );
}