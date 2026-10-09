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

  return (
    <Card className="p-6 md:p-7">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <div
            className={`
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-full
              ${
                personalRecordCount > 0
                  ? "bg-[var(--primary-soft)] text-[var(--primary)]"
                  : isComplete
                  ? "bg-[var(--success-soft)] text-[var(--success)]"
                  : "bg-[var(--surface-soft)] text-[var(--text-muted)]"
              }
            `}
          >
            {personalRecordCount > 0 ? (
              <Trophy size={22} />
            ) : isComplete ? (
              <CheckCircle2 size={22} />
            ) : (
              <Circle size={22} />
            )}
          </div>

          <div>
            <p className="font-bold text-[var(--text)]">
              {isComplete
                ? personalRecordCount > 0 ? "Workout complete — new best!" : "Workout complete!"
                : "Almost there"}
            </p>

            <p className="mt-1 text-sm leading-relaxed text-[var(--text-muted)]">
              {isComplete
                ? personalRecordCount > 0
                  ? `You completed every set and earned ${personalRecordCount} personal ${personalRecordCount === 1 ? "record" : "records"}. Save this session to your history.`
                  : "You've completed every planned set. Save your workout to your history."
                : `${completedSets} of ${totalSets} sets completed${personalRecordCount > 0 ? ` · ${personalRecordCount} new ${personalRecordCount === 1 ? "record" : "records"}` : ""}. You can finish now or keep going.`}
            </p>
          </div>
        </div>

        <Button
          size="lg"
          loading={isFinishing}
          onClick={onFinish}
          className="w-full md:w-auto"
        >
          {isFinishing
            ? "Saving..."
            : "Finish workout"}
        </Button>
      </div>
    </Card>
  );
}
