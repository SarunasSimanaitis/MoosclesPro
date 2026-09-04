import {
  Check,
  Dumbbell,
  Search,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

import type { Exercise } from "../../types/Exercise";

import Button from "../ui/Button";
import Card from "../ui/Card";
import Input from "../ui/Input";

type ExercisePickerProps = {
  exercises: Exercise[];
  selectedExerciseIds: Set<string>;
  onSelect: (exercise: Exercise) => void;
  onClose: () => void;
};

export default function ExercisePicker({
  exercises,
  selectedExerciseIds,
  onSelect,
  onClose,
}: ExercisePickerProps) {
  const [search, setSearch] =
    useState("");

  const filteredExercises =
    useMemo(() => {
      const query = search
        .trim()
        .toLowerCase();

      if (!query) {
        return exercises;
      }

      return exercises.filter(
        (exercise) =>
          exercise.name
            .toLowerCase()
            .includes(query) ||
          exercise.muscleGroup
            .toLowerCase()
            .includes(query) ||
          exercise.equipment
            .toLowerCase()
            .includes(query) ||
          exercise.category
            .toLowerCase()
            .includes(query) ||
          exercise.primaryMuscles.some(
            (muscle) =>
              muscle
                .toLowerCase()
                .includes(query),
          ),
      );
    }, [exercises, search]);

  const selectedCount =
    selectedExerciseIds.size;

  return (
    <Card className="mt-5 overflow-hidden border-[var(--primary)]/25">
      <div className="border-b border-[var(--border)] bg-[var(--surface-soft)] p-5 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--primary)]">
              Exercise library
            </p>

            <h3 className="mt-2 text-xl font-black tracking-tight text-[var(--text)]">
              Add exercises
            </h3>

            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Search the library and choose the
              exercises for this routine.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close exercise picker"
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-[var(--radius-md)]
              text-[var(--text-muted)]
              transition-colors
              hover:bg-[var(--surface)]
              hover:text-[var(--text)]
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[var(--primary)]
            "
          >
            <X size={18} />
          </button>
        </div>

        <Input
          type="search"
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value,
            )
          }
          placeholder="Search by exercise, muscle, equipment..."
          leadingIcon={<Search size={17} />}
          className="mt-5"
        />

        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="text-[var(--text-muted)]">
            {filteredExercises.length}{" "}
            {filteredExercises.length === 1
              ? "exercise"
              : "exercises"}
          </span>

          {selectedCount > 0 && (
            <span className="font-semibold text-[var(--primary)]">
              {selectedCount} selected
            </span>
          )}
        </div>
      </div>

      <div className="max-h-[28rem] overflow-y-auto p-4">
        {filteredExercises.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--surface-soft)] text-[var(--text-muted)]">
              <Search size={23} />
            </div>

            <h4 className="mt-4 font-bold text-[var(--text)]">
              No exercises found
            </h4>

            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Try a different search term.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredExercises.map(
              (exercise) => {
                const isSelected =
                  selectedExerciseIds.has(
                    exercise.id,
                  );

                return (
                  <button
                    key={exercise.id}
                    type="button"
                    disabled={isSelected}
                    onClick={() =>
                      onSelect(
                        exercise,
                      )
                    }
                    className={`
                      flex
                      w-full
                      items-center
                      justify-between
                      gap-4
                      rounded-[var(--radius-md)]
                      border
                      p-4
                      text-left
                      transition-[background-color,border-color,opacity]
                      duration-150
                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-[var(--primary)]
                      ${
                        isSelected
                          ? "border-[var(--success)]/25 bg-[var(--success-soft)] opacity-70"
                          : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)] hover:bg-[var(--surface-soft)]"
                      }
                    `}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className={`
                          flex
                          h-10
                          w-10
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          ${
                            isSelected
                              ? "bg-[var(--success-soft)] text-[var(--success)]"
                              : "bg-[var(--primary-soft)] text-[var(--primary)]"
                          }
                        `}
                      >
                        {isSelected ? (
                          <Check size={18} />
                        ) : (
                          <Dumbbell size={18} />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-semibold text-[var(--text)]">
                          {exercise.name}
                        </p>

                        <p className="mt-1 truncate text-xs text-[var(--text-muted)]">
                          {exercise.muscleGroup}{" "}
                          · {exercise.equipment} ·{" "}
                          {exercise.category}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`
                        shrink-0 text-xs font-bold
                        ${
                          isSelected
                            ? "text-[var(--success)]"
                            : "text-[var(--primary)]"
                        }
                      `}
                    >
                      {isSelected
                        ? "Added"
                        : "Add"}
                    </span>
                  </button>
                );
              },
            )}
          </div>
        )}
      </div>

      <div className="flex justify-end border-t border-[var(--border)] bg-[var(--surface-soft)] p-4">
        <Button
          variant="secondary"
          size="sm"
          onClick={onClose}
        >
          Done
        </Button>
      </div>
    </Card>
  );
}