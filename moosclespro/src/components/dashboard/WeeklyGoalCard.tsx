import Card from "../ui/Card";
import ProgressBar from "../ui/ProgressBar";
import { dashboard } from "../../data/dashboard";

export default function WeeklyGoalCard() {
  const { completed, target } = dashboard.weeklyGoal;

  const remaining = target - completed;

  return (
    <Card className="space-y-5">
      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">
          Weekly Goal
        </p>

        <h2 className="mt-3 text-3xl font-bold text-zinc-50">
          {completed} / {target}
        </h2>
      </div>

      <ProgressBar value={completed} max={target} />

      <p className="text-sm text-zinc-400">
        {remaining === 0
          ? "Goal completed this week 🎉"
          : `${remaining} workout${remaining === 1 ? "" : "s"} left this week.`}
      </p>
    </Card>
  );
}
