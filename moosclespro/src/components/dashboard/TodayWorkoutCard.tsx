import {
  Clock3,
  Dumbbell,
  Play,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { dashboard } from "../../data/dashboard";
import Card from "../ui/Card";
import Button from "../ui/Button";

export default function TodayWorkoutCard() {
  const { todayWorkout } = dashboard;
  const navigate = useNavigate();

  return (
    <Card className="p-7">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--primary)]">
            Today's Workout
          </p>

          <h2 className="mt-3 text-3xl font-black text-[var(--text)] md:text-4xl">
            {todayWorkout.title}
          </h2>

          <div className="mt-5 flex flex-wrap gap-5 text-sm text-[var(--text-muted)]">
            <div className="flex items-center gap-2">
              <Clock3 size={18} />

              <span>{todayWorkout.duration}</span>
            </div>

            <div className="flex items-center gap-2">
              <Dumbbell size={18} />

              <span>
                {todayWorkout.exercises} exercises
              </span>
            </div>
          </div>
        </div>

        <Button
          onClick={() => navigate("/workout")}
          className="shrink-0"
        >
          <Play size={18} />
          Start Workout
        </Button>
      </div>
    </Card>
  );
}