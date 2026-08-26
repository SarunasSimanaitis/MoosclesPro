import Card from "../ui/Card";
import ProgressBar from "../ui/ProgressBar";
import { dashboard } from "../../data/dashboard";

export default function HeroCard() {
  const { level } = dashboard;

  return (
    <Card className="overflow-hidden p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--primary)]">
        Current Level
      </p>

      <h1 className="mt-5 text-7xl font-black tracking-tight text-[var(--text)]">
        {level.current}
      </h1>

      <p className="mt-2 text-xl font-semibold text-[var(--primary)]">
        {level.title}
      </p>

      <ProgressBar
        value={level.xp}
        max={level.nextLevelXp}
        className="mt-6"
      />

      <div className="mt-4 flex justify-between text-sm text-[var(--text-muted)]">
        <span>{level.xp} XP</span>

        <span>{level.nextLevelXp} XP</span>
      </div>
    </Card>
  );
}