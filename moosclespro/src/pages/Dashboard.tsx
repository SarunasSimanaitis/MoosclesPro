import Greeting from "../components/dashboard/Greeting";
import HeroCard from "../components/dashboard/HeroCard";
import StatCard from "../components/ui/StatCard";
import TodayWorkoutCard from "../components/dashboard/TodayWorkoutCard";
import WeeklyGoalCard from "../components/dashboard/WeeklyGoalCard";

export default function Dashboard() {
  return (
    <div className="space-y-10">
      <Greeting />

      <TodayWorkoutCard />

 <WeeklyGoalCard />

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <HeroCard />
        </div>

        <div className="space-y-6">
          <StatCard label="Current Streak" value="14 Days" />

          <StatCard label="Workouts" value="126" />
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <StatCard label="Total Volume" value="58 240 kg" />

        <StatCard label="Hours Trained" value="187" />
      </section>
    </div>
  );
}
