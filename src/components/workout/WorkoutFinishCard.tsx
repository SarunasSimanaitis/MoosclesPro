import {
  CheckCircle2,
  Circle,
} from "lucide-react";

import Button from "../ui/Button";
import Card from "../ui/Card";

type WorkoutFinishCardProps = {
  completedSets: number;
  totalSets: number;
  isFinishing: boolean;
  onFinish: () => void;
};

export default function WorkoutFinishCard({
  completedSets,
  totalSets,
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
                isComplete
                  ? "bg-[var(--success-soft)] text-[var(--success)]"
                  : "bg-[var(--surface-soft)] text-[var(--text-muted)]"
              }
            `}
          >
            {isComplete ? (
              <CheckCircle2 size={22} />
            ) : (
              <Circle size={22} />
            )}
          </div>

          <div>
            <p className="font-bold text-[var(--text)]">
              {isComplete
                ? "Workout complete!"
                : "Almost there"}
            </p>

            <p className="mt-1 text-sm leading-relaxed text-[var(--text-muted)]">
              {isComplete
                ? "You've completed every planned set. Save your workout to your history."
                : `${completedSets} of ${totalSets} sets completed. You can finish now or keep going.`}
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