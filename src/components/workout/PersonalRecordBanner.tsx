import { Sparkles, Trophy } from "lucide-react";

import Card from "../ui/Card";
import type { WeightUnit } from "../../lib/units";
import { formatWeight } from "../../lib/units";
import type { WorkoutPersonalRecord } from "../../lib/personalRecords";

export default function PersonalRecordBanner({
  records,
  weightUnit,
}: {
  records: WorkoutPersonalRecord[];
  weightUnit: WeightUnit;
}) {
  if (records.length === 0) return null;

  return (
    <Card className="personal-record-banner overflow-hidden border-[var(--primary)]/35 bg-[var(--primary-soft)] p-4 shadow-[var(--shadow-sm)] sm:p-5">
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm sm:h-12 sm:w-12">
          <Trophy size={21} aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h2 className="text-base font-black tracking-tight text-[var(--text)] sm:text-lg">A new personal best</h2>
            <Sparkles size={15} className="text-[var(--primary)]" aria-hidden="true" />
          </div>
          <p className="mt-1 text-xs leading-relaxed text-[var(--text-muted)] sm:text-sm">
            {records.length === 1 ? "You just improved one of your records." : `You just improved ${records.length} records.`} Keep that momentum.
          </p>

          <ul className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {records.map((record) => (
              <li key={`${record.exerciseId}-${record.kind}`} className="rounded-2xl border border-[var(--primary)]/15 bg-[var(--surface)]/75 px-3.5 py-3">
                <p className="truncate text-xs font-black text-[var(--text)]">{record.exerciseName}</p>
                <div className="mt-1 flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--text-muted)]">{record.kind === "load" ? "Heaviest set" : record.kind === "estimated-one-rep-max" ? "Estimated 1RM" : "Rep record"}</span>
                  <strong className="text-xs font-black tabular-nums text-[var(--primary)]">{formatRecordValue(record, weightUnit)}</strong>
                </div>
                {record.previousValue === null && <p className="mt-1 text-[10px] font-medium text-[var(--text-muted)]">First record logged</p>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}

function formatRecordValue(record: WorkoutPersonalRecord, unit: WeightUnit) {
  if (record.kind === "reps") return `${record.value} reps`;
  if (record.kind === "estimated-one-rep-max") return `≈ ${formatWeight(record.value, unit)} ${unit}`;
  return `${formatWeight(record.value, unit)} ${unit} × ${record.reps}`;
}
