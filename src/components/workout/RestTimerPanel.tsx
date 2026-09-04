import {
  Bell,
  Minus,
  Plus,
  RotateCcw,
} from "lucide-react";

import Button from "../ui/Button";
import Card from "../ui/Card";

type RestTimerPanelProps = {
  restTime: number;
  restDuration: number;
  onAdd: () => void;
  onRemove: () => void;
  onStop: () => void;
};

export default function RestTimerPanel({
  restTime,
  restDuration,
  onAdd,
  onRemove,
  onStop,
}: RestTimerPanelProps) {
  const percentage =
    restDuration > 0
      ? Math.min(
          100,
          Math.max(
            0,
            (restTime / restDuration) * 100,
          ),
        )
      : 0;

  return (
    <Card
      className="
        sticky
        top-[10.75rem]
        z-20
        border-[var(--primary)]
        border-opacity-30
        bg-[var(--primary-soft)]
        p-4
        shadow-[var(--shadow-md)]
        backdrop-blur-xl
        sm:p-5
      "
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--primary)] shadow-[var(--shadow-sm)]">
            <Bell
              size={19}
              strokeWidth={2}
            />
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--primary)]">
              Rest timer
            </p>

            <p
              className="
                mt-0.5
                font-mono
                text-2xl
                font-black
                tracking-tight
                text-[var(--text)]
                sm:text-3xl
              "
              aria-live="polite"
            >
              {formatRestTime(restTime)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={onRemove}
            aria-label="Remove 15 seconds from rest timer"
            className="px-3"
          >
            <Minus size={15} />
            <span className="hidden sm:inline">
              15s
            </span>
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={onAdd}
            aria-label="Add 15 seconds to rest timer"
            className="px-3"
          >
            <Plus size={15} />
            <span className="hidden sm:inline">
              15s
            </span>
          </Button>

          <Button
            size="sm"
            onClick={onStop}
            aria-label="Stop rest timer"
            className="px-3"
          >
            <RotateCcw size={15} />
            <span className="hidden sm:inline">
              Skip
            </span>
          </Button>
        </div>
      </div>

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[var(--surface)]">
        <div
          className="
            h-full
            rounded-full
            bg-[var(--primary)]
            transition-[width]
            duration-1000
            ease-linear
          "
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </Card>
  );
}

function formatRestTime(
  seconds: number,
) {
  const safeSeconds = Math.max(
    0,
    Math.floor(seconds),
  );

  const minutes = Math.floor(
    safeSeconds / 60,
  );

  const remainingSeconds =
    safeSeconds % 60;

  return `${minutes
    .toString()
    .padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}