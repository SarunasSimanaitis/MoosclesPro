import Card from "../ui/Card";
import ProgressBar from "../ui/ProgressBar";
import { dashboard } from "../../data/dashboard";

export default function WeeklyGoalCard() {
  const {
    completed,
    target,
  } = dashboard.weeklyGoal;

  const remaining = Math.max(
    0,
    target - completed,
  );

  return (
    <Card className="space-y-5 p-7">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--primary)]">
          Weekly Goal
        </p>

        <h2 className="mt-3 text-3xl font-black text-[var(--text)]">
          {completed} / {target}
        </h2>
      </div>

      <ProgressBar
        value={completed}
        max={target}
      />

      <p className="text-sm text-[var(--text-muted)]">
        {remaining === 0
          ? "Goal completed this week 🎉"
          : `${remaining} workout${
              remaining === 1 ? "" : "s"
            } left this week.`}
      </p>
    </Card>
  );
}