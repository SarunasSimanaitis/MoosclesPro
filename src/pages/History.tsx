import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Dumbbell,
  Filter,
  History as HistoryIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { workoutSessionsApi } from "../api/workoutSessions";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
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

type HistoryFilter = "all" | "this-month" | "last-month";

export default function History() {
  const navigate = useNavigate();
  const customRoutines = useRoutineStore((state) => state.customRoutines);

  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<HistoryFilter>("all");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setIsLoading(true);
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
    if (filter === "all") return sessions;

    const now = new Date();
    if (filter === "this-month") {
      return sessions.filter((session) => {
        const date = new Date(session.completedAt);
        return (
          date.getFullYear() === now.getFullYear() &&
          date.getMonth() === now.getMonth()
        );
      });
    }

    const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    return sessions.filter((session) => {
      const date = new Date(session.completedAt);
      return (
        date.getFullYear() === previousMonth.getFullYear() &&
        date.getMonth() === previousMonth.getMonth()
      );
    });
  }, [filter, sessions]);

  const totalVolume = useMemo(
    () => sessions.reduce((sum, session) => sum + getSessionVolume(session), 0),
    [sessions],
  );

  const totalCompletedSets = useMemo(
    () => sessions.reduce((sum, session) => sum + getCompletedSets(session), 0),
    [sessions],
  );

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
        description="Your completed workouts, kept easy to scan."
        action={
          <Button className="w-full sm:w-auto" onClick={() => navigate("/workouts")}>
            <Dumbbell size={17} />
            Start workout
          </Button>
        }
      />

      <section className="grid gap-3 sm:grid-cols-3">
        <Summary label="Workouts" value={sessions.length.toString()} suffix="completed" tone="primary" />
        <Summary label="Volume" value={formatNumber(totalVolume)} suffix="kg" tone="primary" />
        <Summary label="Sets" value={totalCompletedSets.toString()} suffix="completed" tone="success" />
      </section>

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

            <div
              role="group"
              aria-label="History date filter"
              className="mt-4 grid grid-cols-3 gap-1 rounded-[var(--radius-md)] bg-[var(--surface-soft)] p-1"
            >
              <FilterButton active={filter === "all"} label="All" onClick={() => setFilter("all")} />
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
  routineName,
  onOpen,
}: {
  session: WorkoutSession;
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
          <Metric label="Volume" value={`${formatNumber(volume)} kg`} />
        </div>
      </Card>
    </button>
  );
}

function Summary({
  label,
  value,
  suffix,
  tone,
}: {
  label: string;
  value: string;
  suffix: string;
  tone: "primary" | "violet" | "accent";
}) {
  const color =
    tone === "primary"
      ? "var(--primary)"
      : tone === "violet"
        ? "var(--primary)"
        : "var(--success)";

  const bg =
    tone === "primary"
      ? "var(--primary-soft)"
      : tone === "violet"
        ? "var(--primary-soft)"
        : "var(--success-soft)";

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--text-muted)]">{label}</p>
        <span className="rounded-full px-2.5 py-1 text-[10px] font-bold" style={{ backgroundColor: bg, color }}>
          {suffix}
        </span>
      </div>
      <p className="mt-3 text-2xl font-black">{value}</p>
    </Card>
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
          ? "bg-[var(--surface)] text-[var(--text)] shadow-[var(--shadow-sm)]"
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