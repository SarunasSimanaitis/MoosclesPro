import { ArrowRight, CalendarDays, Clock3, Dumbbell } from "lucide-react";

import type { Program } from "../../types/Program";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import Card from "../ui/Card";

type ProgramCardProps = {
  program: Program;
  onView: (programId: string) => void;
};

export default function ProgramCard({ program, onView }: ProgramCardProps) {
  return (
    <Card hover className="overflow-hidden">
      <div className="border-b border-[var(--border)] bg-[var(--feature-background)] p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]">
            <Dumbbell size={23} />
          </div>
          <Badge variant="primary">Free</Badge>
        </div>

        <h2 className="mt-5 text-2xl font-black tracking-tight text-[var(--feature-text)]">
          {program.name}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--feature-muted)]">
          {program.description}
        </p>
      </div>

      <div className="p-5 sm:p-6">
        <div className="grid grid-cols-2 gap-2.5">
          <InfoTile icon={<CalendarDays size={14} />} label="Schedule" value={`${program.daysPerWeek} days`} />
          <InfoTile icon={<Clock3 size={14} />} label="Session" value={`~${program.sessionMinutes} min`} />
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant="primary">{program.goal}</Badge>
          <Badge>{program.environment}</Badge>
          <Badge>{program.difficulty}</Badge>
        </div>

        <Button className="mt-5 w-full" onClick={() => onView(program.id)}>
          View program
          <ArrowRight size={16} />
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
    <div className="rounded-[var(--radius-md)] bg-[var(--surface-soft)] px-3.5 py-3">
      <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-muted)]">
        {icon}
        {label}
      </div>
      <p className="mt-1 font-black">{value}</p>
    </div>
  );
}