import { dashboard } from "../../data/dashboard";
import { getGreeting } from "../../utils/greeting";

export default function Greeting() {
  const greeting = getGreeting();

  return (
    <div>
      <h1 className="text-5xl font-bold tracking-tight">
        {greeting.title}, {dashboard.user.name}
      </h1>

      <p className="mt-2 text-zinc-400">
        {greeting.subtitle}
      </p>
    </div>
  );
}