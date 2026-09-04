import {
  CheckCircle2,
  Clock3,
  Dumbbell,
  Pause,
  Play,
} from "lucide-react";

import Button from "../ui/Button";
import Card from "../ui/Card";
import ProgressBar from "../ui/ProgressBar";

type WorkoutSessionHeaderProps = {
  routineName: string;
  exerciseCount: number;
  completedSets: number;
  totalSets: number;
  progress: number;
  totalVolume: number;
  formattedTime: string;
  isPaused: boolean;
  onTogglePause: () => void;
};

export default function WorkoutSessionHeader({
  routineName,
  exerciseCount,
  completedSets,
  totalSets,
  progress,
  totalVolume,
  formattedTime,
  isPaused,
  onTogglePause,
}: WorkoutSessionHeaderProps) {
  return (
    <Card
      className="
        sticky
        top-[5rem]
        z-30
        p-5
        shadow-[var(--shadow-md)]
        md:p-7
      "
    >
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--primary)]">
              Active workout
            </p>

            <h1 className="mt-1 truncate text-2xl font-black tracking-tight text-[var(--text)] md:text-3xl">
              {routineName}
            </h1>

            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-[var(--text-muted)] md:text-sm">
              <span className="inline-flex items-center gap-1.5">
                <Dumbbell size={15} />
                {exerciseCount}{" "}
                {exerciseCount === 1
                  ? "exercise"
                  : "exercises"}
              </span>

              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 size={15} />
                {completedSets}/
                {totalSets} sets
              </span>

              <span className="inline-flex items-center gap-1.5 font-mono">
                <Clock3 size={15} />
                {formattedTime}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div
              className="
                hidden
                min-w-28
                rounded-[var(--radius-md)]
                bg-[var(--surface-soft)]
                px-4
                py-3
                text-center
                sm:block
              "
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]">
                Time
              </p>

              <p className="mt-1 font-mono text-lg font-black text-[var(--text)]">
                {formattedTime}
              </p>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={onTogglePause}
              aria-label={
                isPaused
                  ? "Resume workout"
                  : "Pause workout"
              }
              className="min-w-24"
            >
              {isPaused ? (
                <>
                  <Play size={16} />
                  Resume
                </>
              ) : (
                <>
                  <Pause size={16} />
                  Pause
                </>
              )}
            </Button>
          </div>
        </div>

        {isPaused && (
          <div
            role="status"
            className="
              rounded-[var(--radius-md)]
              border
              border-[var(--primary)]
              border-opacity-20
              bg-[var(--primary-soft)]
              px-4
              py-3
              text-sm
              font-semibold
              text-[var(--primary)]
            "
          >
            Workout paused. Your active training
            time is not increasing.
          </div>
        )}

        <div>
          <div className="mb-2 flex items-center justify-between gap-3 text-xs font-semibold">
            <span className="text-[var(--text-muted)]">
              Workout progress
            </span>

            <span className="text-[var(--primary)]">
              {Math.round(progress)}%
            </span>
          </div>

          <ProgressBar
            value={completedSets}
            max={totalSets}
            label="Workout completion"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <SessionMetric
            label="Exercises"
            value={exerciseCount.toString()}
          />

          <SessionMetric
            label="Completed"
            value={`${completedSets}/${totalSets}`}
          />

          <SessionMetric
            label="Volume"
            value={`${totalVolume.toLocaleString()} kg`}
            className="col-span-2 sm:col-span-1"
          />
        </div>
      </div>
    </Card>
  );
}

function SessionMetric({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div
      className={`
        rounded-[var(--radius-md)]
        bg-[var(--surface-soft)]
        px-3
        py-3
        ${className}
      `}
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
        {label}
      </p>

      <p className="mt-1 text-sm font-black text-[var(--text)]">
        {value}
      </p>
    </div>
  );
}