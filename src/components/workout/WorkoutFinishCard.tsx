import {
  CheckCircle2,
  Circle,
  Trophy,
} from "lucide-react";

import Button from "../ui/Button";
import Card from "../ui/Card";

type WorkoutFinishCardProps = {
  completedSets: number;
  totalSets: number;
  personalRecordCount?: number;
  isFinishing: boolean;
  onFinish: () => void;
};

export default function WorkoutFinishCard({
  completedSets,
  totalSets,
  personalRecordCount = 0,
  isFinishing,
  onFinish,
}: WorkoutFinishCardProps) {
  const isComplete =
    totalSets > 0 &&
    completedSets === totalSets;
  const hasStarted = completedSets > 0;
  const remainingSets = Math.max(0, totalSets - completedSets);
  const completion = totalSets > 0
    ? Math.min(100, Math.round((completedSets / totalSets) * 100))
    : 0;

  return (
    <Card className="overflow-hidden border-[var(--primary)]/20 p-5 shadow-[var(--shadow-lg)] sm:p-6 md:p-7">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 flex-1 items-start gap-3.5 sm:gap-4">
          <div
            className={`
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-[var(--radius-lg)]
              ${personalRecordCount > 0
                ? "bg-[var(--primary-soft)] text-[var(--primary)]"
                : isComplete
                  ? "bg-[var(--success-soft)] text-[var(--success)]"
                  : "bg-[var(--surface-soft)] text-[var(--text-muted)]"}
            `}
          >
            {personalRecordCount > 0 ? (
              <Trophy size={22} aria-hidden="true" />
            ) : isComplete ? (
              <CheckCircle2 size={22} aria-hidden="true" />
            ) : (
              <Circle size={22} aria-hidden="true" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-bold tracking-tight text-[var(--text)]">
                {!hasStarted
                  ? "Ready when you are"
                  : isComplete
                    ? personalRecordCount > 0 ? "Workout complete — new best!" : "Workout complete!"
                    : "Nice work. Keep going or wrap up."}
              </p>
              {isComplete && (
                <span className="rounded-full bg-[var(--success-soft)] px-2.5 py-1 text-[11px] font-bold tracking-wide text-[var(--success)]">
                  100% complete
                </span>
              )}
            </div>

            <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-muted)]">
              {!hasStarted
                ? "Log at least one completed set before saving this workout."
                : isComplete
                  ? personalRecordCount > 0
                    ? `Every planned set is done, and you earned ${personalRecordCount} new personal ${personalRecordCount === 1 ? "record" : "records"}. Save this session to your history.`
                    : "Every planned set is done. Save this session to your workout history."
                  : `${completedSets} of ${totalSets} sets completed. ${remainingSets} ${remainingSets === 1 ? "set" : "sets"} left — you can keep training or finish and save what you've done.`}
            </p>

            {hasStarted && (
              <div className="mt-4 max-w-xl">
                <div className="mb-1.5 flex items-center justify-between gap-3 text-[11px] font-bold">
                  <span className="text-[var(--text-muted)]">Session progress</span>
                  <span className="tabular-nums text-[var(--primary)]">{completion}%</span>
                </div>
                <div
                  className="h-2 overflow-hidden rounded-full bg-[var(--surface-soft)]"
                  role="progressbar"
                  aria-label="Session completion"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={completion}
                >
                  <div
                    className={`h-full rounded-full transition-[width] duration-500 ${isComplete ? "bg-[var(--success)]" : "bg-[var(--primary)]"}`}
                    style={{ width: `${completion}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <Button
          size="lg"
          loading={isFinishing}
          disabled={!hasStarted}
          onClick={onFinish}
          className="w-full shrink-0 md:w-auto"
        >
          {isFinishing
            ? "Saving..."
            : isComplete
              ? "Save workout"
              : "Finish & save"}
        </Button>
      </div>
    </Card>
  );
}
