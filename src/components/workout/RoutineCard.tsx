import {
  ArrowRight,
  Clock3,
  Copy,
  Dumbbell,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

import type { Routine } from "../../types/Routine";
import Button from "../ui/Button";
import Card from "../ui/Card";

type RoutineCardProps = {
  routine: Routine;
  menuOpen: boolean;
  isDeleting: boolean;
  isDuplicating: boolean;
  onStart: (routineId: string) => void;
  onEdit: (routineId: string) => void;
  onDuplicate: (routineId: string) => void;
  onDelete: (
    routineId: string,
    name: string,
  ) => void;
  onToggleMenu: () => void;
};

export default function RoutineCard({
  routine,
  menuOpen,
  isDeleting,
  isDuplicating,
  onStart,
  onEdit,
  onDuplicate,
  onDelete,
  onToggleMenu,
}: RoutineCardProps) {
  const isBusy =
    isDeleting || isDuplicating;

  const estimatedMinutes = Math.max(
    20,
    routine.exercises.length * 10,
  );

  return (
    <Card
      hover
      className="p-6 md:p-7"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]">
            <Dumbbell size={21} />
          </div>

          <h3 className="mt-5 text-xl font-black text-[var(--text)]">
            {routine.name}
          </h3>

          <p className="mt-2 text-sm text-[var(--text-muted)]">
            {routine.exercises.length}{" "}
            {routine.exercises.length ===
            1
              ? "exercise"
              : "exercises"}
          </p>
        </div>

        <div className="relative">
          <button
            type="button"
            disabled={isBusy}
            onClick={(event) => {
              event.stopPropagation();
              onToggleMenu();
            }}
            aria-label={`Actions for ${routine.name}`}
            aria-expanded={menuOpen}
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-[var(--radius-md)]
              border
              border-[var(--border)]
              bg-[var(--surface)]
              text-[var(--text-muted)]
              transition-colors
              hover:border-[var(--primary)]
              hover:text-[var(--primary)]
              disabled:cursor-not-allowed
              disabled:opacity-40
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[var(--primary)]
            "
          >
            <MoreHorizontal size={18} />
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="
                absolute
                right-0
                top-12
                z-30
                w-48
                overflow-hidden
                rounded-[var(--radius-lg)]
                border
                border-[var(--border)]
                bg-[var(--surface)]
                p-1.5
                shadow-[var(--shadow-lg)]
              "
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              <MenuItem
                icon={<Pencil size={16} />}
                label="Edit routine"
                onClick={() =>
                  onEdit(routine.id)
                }
              />

              <MenuItem
                icon={<Copy size={16} />}
                label={
                  isDuplicating
                    ? "Duplicating..."
                    : "Duplicate"
                }
                disabled={isDuplicating}
                onClick={() =>
                  onDuplicate(
                    routine.id,
                  )
                }
              />

              <MenuItem
                icon={<Trash2 size={16} />}
                label={
                  isDeleting
                    ? "Deleting..."
                    : "Delete routine"
                }
                danger
                disabled={isDeleting}
                onClick={() =>
                  onDelete(
                    routine.id,
                    routine.name,
                  )
                }
              />
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 space-y-2">
        {routine.exercises
          .slice(0, 3)
          .map(
            (routineExercise) => (
              <div
                key={
                  routineExercise.exercise.id
                }
                className="
                  flex
                  items-center
                  justify-between
                  gap-3
                  rounded-[var(--radius-md)]
                  bg-[var(--surface-soft)]
                  px-4
                  py-3
                "
              >
                <span className="truncate text-sm font-medium text-[var(--text)]">
                  {
                    routineExercise
                      .exercise.name
                  }
                </span>

                <span className="shrink-0 text-xs font-semibold text-[var(--text-muted)]">
                  {
                    routineExercise.targetSets
                  }{" "}
                  ×{" "}
                  {
                    routineExercise.targetReps
                  }
                </span>
              </div>
            ),
          )}

        {routine.exercises.length >
          3 && (
          <p className="px-1 pt-1 text-xs font-medium text-[var(--text-muted)]">
            +{" "}
            {routine.exercises.length -
              3}{" "}
            more
          </p>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-[var(--border)] pt-5">
        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
          <Clock3 size={15} />
          ~{estimatedMinutes} min
        </div>

        <Button
          size="sm"
          onClick={() =>
            onStart(routine.id)
          }
        >
          Start
          <ArrowRight size={16} />
        </Button>
      </div>
    </Card>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
  danger = false,
  disabled = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      onClick={onClick}
      className={`
        flex
        w-full
        items-center
        gap-3
        rounded-[var(--radius-md)]
        px-3
        py-2.5
        text-sm
        font-semibold
        transition-colors
        disabled:cursor-not-allowed
        disabled:opacity-40
        ${
          danger
            ? "text-[var(--danger)] hover:bg-[var(--danger-soft)]"
            : "text-[var(--text-muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"
        }
      `}
    >
      {icon}
      {label}
    </button>
  );
}