import {
  ArrowRight,
  Dumbbell,
  MoreHorizontal,
  Plus,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { routinesApi } from "../api/routines";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import ProgramCard from "../components/workout/ProgramCard";
import RoutineCard from "../components/workout/RoutineCard";
import { programs } from "../data/programs";
import { useRoutineStore } from "../stores/routineStore";
import type { Routine } from "../types/Routine";

export default function Workouts() {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingRoutineId, setDeletingRoutineId] = useState<string | null>(null);
  const [duplicatingRoutineId, setDuplicatingRoutineId] = useState<string | null>(null);

  const customRoutines = useRoutineStore((state) => state.customRoutines);
  const setCustomRoutines = useRoutineStore((state) => state.setCustomRoutines);
  const deleteRoutine = useRoutineStore((state) => state.deleteRoutine);
  const addRoutine = useRoutineStore((state) => state.addRoutine);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await routinesApi.list();
        if (!cancelled) setCustomRoutines(data);
      } catch (requestError) {
        console.error("Failed to load routines:", requestError);
        if (!cancelled) setError("Could not load your routines. Please try again.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [setCustomRoutines]);

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;

    try {
      setDeletingRoutineId(id);
      setOpenMenu(null);
      setError(null);
      await routinesApi.remove(id);
      deleteRoutine(id);
    } catch (requestError) {
      console.error("Failed to delete routine:", requestError);
      setError(requestError instanceof Error ? requestError.message : "Could not delete the routine.");
    } finally {
      setDeletingRoutineId(null);
    }
  }

  async function handleDuplicate(id: string) {
    const routine = customRoutines.find((item) => item.id === id);
    if (!routine) return;

    const duplicate: Routine = {
      ...routine,
      id: `custom-${crypto.randomUUID()}`,
      name: `${routine.name} Copy`,
      exercises: routine.exercises.map((exercise) => ({ ...exercise })),
    };

    try {
      setDuplicatingRoutineId(id);
      setOpenMenu(null);
      setError(null);
      addRoutine(await routinesApi.create(duplicate));
    } catch (requestError) {
      console.error("Failed to duplicate routine:", requestError);
      setError(requestError instanceof Error ? requestError.message : "Could not duplicate the routine.");
    } finally {
      setDuplicatingRoutineId(null);
    }
  }

  if (isLoading) return <WorkoutsSkeleton />;

  return (
    <main className="space-y-7 sm:space-y-8" onClick={() => setOpenMenu(null)}>
      <PageHeader
        eyebrow="Training"
        icon={<Dumbbell size={15} />}
        title="Workouts"
        description="Start something you already know, or build a routine that fits you."
        action={
          <Button className="w-full sm:w-auto" onClick={() => navigate("/workouts/create")}>
            <Plus size={18} />
            Create routine
          </Button>
        }
      />

      {error && (
        <Card
          role="alert"
          className="border-[var(--danger)]/25 bg-[var(--danger-soft)] p-4"
          onClick={(event) => event.stopPropagation()}
        >
          <p className="text-sm font-semibold text-[var(--danger)]">{error}</p>
        </Card>
      )}

      <section>
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--primary)]">Start here</p>
            <h2 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">Free programs</h2>
          </div>
          <div className="hidden items-center gap-2 text-sm font-semibold text-[var(--text-muted)] sm:flex">
            <Users size={16} />
            Ready-made
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {programs.map((program) => (
            <ProgramCard
              key={program.id}
              program={program}
              onView={(id) => navigate(`/program/${encodeURIComponent(id)}`)}
            />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--success)]">Your workouts</p>
            <h2 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">My routines</h2>
          </div>
          <span className="text-sm font-semibold text-[var(--text-muted)]">
            {customRoutines.length} saved
          </span>
        </div>

        {customRoutines.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {customRoutines.map((routine) => (
              <RoutineCard
                key={routine.id}
                routine={routine}
                menuOpen={openMenu === routine.id}
                isDeleting={deletingRoutineId === routine.id}
                isDuplicating={duplicatingRoutineId === routine.id}
                onStart={(id) => navigate(`/workout/${id}`)}
                onEdit={(id) => navigate(`/workouts/create?edit=${encodeURIComponent(id)}`)}
                onDuplicate={(id) => void handleDuplicate(id)}
                onDelete={(id, name) => void handleDelete(id, name)}
                onToggleMenu={() => setOpenMenu((current) => current === routine.id ? null : routine.id)}
              />
            ))}
          </div>
        ) : (
          <Card className="border-dashed p-7 sm:p-10">
            <div className="grid gap-5 sm:grid-cols-[auto_1fr_auto] sm:items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--success-soft)] text-[var(--success)]">
                <Dumbbell size={25} />
              </div>
              <div>
                <h3 className="text-xl font-black">Create your first routine</h3>
                <p className="mt-1 max-w-xl text-sm leading-relaxed text-[var(--text-muted)]">
                  Add your exercises, set your targets once, then use the same routine whenever you train.
                </p>
              </div>
              <Button variant="secondary" className="w-full sm:w-auto" onClick={() => navigate("/workouts/create")}>
                Build routine
                <ArrowRight size={16} />
              </Button>
            </div>
          </Card>
        )}
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <Tip icon={<CheckCircle2 size={18} />} title="Keep it repeatable" text="A good routine is one you can actually follow." />
        <Tip icon={<Clock3 size={18} />} title="Keep it focused" text="You don't need dozens of exercises to make progress." />
        <Tip icon={<MoreHorizontal size={18} />} title="Adjust anytime" text="Edit or duplicate a routine when your training changes." />
      </section>
    </main>
  );
}

function WorkoutsSkeleton() {
  return (
    <main className="space-y-6">
      <div className="space-y-3">
        <div className="h-4 w-24 animate-pulse rounded bg-[var(--surface-soft)]" />
        <div className="h-10 w-56 max-w-full animate-pulse rounded-xl bg-[var(--surface-soft)]" />
        <div className="h-5 w-full max-w-xl animate-pulse rounded bg-[var(--surface-soft)]" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {[1, 2].map((item) => (
          <div key={item} className="h-72 animate-pulse rounded-[var(--radius-xl)] bg-[var(--surface-soft)]" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {[1, 2].map((item) => (
          <div key={item} className="h-64 animate-pulse rounded-[var(--radius-xl)] bg-[var(--surface-soft)]" />
        ))}
      </div>
    </main>
  );
}