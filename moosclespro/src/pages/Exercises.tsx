import {
    Dumbbell,
    Search,
    SlidersHorizontal,
} from "lucide-react";
import { useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import { exercises } from "../data/exercises";
import type {
    Equipment,
    ExerciseCategory,
    MuscleGroup,
} from "../types/Exercise";

const muscleGroups: MuscleGroup[] = [
    "Chest",
    "Back",
    "Shoulders",
    "Biceps",
    "Triceps",
    "Quads",
    "Hamstrings",
    "Glutes",
    "Calves",
    "Core",
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

    const filteredExercises = useMemo(() => {
        const normalizedSearch = search
            .trim()
            .toLowerCase();

        return exercises.filter((exercise) => {
            const matchesSearch =
                normalizedSearch === "" ||
                exercise.name
                    .toLowerCase()
                    .includes(normalizedSearch) ||
                exercise.muscleGroup
                    .toLowerCase()
                    .includes(normalizedSearch) ||
                exercise.primaryMuscles.some((muscle) =>
                    muscle
                        .toLowerCase()
                        .includes(normalizedSearch),
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
        search !== "" ||
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

                <h1 className="mt-3 text-4xl font-black tracking-tight text-[var(--text)] md:text-5xl">
                    Find your exercise
                </h1>

                <p className="mt-3 max-w-2xl text-lg text-[var(--text-muted)]">
                    Explore exercises by muscle group, equipment, and
                    training goal.
                </p>
            </section>

            {/* Search + Filters */}

            <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm md:p-6">
                <div className="relative">
                    <Search
                        size={20}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                    />

                    <input
                        type="search"
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                        placeholder="Search exercises, muscles..."
                        className="w-full rounded-2xl border border-[var(--border-strong)] bg-[var(--surface-soft)] py-3.5 pl-12 pr-4 text-[var(--text)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
                    />
                </div>

                <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-[var(--text-muted)]">
                    <SlidersHorizontal size={16} />
                    Filters
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <select
                        value={muscleFilter}
                        onChange={(event) =>
                            setMuscleFilter(
                                event.target.value as MuscleGroup | "All",
                            )
                        }
                        className="rounded-xl border border-[var(--border-strong)] bg-[var(--surface-soft)] px-4 py-3 text-sm font-medium text-[var(--text)] outline-none focus:border-[var(--primary)]"
                    >
                        <option value="All">All muscle groups</option>

                        {muscleGroups.map((muscle) => (
                            <option key={muscle} value={muscle}>
                                {muscle}
                            </option>
                        ))}
                    </select>

                    <select
                        value={equipmentFilter}
                        onChange={(event) =>
                            setEquipmentFilter(
                                event.target.value as Equipment | "All",
                            )
                        }
                        className="rounded-xl border border-[var(--border-strong)] bg-[var(--surface-soft)] px-4 py-3 text-sm font-medium text-[var(--text)] outline-none focus:border-[var(--primary)]"
                    >
                        <option value="All">All equipment</option>

                        {equipmentTypes.map((equipment) => (
                            <option key={equipment} value={equipment}>
                                {equipment}
                            </option>
                        ))}
                    </select>

                    <select
                        value={categoryFilter}
                        onChange={(event) =>
                            setCategoryFilter(
                                event.target.value as
                                | ExerciseCategory
                                | "All",
                            )
                        }
                        className="rounded-xl border border-[var(--border-strong)] bg-[var(--surface-soft)] px-4 py-3 text-sm font-medium text-[var(--text)] outline-none focus:border-[var(--primary)]"
                    >
                        <option value="All">All categories</option>

                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                {hasFilters && (
                    <button
                        type="button"
                        onClick={clearFilters}
                        className="mt-4 text-sm font-semibold text-[var(--primary)] hover:underline"
                    >
                        Clear filters
                    </button>
                )}
            </section>

            {/* Results */}

            <section>
                <div className="mb-5 flex items-center justify-between">
                    <p className="text-sm font-medium text-[var(--text-muted)]">
                        Showing{" "}
                        <span className="font-bold text-[var(--text)]">
                            {filteredExercises.length}
                        </span>{" "}
                        exercises
                    </p>
                </div>

                {filteredExercises.length > 0 ? (
                    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                        {filteredExercises.map((exercise) => (
                            <article
                                key={exercise.id}
                                className="group rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                            >
                                {/* Exercise icon */}

                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]">
                                        <Dumbbell size={22} />
                                    </div>

                                    <span className="rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-1 text-xs font-semibold text-[var(--text-muted)]">
                                        {exercise.category}
                                    </span>
                                </div>

                                {/* Info */}

                                <h2 className="mt-6 text-xl font-black text-[var(--text)]">
                                    {exercise.name}
                                </h2>

                                <div className="mt-3 flex flex-wrap gap-2">
                                    <span className="rounded-lg bg-[var(--surface-soft)] px-2.5 py-1 text-xs font-medium text-[var(--text-muted)]">
                                        {exercise.muscleGroup}
                                    </span>

                                    <span className="rounded-lg bg-[var(--surface-soft)] px-2.5 py-1 text-xs font-medium text-[var(--text-muted)]">
                                        {exercise.equipment}
                                    </span>
                                </div>

                                {/* Muscles */}

                                <div className="mt-6">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                                        Primary muscles
                                    </p>

                                    <p className="mt-2 text-sm font-medium text-[var(--text)]">
                                        {exercise.primaryMuscles.join(" · ")}
                                    </p>
                                </div>

                                {/* Action */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(`/exercises/${exercise.id}`)
                                    }
                                    className="mt-6 w-full rounded-xl border border-[var(--border-strong)] px-4 py-3 text-sm font-semibold text-[var(--text)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
                                >
                                    View exercise
                                </button>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-[2rem] border border-dashed border-[var(--border-strong)] bg-[var(--surface)] p-12 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--surface-soft)] text-[var(--text-muted)]">
                            <Search size={24} />
                        </div>

                        <h2 className="mt-5 text-xl font-bold text-[var(--text)]">
                            No exercises found
                        </h2>

                        <p className="mt-2 text-[var(--text-muted)]">
                            Try changing your search or filters.
                        </p>

                        <button
                            type="button"
                            onClick={clearFilters}
                            className="mt-5 rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white"
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </section>
        </main>
    );
}