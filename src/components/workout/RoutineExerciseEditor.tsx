import {
  ArrowDown,
  ArrowUp,
  Clock3,
  GripVertical,
  Trash2,
} from "lucide-react";

import type { RoutineExercise } from "../../types/RoutineExercise";

import NumberStepper from "../ui/NumberStepper";

type RoutineExerciseEditorProps = {
  routineExercise: RoutineExercise;
  index: number;
  totalExercises: number;
  onChange: (
    changes: Partial<
      Omit<RoutineExercise, "exercise">
    >,
  ) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
};

const restOptions = [
  30,
  45,
  60,
  90,
  120,
  150,
];

export default function RoutineExerciseEditor({
  routineExercise,
  index,
  totalExercises,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
}: RoutineExerciseEditorProps) {
  const {
    exercise,
    targetSets,
    targetReps,
    restSeconds,
  } = routineExercise;

  const formattedRest =
    formatRest(restSeconds);

  return (
    <article className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5 md:p-6">
      <div className="flex items-start gap-4">
        <div
          aria-hidden="true"
          className="hidden pt-2 text-[var(--text-subtle)] sm:block"
        >
          <GripVertical size={18} />
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-sm font-black text-[var(--primary)]">
          {index + 1}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-black tracking-tight text-[var(--text)]">
            {exercise.name}
          </h3>

          <p className="mt-1 text-sm text-[var(--text-muted)]">
            {exercise.muscleGroup} ·{" "}
            {exercise.equipment}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0}
            aria-label={`Move ${exercise.name} up`}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-[var(--radius-md)]
              text-[var(--text-muted)]
              transition-colors
              hover:bg-[var(--surface-soft)]
              hover:text-[var(--text)]
              disabled:cursor-not-allowed
              disabled:opacity-30
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[var(--primary)]
            "
          >
            <ArrowUp size={16} />
          </button>

          <button
            type="button"
            onClick={onMoveDown}
            disabled={
              index ===
              totalExercises - 1
            }
            aria-label={`Move ${exercise.name} down`}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-[var(--radius-md)]
              text-[var(--text-muted)]
              transition-colors
              hover:bg-[var(--surface-soft)]
              hover:text-[var(--text)]
              disabled:cursor-not-allowed
              disabled:opacity-30
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[var(--primary)]
            "
          >
            <ArrowDown size={16} />
          </button>

          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${exercise.name}`}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-[var(--radius-md)]
              text-[var(--text-muted)]
              transition-colors
              hover:bg-[var(--danger-soft)]
              hover:text-[var(--danger)]
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[var(--danger)]
            "
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 border-t border-[var(--border)] pt-6 lg:grid-cols-[180px_1fr_2fr]">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]">
            Sets
          </p>

          <NumberStepper
            value={targetSets}
            onChange={(value) =>
              onChange({
                targetSets:
                  Math.min(
                    100,
                    Math.max(
                      1,
                      Math.floor(value),
                    ),
                  ),
              })
            }
            min={1}
            max={100}
            step={1}
            ariaLabel={`${exercise.name} target sets`}
          />
        </div>

        <label className="block">
          <span className="mb-2 block text-xs font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]">
            Target reps
          </span>

          <input
            type="text"
            value={targetReps}
            onChange={(event) =>
              onChange({
                targetReps:
                  event.target.value,
              })
            }
            placeholder="8-12"
            maxLength={20}
            aria-label={`${exercise.name} target reps`}
            className="
              w-full
              rounded-[var(--radius-md)]
              border
              border-[var(--border-strong)]
              bg-[var(--surface)]
              px-4
              py-3
              text-sm
              font-medium
              text-[var(--text)]
              outline-none
              transition-[border-color,box-shadow]
              placeholder:text-[var(--text-muted)]
              focus:border-[var(--primary)]
              focus:ring-2
              focus:ring-[var(--focus-ring)]
            "
          />

          <p className="mt-1.5 text-xs text-[var(--text-muted)]">
            Example: 8-12, 5, or AMRAP
          </p>
        </label>

        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]">
              Rest between sets
            </span>

            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-muted)]">
              <Clock3 size={13} />
              {formattedRest}
            </span>
          </div>

          <div
            role="group"
            aria-label={`${exercise.name} rest duration`}
            className="grid grid-cols-3 gap-2 sm:grid-cols-6"
          >
            {restOptions.map(
              (seconds) => {
                const selected =
                  restSeconds ===
                  seconds;

                return (
                  <button
                    key={seconds}
                    type="button"
                    aria-pressed={selected}
                    onClick={() =>
                      onChange({
                        restSeconds:
                          seconds,
                      })
                    }
                    className={`
                      min-h-11
                      rounded-[var(--radius-md)]
                      border
                      px-3
                      py-2
                      text-sm
                      font-semibold
                      transition-[background-color,border-color,color]
                      duration-150
                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-[var(--primary)]
                      ${
                        selected
                          ? "border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]"
                          : "border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text-muted)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                      }
                    `}
                  >
                    {formatRest(
                      seconds,
                    )}
                  </button>
                );
              },
            )}
          </div>

          <div className="mt-3 flex items-center gap-2">
            <input
              type="number"
              min={0}
              max={3600}
              step={5}
              value={restSeconds}
              onChange={(event) => {
                const value =
                  Number(
                    event.target.value,
                  );

                onChange({
                  restSeconds:
                    Number.isFinite(
                      value,
                    )
                      ? Math.min(
                          3600,
                          Math.max(
                            0,
                            Math.floor(
                              value,
                            ),
                          ),
                        )
                      : 0,
                });
              }}
              aria-label={`${exercise.name} custom rest seconds`}
              className="
                w-28
                rounded-[var(--radius-md)]
                border
                border-[var(--border-strong)]
                bg-[var(--surface)]
                px-3
                py-2.5
                text-sm
                font-medium
                text-[var(--text)]
                outline-none
                focus:border-[var(--primary)]
                focus:ring-2
                focus:ring-[var(--focus-ring)]
              "
            />

            <span className="text-sm text-[var(--text-muted)]">
              seconds
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

function formatRest(
  seconds: number,
) {
  if (seconds < 60) {
    return `${seconds}s`;
  }

  const minutes = Math.floor(
    seconds / 60,
  );

  const remaining =
    seconds % 60;

  return remaining === 0
    ? `${minutes}m`
    : `${minutes}m ${remaining}s`;
}