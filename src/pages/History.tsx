import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Dumbbell,
  Filter,
  History as HistoryIcon,
  Search,
  Trophy,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { workoutSessionsApi } from "../api/workoutSessions";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import StatCard from "../components/ui/StatCard";
import { routines } from "../data/routines";
import { useRoutineStore } from "../stores/routineStore";
import {
  formatWorkoutDate,
  getCompletedSets,
  getSessionDuration,
  getSessionVolume,
} from "../lib/workoutPresentation";
import type { WorkoutSession } from "../types/WorkoutSession";
import { getAppPreferences } from "../lib/preferences";
import { formatVolume, formatWeight } from "../lib/units";
import { collectPersonalRecords } from "../lib/personalRecords";

type HistoryFilter = "all" | "this-week" | "this-month" | "last-month";

export default function History() {
  const navigate = useNavigate();
  const customRoutines = useRoutineStore((state) => state.customRoutines);

  const [sessions, setSessions] = useState<WorkoutSession[]>(() => workoutSessionsApi.cachedList() ?? []);
  const [isLoading, setIsLoading] = useState(() => workoutSessionsApi.cachedList() === undefined);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<HistoryFilter>("all");
  const [search, setSearch] = useState("");
  const weightUnit = getAppPreferences().weightUnit;

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setError(null);
        const data = await workoutSessionsApi.list();

        if (!cancelled) {
          setSessions(
            [...data].sort(
              (a, b) =>
                new Date(b.completedAt).getTime() -
                new Date(a.completedAt).getTime(),
            ),
          );
        }
      } catch (requestError) {
        console.error("Failed to load workout history:", requestError);
        if (!cancelled) setError("Could not load your workout history.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const routineNames = useMemo(() => {
    const all = [...routines, ...customRoutines];
    return new Map(all.map((routine) => [routine.id, routine.name]));
  }, [customRoutines]);

  const filtered = useMemo(() => {
    const now = new Date();
    let periodSessions = sessions;

    if (filter === "this-week") {
      const startOfWeek = new Date(now);
      startOfWeek.setHours(0, 0, 0, 0);
      startOfWeek.setDate(now.getDate() - ((now.getDay() + 6) % 7));
      periodSessions = sessions.filter((session) => new Date(session.completedAt) >= startOfWeek);
    } else if (filter === "this-month") {
      periodSessions = sessions.filter((session) => {
        const date = new Date(session.completedAt);
        return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
      });
    } else if (filter === "last-month") {
      const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      periodSessions = sessions.filter((session) => {
        const date = new Date(session.completedAt);
        return date.getFullYear() === previousMonth.getFullYear() && date.getMonth() === previousMonth.getMonth();
      });
    }

    const query = search.trim().toLocaleLowerCase();
    if (!query) return periodSessions;
    return periodSessions.filter((session) => {
      const routineName = routineNames.get(session.routineId) ?? "Workout";
      return routineName.toLocaleLowerCase().includes(query) || session.exercises.some((exercise) =>
        exercise.exercise.name.toLocaleLowerCase().includes(query) || exercise.exercise.muscleGroup.toLocaleLowerCase().includes(query));
    });
  }, [filter, routineNames, search, sessions]);

  const totalVolume = useMemo(
    () => filtered.reduce((sum, session) => sum + getSessionVolume(session), 0),
    [filtered],
  );

  const totalCompletedSets = useMemo(
    () => filtered.reduce((sum, session) => sum + getCompletedSets(session), 0),
    [filtered],
  );

  const personalRecords = useMemo(
    () => collectPersonalRecords(sessions),
    [sessions],
  );

  const bestSet = useMemo(() => filtered.flatMap((session) => session.exercises.flatMap((exercise) =>
    exercise.sets.filter((set) => set.completed && set.weight > 0).map((set) => ({
      exerciseName: exercise.exercise.name,
      weight: set.weight,
      reps: set.reps,
    }))))
    .reduce<{ exerciseName: string; weight: number; reps: number } | null>((best, set) => !best || set.weight > best.weight ? set : best, null), [filtered]);

  const leadingFocus = useMemo(() => {
    const counts = new Map<string, number>();
    for (const session of filtered) {
      for (const exercise of session.exercises) {
        counts.set(exercise.exercise.muscleGroup, (counts.get(exercise.exercise.muscleGroup) ?? 0) + 1);
      }
    }
    return [...counts.entries()].sort((left, right) => right[1] - left[1])[0]?.[0] ?? null;
  }, [filtered]);

  if (isLoading) return <HistorySkeleton />;

  if (error) {
    return (
      <main className="mx-auto max-w-2xl">
        <Card className="p-7 text-center sm:p-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--danger-soft)] text-[var(--danger)]">
            <HistoryIcon size={25} />
          </div>
          <h1 className="mt-5 text-2xl font-black">History is unavailable</h1>
          <p className="mt-2 leading-relaxed text-[var(--text-muted)]">{error}</p>
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
        eyebrow="Training log"
        icon={<HistoryIcon size={15} />}
        title="History"
        description="A clear record of your sessions, strongest sets, and the work adding up over time."
        action={
          <Button className="w-full sm:w-auto" onClick={() => navigate("/workouts")}>
            <Dumbbell size={17} />
            Start workout
          </Button>
        }
      />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label={filter === "all" ? "Workouts" : "In this view"} value={filtered.length.toString()} suffix={filtered.length === 1 ? "session" : "sessions"} />
        <StatCard label="Training volume" value={formatVolume(totalVolume, weightUnit)} suffix={weightUnit} />
        <StatCard label="Work sets" value={totalCompletedSets.toString()} suffix="completed" tone="success" />
        <StatCard label="Training focus" value={leadingFocus ?? "—"} suffix="most trained" />
      </section>

      {personalRecords.length > 0 && (
        <section aria-labelledby="personal-records-heading">
          <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--primary)]">Your strongest moments</p>
              <h2 id="personal-records-heading" className="mt-1 text-xl font-black tracking-tight">Personal records</h2>
            </div>
            <p className="text-xs text-[var(--text-muted)]">Updated each time you save a workout</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {personalRecords.filter((record) => record.bestWeight || record.bestBodyweightReps).slice(0, 6).map((record) => (
              <Card key={record.exerciseId} className="flex min-w-0 items-start gap-3.5 p-4 sm:p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]">
                  <Trophy size={19} aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-black">{record.exerciseName}</h3>
                  {record.bestWeight && (
                    <p className="mt-2 text-sm font-black tabular-nums text-[var(--primary)]">
                      {formatWeight(record.bestWeight.weight, weightUnit)} {weightUnit} <span className="text-[var(--text-muted)]">× {record.bestWeight.reps}</span>
                    </p>
                  )}
                  {record.estimatedOneRepMax && (
                    <p className="mt-1 text-xs font-semibold text-[var(--text-muted)]">
                      Est. 1RM ≈ {formatWeight(record.estimatedOneRepMax.value, weightUnit)} {weightUnit}
                    </p>
                  )}
                  {!record.bestWeight && record.bestBodyweightReps && (
                    <p className="mt-2 text-sm font-black text-[var(--primary)]">{record.bestBodyweightReps.reps} reps</p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {sessions.length > 0 && (
        <section className="grid gap-3 lg:grid-cols-2">
          <Card className="flex items-center gap-4 p-5 sm:p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]"><Dumbbell size={22} aria-hidden="true" /></div>
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[var(--text-muted)]">Heaviest completed set · current view</p>
              {bestSet ? <p className="mt-1 truncate text-lg font-black">{bestSet.exerciseName} <span className="text-[var(--primary)]">{formatWeight(bestSet.weight, weightUnit)} {weightUnit} × {bestSet.reps}</span></p> : <p className="mt-1 text-sm text-[var(--text-muted)]">Complete a weighted set to see it here.</p>}
            </div>
          </Card>
          <Card className="flex items-center gap-4 p-5 sm:p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--success-soft)] text-[var(--success)]"><CalendarDays size={22} aria-hidden="true" /></div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[var(--text-muted)]">A useful pattern</p>
              <p className="mt-1 text-lg font-black">{leadingFocus ? `${leadingFocus} is your most trained focus` : "Your training story is taking shape"}</p>
              <p className="mt-1 text-sm text-[var(--text-muted)]">Based on the sessions in this view.</p>
            </div>
          </Card>
        </section>
      )}

      {sessions.length === 0 ? (
        <Card className="border-dashed p-7 text-center sm:p-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]">
            <HistoryIcon size={25} />
          </div>
          <h2 className="mt-5 text-2xl font-black">Your history starts here</h2>
          <p className="mx-auto mt-2 max-w-md leading-relaxed text-[var(--text-muted)]">
            Finish a workout and we'll keep the session here so you can look back at the work.
          </p>
          <Button className="mt-6" onClick={() => navigate("/workouts")}>
            Find a workout
            <ArrowRight size={16} />
          </Button>
        </Card>
      ) : (
        <>
          <Card className="p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--surface-soft)] text-[var(--text-muted)]">
                <Filter size={18} />
              </div>
              <div>
                <p className="text-sm font-black">Filter history</p>
                <p className="text-xs text-[var(--text-muted)]">
                  {filtered.length} {filtered.length === 1 ? "workout" : "workouts"} shown
                </p>
              </div>
            </div>

            <label className="relative mt-4 block">
              <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" aria-hidden="true" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search workouts, exercises, or focus" className="min-h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] pl-11 pr-4 text-sm outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--focus-ring)]" />
              <span className="sr-only">Search workout history</span>
            </label>

            <div role="group" aria-label="History date filter" className="mt-3 flex gap-1 overflow-x-auto rounded-[var(--radius-md)] bg-[var(--surface-soft)] p-1">
              <FilterButton active={filter === "all"} label="All time" onClick={() => setFilter("all")} />
              <FilterButton active={filter === "this-week"} label="This week" onClick={() => setFilter("this-week")} />
              <FilterButton active={filter === "this-month"} label="This month" onClick={() => setFilter("this-month")} />
              <FilterButton active={filter === "last-month"} label="Last month" onClick={() => setFilter("last-month")} />
            </div>
          </Card>

          {filtered.length === 0 ? (
            <Card className="p-8 text-center">
              <CalendarDays size={24} className="mx-auto text-[var(--text-muted)]" />
              <h2 className="mt-4 text-xl font-black">No workouts in this period</h2>
              <Button variant="secondary" className="mt-5" onClick={() => setFilter("all")}>
                Show all
              </Button>
            </Card>
          ) : (
            <section className="space-y-3">
              {filtered.map((session) => (
                <HistoryItem
                  key={session.id}
                  session={session}
                  weightUnit={weightUnit}
                  routineName={routineNames.get(session.routineId) ?? "Workout"}
                  onOpen={() => navigate(`/history/${session.id}`)}
                />
              ))}
            </section>
          )}
        </>
      )}
    </main>
  );
}

function HistoryItem({
  session,
  weightUnit,
  routineName,
  onOpen,
}: {
  session: WorkoutSession;
  weightUnit: "kg" | "lb";
  routineName: string;
  onOpen: () => void;
}) {
  const completedSets = getCompletedSets(session);
  const volume = getSessionVolume(session);
  const duration = getSessionDuration(session);

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group block w-full text-left"
    >
      <Card hover className="p-4 sm:p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--success-soft)] text-[var(--success)]">
            <CheckCircle2 size={21} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h2 className="truncate text-lg font-black sm:text-xl">{routineName}</h2>
              <span className="text-xs font-semibold text-[var(--success)]">Completed</span>
            </div>

            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-xs font-medium text-[var(--text-muted)] sm:text-sm">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays size={14} />
                {formatWorkoutDate(session.completedAt)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 size={14} />
                {duration}
              </span>
            </div>
          </div>

          <ArrowRight
            size={18}
            className="mt-1 shrink-0 text-[var(--text-muted)] transition-transform group-hover:translate-x-0.5"
          />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-[var(--border)] pt-4">
          <Metric label="Exercises" value={session.exercises.length.toString()} />
          <Metric label="Sets" value={completedSets.toString()} />
          <Metric label="Volume" value={`${formatVolume(volume, weightUnit)} ${weightUnit}`} />
        </div>
      </Card>
    </button>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[var(--radius-md)] bg-[var(--surface-soft)] px-3 py-3">
      <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[var(--text-muted)]">{label}</p>
      <p className="mt-1 text-sm font-black">{value}</p>
    </div>
  );
}

function FilterButton({
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
      className={`min-h-10 rounded-[var(--radius-sm)] px-2 text-xs font-bold transition-colors sm:text-sm ${
        active
          ? "bg-[var(--surface)] text-[var(--text)]"
          : "text-[var(--text-muted)] hover:text-[var(--text)]"
      }`}
    >
      {label}
    </button>
  );
}

function HistorySkeleton() {
  return (
    <main className="space-y-6" role="status" aria-label="Loading history">
      <div className="space-y-3">
        <div className="h-4 w-24 animate-pulse rounded bg-[var(--surface-soft)]" />
        <div className="h-10 w-48 animate-pulse rounded-xl bg-[var(--surface-soft)]" />
        <div className="h-5 w-full max-w-xl animate-pulse rounded bg-[var(--surface-soft)]" />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="h-28 animate-pulse rounded-[var(--radius-xl)] bg-[var(--surface-soft)]" />
        ))}
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="h-36 animate-pulse rounded-[var(--radius-xl)] bg-[var(--surface-soft)]" />
        ))}
      </div>
    </main>
  );
}
