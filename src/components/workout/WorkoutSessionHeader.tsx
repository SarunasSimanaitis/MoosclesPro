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
import type { WeightUnit } from "../../lib/units";
import { formatVolume } from "../../lib/units";

type WorkoutSessionHeaderProps = {
  routineName: string;
  exerciseCount: number;
  completedSets: number;
  totalSets: number;
  progress: number;
  totalVolume: number;
  weightUnit: WeightUnit;
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
  weightUnit,
  formattedTime,
  isPaused,
  onTogglePause,
}: WorkoutSessionHeaderProps) {
  return (
    <Card className="p-3.5 sm:p-5 md:p-7">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--primary)] sm:text-xs sm:tracking-[0.22em]">
            Active workout
          </p>
          <h1 className="mt-1 line-clamp-2 break-words text-xl font-black leading-tight tracking-tight text-[var(--text)] sm:text-2xl md:text-3xl">
            {routineName}
          </h1>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div className="hidden min-w-20 rounded-2xl bg-[var(--surface-soft)] px-3 py-2 text-center sm:block">
            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">Time</p>
            <p className="mt-0.5 font-mono text-sm font-black tabular-nums text-[var(--text)]">{formattedTime}</p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={onTogglePause}
            aria-label={isPaused ? "Resume workout" : "Pause workout"}
            className="min-h-10 min-w-10 gap-1.5 rounded-2xl px-3 sm:min-w-24 sm:rounded-full"
          >
            {isPaused ? <Play size={15} aria-hidden="true" /> : <Pause size={15} aria-hidden="true" />}
            <span>{isPaused ? "Resume" : "Pause"}</span>
          </Button>
        </div>
      </div>

      <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] font-semibold text-[var(--text-muted)] sm:mt-3 sm:gap-x-5 sm:text-sm">
        <span className="inline-flex items-center gap-1.5">
          <Dumbbell size={14} aria-hidden="true" />
          {exerciseCount} {exerciseCount === 1 ? "exercise" : "exercises"}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <CheckCircle2 size={14} aria-hidden="true" />
          {completedSets}/{totalSets} sets
        </span>
        <span className="inline-flex items-center gap-1.5 font-mono tabular-nums sm:hidden">
          <Clock3 size={14} aria-hidden="true" />
          {formattedTime}
        </span>
        <span className="hidden sm:inline">{formatVolume(totalVolume, weightUnit)} {weightUnit} volume</span>
      </div>

      {isPaused && (
        <div role="status" className="mt-3 rounded-2xl border border-[var(--primary)]/20 bg-[var(--primary-soft)] px-3 py-2.5 text-xs font-semibold text-[var(--primary)] sm:mt-4 sm:px-4 sm:py-3 sm:text-sm">
          Workout paused. Your active training time is not increasing.
        </div>
      )}

      <div className="mt-3 sm:mt-4">
        <div className="mb-1.5 flex items-center justify-between gap-3 text-[10px] font-semibold sm:mb-2 sm:text-xs">
          <span className="text-[var(--text-muted)]">Workout progress</span>
          <span className="text-[var(--primary)]">{Math.round(progress)}%</span>
        </div>
        <ProgressBar value={completedSets} max={totalSets} label="Workout completion" />
      </div>

      <div className="mt-4 hidden grid-cols-3 gap-2 sm:grid">
        <SessionMetric label="Exercises" value={exerciseCount.toString()} />
        <SessionMetric label="Completed" value={`${completedSets}/${totalSets}`} />
        <SessionMetric label="Volume" value={`${formatVolume(totalVolume, weightUnit)} ${weightUnit}`} />
      </div>
    </Card>
  );
}

function SessionMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[var(--surface-soft)] px-3 py-2.5 sm:px-4 sm:py-3">
      <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)] sm:text-[10px]">{label}</p>
      <p className="mt-0.5 text-sm font-black text-[var(--text)] sm:mt-1">{value}</p>
    </div>
  );
}
