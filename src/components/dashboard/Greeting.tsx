import { getGreeting } from "../../utils/greeting";

type GreetingProps = {
  name?: string | null;
};

export default function Greeting({
  name,
}: GreetingProps) {
  const greeting = getGreeting();

  const firstName =
    name?.trim().split(/\s+/)[0] ||
    "there";

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
        {greeting.title}
      </p>

      <h1 className="mt-3 text-4xl font-black tracking-tight text-[var(--text)] md:text-5xl">
        {greeting.title},{" "}
        {firstName}.
      </h1>

      <p className="mt-3 text-lg text-[var(--text-muted)]">
        {greeting.subtitle}
      </p>
    </div>
  );
}