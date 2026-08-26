import {
  Dumbbell,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { exercises } from "../data/exercises";
import type {
  Equipment,
  ExerciseCategory,
  MuscleGroup,
} from "../types/Exercise";

import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Input from "../components/ui/Input";

const muscleGroups: MuscleGroup[] = [
  "Chest",
  "Back",
  "Shoulders",
  "Biceps",
  "Triceps",
  "Forearms",
  "Quadriceps",
  "Hamstrings",
  "Glutes",
  "Calves",
  "Core",
  "Cardio",
  "Full Body",
];

const equipmentTypes: Equipment[] = [
  "Barbell",
  "Dumbbell",
  "Cable",
  "Machine",
  "Bodyweight",
  "Kettlebell",
  "Resistance Band",
  "EZ Bar",
  "Smith Machine",
  "Other",
];

const categories: ExerciseCategory[] = [
  "Strength",
  "Hypertrophy",
  "Cardio",
  "Mobility",
];

export default function Exercises() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [muscleFilter, setMuscleFilter] =
    useState<MuscleGroup | "All">("All");

  const [equipmentFilter, setEquipmentFilter] =
    useState<Equipment | "All">("All");

  const [categoryFilter, setCategoryFilter] =
    useState<ExerciseCategory | "All">("All");

  const [filtersOpen, setFiltersOpen] = useState(false);

  const filteredExercises = useMemo(() => {
    const query = search.trim().toLowerCase();

    return exercises.filter((exercise) => {
      const matchesSearch =
        query === "" ||
        exercise.name.toLowerCase().includes(query) ||
        exercise.muscleGroup.toLowerCase().includes(query) ||
        exercise.equipment.toLowerCase().includes(query) ||
        exercise.category.toLowerCase().includes(query) ||
        exercise.primaryMuscles.some((muscle) =>
          muscle.toLowerCase().includes(query),
        ) ||
        exercise.secondaryMuscles.some((muscle) =>
          muscle.toLowerCase().includes(query),
        );

      const matchesMuscle =
        muscleFilter === "All" ||
        exercise.muscleGroup === muscleFilter;

      const matchesEquipment =
        equipmentFilter === "All" ||
        exercise.equipment === equipmentFilter;

      const matchesCategory =
        categoryFilter === "All" ||
        exercise.category === categoryFilter;

      return (
        matchesSearch &&
        matchesMuscle &&
        matchesEquipment &&
        matchesCategory
      );
    });
  }, [
    search,
    muscleFilter,
    equipmentFilter,
    categoryFilter,
  ]);

  const hasFilters =
    search.trim() !== "" ||
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
    <main className="space-y-10">
      {/* Header */}
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--primary)]">
          Exercise Library
        </p>

        <div className="mt-3 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-[var(--text)] md:text-5xl">
              Find your exercise
            </h1>

            <p className="mt-3 max-w-2xl text-lg text-[var(--text-muted)]">
              Explore exercises by muscle group, equipment, and training
              goal.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
            <Dumbbell size={17} />
            <span>
              {exercises.length} exercises available
            </span>
          </div>
        </div>
      </section>

      {/* Search */}
      <Card className="p-5 md:p-6">
        <Input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search exercises, muscles, equipment..."
          className="bg-[var(--surface-soft)]"
        />

        {/* Mobile filter toggle */}
        <div className="mt-4 flex items-center justify-between md:hidden">
          <button
            type="button"
            onClick={() => setFiltersOpen((open) => !open)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--text-muted)] transition hover:text-[var(--primary)]"
          >
            <SlidersHorizontal size={17} />
            Filters
          </button>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--primary)]"
            >
              <X size={15} />
              Clear
            </button>
          )}
        </div>

        {/* Filters */}
        <div
          className={`
            ${
              filtersOpen
                ? "mt-5 grid"
                : "hidden"
            }
            gap-3
            md:mt-5
            md:grid
            md:grid-cols-3
          `}
        >
          <FilterSelect
            label="Muscle group"
            value={muscleFilter}
            options={muscleGroups}
            onChange={(value) =>
              setMuscleFilter(
                value as MuscleGroup | "All",
              )
            }
          />

          <FilterSelect
            label="Equipment"
            value={equipmentFilter}
            options={equipmentTypes}
            onChange={(value) =>
              setEquipmentFilter(
                value as Equipment | "All",
              )
            }
          />

          <FilterSelect
            label="Category"
            value={categoryFilter}
            options={categories}
            onChange={(value) =>
              setCategoryFilter(
                value as ExerciseCategory | "All",
              )
            }
          />
        </div>

        {/* Desktop clear filters */}
        {hasFilters && (
          <div className="mt-5 hidden md:block">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="px-0"
            >
              <X size={15} />
              Clear filters
            </Button>
          </div>
        )}
      </Card>

      {/* Results */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm text-[var(--text-muted)]">
            Showing{" "}
            <span className="font-bold text-[var(--text)]">
              {filteredExercises.length}
            </span>{" "}
            {filteredExercises.length === 1
              ? "exercise"
              : "exercises"}
          </p>
        </div>

        {filteredExercises.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredExercises.map((exercise) => (
              <Card
                key={exercise.id}
                hover
                className="flex flex-col p-6"
              >
                {/* Top */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]">
                    <Dumbbell size={22} />
                  </div>

                  <Badge
                    variant={
                      exercise.category === "Strength"
                        ? "primary"
                        : exercise.category === "Hypertrophy"
                          ? "success"
                          : "default"
                    }
                  >
                    {exercise.category}
                  </Badge>
                </div>

                {/* Name */}
                <h2 className="mt-6 text-xl font-black text-[var(--text)]">
                  {exercise.name}
                </h2>

                {/* Tags */}
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge>
                    {exercise.muscleGroup}
                  </Badge>

                  <Badge>
                    {exercise.equipment}
                  </Badge>
                </div>

                {/* Primary muscles */}
                <div className="mt-6">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                    Primary muscles
                  </p>

                  <p className="mt-2 text-sm font-medium leading-relaxed text-[var(--text)]">
                    {exercise.primaryMuscles.join(" · ")}
                  </p>
                </div>

                {/* Secondary muscles */}
                {exercise.secondaryMuscles.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                      Secondary
                    </p>

                    <p className="mt-2 text-sm text-[var(--text-muted)]">
                      {exercise.secondaryMuscles.join(" · ")}
                    </p>
                  </div>
                )}

                {/* Action */}
                <div className="mt-auto pt-6">
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() =>
                      navigate(
                        `/exercises/${exercise.id}`,
                      )
                    }
                  >
                    View Exercise
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--surface-soft)] text-[var(--text-muted)]">
              <Search size={24} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-[var(--text)]">
              No exercises found
            </h2>

            <p className="mt-2 text-[var(--text-muted)]">
              Try changing your search or filters.
            </p>

            <Button
              variant="secondary"
              onClick={clearFilters}
              className="mt-6"
            >
              Clear Filters
            </Button>
          </Card>
        )}
      </section>
    </main>
  );
}

type FilterSelectProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: FilterSelectProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface-soft)] px-4 py-3 text-sm font-medium text-[var(--text)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-soft)]"
      >
        <option value="All">
          All {label.toLowerCase()}s
        </option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}