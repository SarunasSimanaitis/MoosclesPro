import { dashboard } from "../../data/dashboard";
import { getGreeting } from "../../utils/greeting";

export default function Greeting() {
  const greeting = getGreeting();

  return (
    <div>
      <h1 className="text-4xl font-black tracking-tight text-[var(--text)] md:text-5xl">
        {greeting.title}, {dashboard.user.name}
      </h1>

      <p className="mt-3 text-lg text-[var(--text-muted)]">
        {greeting.subtitle}
      </p>
    </div>
  );
}