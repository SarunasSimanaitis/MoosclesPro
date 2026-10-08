import { ArrowRight, Clock3, Copy, Dumbbell, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

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
  onDelete: (routineId: string, name: string) => void;
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
  const busy = isDeleting || isDuplicating;
  const estimatedMinutes = Math.max(20, routine.exercises.length * 10);

  return (
    <Card hover className="p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--success-soft)] text-[var(--success)]">
          <Dumbbell size={21} />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-black sm:text-xl">{routine.name}</h3>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            {routine.exercises.length} {routine.exercises.length === 1 ? "exercise" : "exercises"}
            <span className="mx-1.5">·</span>
            {estimatedMinutes} min
          </p>
        </div>

        <div className="relative shrink-0">
          <button
            type="button"
            disabled={busy}
            onClick={(event) => {
              event.stopPropagation();
              onToggleMenu();
            }}
            aria-label={`Actions for ${routine.name}`}
            aria-expanded={menuOpen}
            className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"
          >
            <MoreHorizontal size={19} />
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-12 z-30 w-48 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-1.5"
              onClick={(event) => event.stopPropagation()}
            >
              <MenuItem icon={<Pencil size={16} />} label="Edit" onClick={() => onEdit(routine.id)} />
              <MenuItem icon={<Copy size={16} />} label={isDuplicating ? "Duplicating..." : "Duplicate"} disabled={busy} onClick={() => onDuplicate(routine.id)} />
              <MenuItem icon={<Trash2 size={16} />} label={isDeleting ? "Deleting..." : "Delete"} danger disabled={busy} onClick={() => onDelete(routine.id, routine.name)} />
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {routine.exercises.slice(0, 3).map((item, index) => (
          <div key={item.exercise.id} className="flex items-center gap-3 rounded-[var(--radius-md)] bg-[var(--surface-soft)] px-3.5 py-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--surface)] text-[10px] font-black text-[var(--text-muted)]">
              {index + 1}
            </span>
            <span className="min-w-0 flex-1 truncate text-sm font-bold">{item.exercise.name}</span>
            <span className="shrink-0 text-xs font-semibold text-[var(--text-muted)]">
              {item.targetSets} × {item.targetReps}
            </span>
          </div>
        ))}

        {routine.exercises.length > 3 && (
          <p className="px-1 text-xs font-semibold text-[var(--text-muted)]">
            +{routine.exercises.length - 3} more
          </p>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-[var(--border)] pt-4">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-muted)]">
          <Clock3 size={14} />
          Ready when you are
        </span>

        <Button size="sm" onClick={() => onStart(routine.id)}>
          Start
          <ArrowRight size={15} />
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
      className={`flex min-h-11 w-full items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-sm font-semibold ${
        danger
          ? "text-[var(--danger)] hover:bg-[var(--danger-soft)]"
          : "text-[var(--text-muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"
      } disabled:opacity-50`}
    >
      {icon}
      {label}
    </button>
  );
}