import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Dumbbell,
} from "lucide-react";

import type { Program } from "../../types/Program";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import Card from "../ui/Card";

type ProgramCardProps = {
  program: Program;
  onView: (programId: string) => void;
};

export default function ProgramCard({
  program,
  onView,
}: ProgramCardProps) {
  return (
    <Card
      hover
      className="overflow-hidden"
    >
      {/* Feature header */}
      <div
        className="
          relative
          overflow-hidden
          bg-[var(--feature-background)]
          p-7
          md:p-8
        "
      >
        <div
          aria-hidden="true"
          className="
            absolute
            -right-16
            -top-16
            h-40
            w-40
            rounded-full
            bg-[var(--primary)]
            opacity-15
            blur-2xl
          "
        />

        <div className="relative">
          <div className="flex items-start justify-between gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]">
              <Dumbbell size={23} />
            </div>

            <Badge
              className="
                border-[var(--feature-border)]
                bg-[var(--feature-surface)]
                text-[var(--feature-muted)]
              "
            >
              Free
            </Badge>
          </div>

          <h2 className="mt-7 text-2xl font-black tracking-tight text-[var(--feature-text)]">
            {program.name}
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-[var(--feature-muted)]">
            {program.description}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-7 md:p-8">
        <div className="grid grid-cols-2 gap-3">
          <InfoTile
            icon={<CalendarDays size={14} />}
            label="Schedule"
            value={`${program.daysPerWeek} days/week`}
          />

          <InfoTile
            icon={<Clock3 size={14} />}
            label="Sessions"
            value={`~${program.sessionMinutes} min`}
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="primary">
            {program.goal}
          </Badge>

          <Badge>
            {program.environment}
          </Badge>

          <Badge>
            {program.difficulty}
          </Badge>
        </div>

        <Button
          onClick={() => onView(program.id)}
          className="mt-7 w-full"
        >
          View program
          <ArrowRight size={17} />
        </Button>
      </div>
    </Card>
  );
}

function InfoTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[var(--radius-md)] bg-[var(--surface-soft)] px-4 py-3">
      <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-muted)]">
        {icon}
        {label}
      </div>

      <p className="mt-1 font-bold text-[var(--text)]">
        {value}
      </p>
    </div>
  );
}