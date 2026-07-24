import { Play, Clock3, Dumbbell } from "lucide-react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { dashboard } from "../../data/dashboard";
import { useNavigate } from "react-router-dom";

export default function TodayWorkoutCard() {
  const { todayWorkout } = dashboard;

  const navigate = useNavigate();
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">
            Today's Workout
          </p>

          <h2 className="mt-3 text-4xl font-bold">{todayWorkout.title}</h2>

          <div className="mt-5 flex gap-6 text-sm text-zinc-400">
            <div className="flex items-center gap-2">
              <Clock3 size={18} />
              <span>{todayWorkout.duration}</span>
            </div>

            <div className="flex items-center gap-2">
              <Dumbbell size={18} />
              <span>{todayWorkout.exercises} exercises</span>
            </div>
          </div>
        </div>

        <Button onClick={() => navigate("/workout")}>
          <Play size={18} />
          <span>Start Workout</span>
        </Button>
      </div>
    </Card>
  );
}
