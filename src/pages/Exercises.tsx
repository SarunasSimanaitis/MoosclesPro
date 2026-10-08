import {
  Dumbbell,
  Filter,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import PageHeader from "../components/ui/PageHeader";
import Select from "../components/ui/Select";
import { exercises } from "../data/exercises";
import type {
  Equipment,
  ExerciseCategory,
  MuscleGroup,
} from "../types/Exercise";

const muscleGroups: MuscleGroup[] = [
  "Chest","Back","Shoulders","Biceps","Triceps","Forearms",
  "Quadriceps","Hamstrings","Glutes","Calves","Core","Cardio","Full Body",
];

const equipmentTypes: Equipment[] = [
  "Barbell","Dumbbell","Cable","Machine","Bodyweight",
  "Kettlebell","Resistance Band","EZ Bar","Smith Machine","Other",
];

const categories: ExerciseCategory[] = [
  "Strength","Hypertrophy","Cardio","Mobility",
];

export default function Exercises() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [muscleFilter, setMuscleFilter] = useState<MuscleGroup | "All">("All");
  const [equipmentFilter, setEquipmentFilter] = useState<Equipment | "All">("All");
  const [categoryFilter, setCategoryFilter] = useState<ExerciseCategory | "All">("All");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return exercises.filter((exercise) => {
      const searchable = [
        exercise.name,
        exercise.muscleGroup,
        exercise.equipment,
        exercise.category,
        ...exercise.primaryMuscles,
        ...exercise.secondaryMuscles,
      ].join(" ").toLowerCase();

      return (
        (!query || searchable.includes(query)) &&
        (muscleFilter === "All" || exercise.muscleGroup === muscleFilter) &&
        (equipmentFilter === "All" || exercise.equipment === equipmentFilter) &&
        (categoryFilter === "All" || exercise.category === categoryFilter)
      );
    });
  }, [search, muscleFilter, equipmentFilter, categoryFilter]);

  const hasFilters =
    search.trim() ||
    muscleFilter !== "All" ||
    equipmentFilter !== "All" ||
    categoryFilter !== "All";

  function clearFilters() {
    setSearch("");
    setMuscleFilter("All");
    setEquipmentFilter("All");
    setCategoryFilter("All");
  }

  return (
    <main className="space-y-6 sm:space-y-8">
      <PageHeader
        eyebrow="Exercise library"
        icon={<Dumbbell size={15} />}
        title="Exercises"
        description="Search for a movement, then tap in for the details."
      />

      <Card className="p-4 sm:p-5">
        <Input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search exercises"
          leadingIcon={<Search size={18} />}
          aria-label="Search exercises"
        />

        <div className="mt-3 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setFiltersOpen((open) => !open)}
            className="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-md)] px-3 text-sm font-bold text-[var(--text-muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)] md:hidden"
            aria-expanded={filtersOpen}
          >
            <SlidersHorizontal size={17} />
            Filters
          </button>

          <p className="text-xs font-semibold text-[var(--text-muted)] sm:text-sm">
            {filtered.length} of {exercises.length} exercises
          </p>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-[var(--radius-md)] px-2 text-sm font-bold text-[var(--primary)]"
            >
              <X size={15} />
              Clear
            </button>
          )}
        </div>

        <div className={`mt-4 grid gap-3 md:grid-cols-3 ${filtersOpen ? "grid" : "hidden md:grid"}`}>
          <Select
            label="Muscle"
            value={muscleFilter}
            options={muscleGroups}
            allLabel="All muscles"
            onChange={(value) => setMuscleFilter(value as MuscleGroup | "All")}
          />
          <Select
            label="Equipment"
            value={equipmentFilter}
            options={equipmentTypes}
            allLabel="All equipment"
            onChange={(value) => setEquipmentFilter(value as Equipment | "All")}
          />
          <Select
            label="Type"
            value={categoryFilter}
            options={categories}
            allLabel="All types"
            onChange={(value) => setCategoryFilter(value as ExerciseCategory | "All")}
          />
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Card className="border-dashed p-8 text-center sm:p-10">
          <Filter size={24} className="mx-auto text-[var(--text-muted)]" />
          <h2 className="mt-4 text-xl font-black">No matches</h2>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Try a different search or clear the filters.
          </p>
          <Button variant="secondary" className="mt-5" onClick={clearFilters}>
            Clear filters
          </Button>
        </Card>
      ) : (
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((exercise) => (
            <button
              key={exercise.id}
              type="button"
              onClick={() => navigate(`/exercises/${exercise.id}`)}
              className="group text-left"
            >
              <Card hover className="h-full p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                      exercise.category === "Strength"
                        ? "bg-[var(--primary-soft)] text-[var(--primary)]"
                        : exercise.category === "Hypertrophy"
                          ? "bg-[var(--success-soft)] text-[var(--success)]"
                          : exercise.category === "Mobility"
                            ? "bg-[var(--primary-soft)] text-[var(--primary)]"
                            : "bg-[var(--danger-soft)] text-[var(--danger)]"
                    }`}
                  >
                    <Dumbbell size={21} />
                  </div>
                  <Badge>{exercise.category}</Badge>
                </div>

                <h2 className="mt-5 text-lg font-black group-hover:text-[var(--primary)] sm:text-xl">
                  {exercise.name}
                </h2>

                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge>{exercise.muscleGroup}</Badge>
                  <Badge>{exercise.equipment}</Badge>
                </div>

                <p className="mt-5 text-sm leading-relaxed text-[var(--text-muted)]">
                  {exercise.primaryMuscles.join(" · ")}
                </p>
              </Card>
            </button>
          ))}
        </section>
      )}
    </main>
  );
}