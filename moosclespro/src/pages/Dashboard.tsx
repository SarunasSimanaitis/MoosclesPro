import {
  ArrowRight,
  Dumbbell,
  Flame,
  Target,
  TrendingUp,
} from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="space-y-10">
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--primary)]">
          Dashboard
        </p>

        <div className="mt-3 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-[var(--text)] md:text-5xl">
              Welcome back.
            </h1>

            <p className="mt-3 max-w-2xl text-lg text-[var(--text-muted)]">
              Stay consistent, keep progressing, and let the results follow.
            </p>
          </div>

          <NavLink
            to="/workout"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3 font-semibold text-white transition hover:bg-[var(--primary-hover)]"
          >
            Start Workout
            <ArrowRight size={18} />
          </NavLink>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<Flame size={20} />}
          label="Current Streak"
          value="14"
          suffix="days"
        />

        <StatCard
          icon={<Dumbbell size={20} />}
          label="Workouts"
          value="126"
          suffix="completed"
        />

        <StatCard
          icon={<TrendingUp size={20} />}
          label="Total Volume"
          value="58,240"
          suffix="kg"
        />

        <StatCard
          icon={<Target size={20} />}
          label="Weekly Goal"
          value="3"
          suffix="of 4"
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="relative overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-sm md:p-10">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[var(--primary)]/10 blur-3xl" />

          <div className="relative">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
              Today's workout
            </p>

            <h2 className="mt-4 text-3xl font-black text-[var(--text)]">
              Upper Body Strength
            </h2>

            <p className="mt-3 max-w-xl leading-relaxed text-[var(--text-muted)]">
              Focus on controlled reps, progressive overload, and quality
              movement. You've got this.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 text-sm text-[var(--text-muted)]">
              <span className="rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-2">
                5 exercises
              </span>

              <span className="rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-2">
                16 sets
              </span>

              <span className="rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-2">
                ~45 min
              </span>
            </div>

            <NavLink
              to="/workout"
              className="mt-8 inline-flex items-center gap-2 rounded-xl border border-[var(--border-strong)] px-5 py-3 font-semibold text-[var(--text)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
            >
              Continue workout
              <ArrowRight size={17} />
            </NavLink>
          </div>
        </div>

        <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
            Weekly goal
          </p>

          <h2 className="mt-3 text-2xl font-bold text-[var(--text)]">
            Keep the streak alive.
          </h2>

          <div className="mt-8">
            <div className="flex items-end justify-between">
              <span className="text-4xl font-black text-[var(--text)]">
                3/4
              </span>

              <span className="text-sm text-[var(--text-muted)]">
                workouts
              </span>
            </div>

            <div className="mt-4 h-3 overflow-hidden rounded-full bg-[var(--surface-soft)]">
              <div className="h-full w-3/4 rounded-full bg-[var(--primary)]" />
            </div>

            <p className="mt-4 text-sm leading-relaxed text-[var(--text-muted)]">
              One more workout this week and you've hit your goal.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--text)] p-8 text-[var(--surface)] md:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
          Mindset
        </p>

        <blockquote className="mt-4 max-w-4xl text-2xl font-bold leading-relaxed md:text-3xl">
          “You don't need to be motivated every day. You just need to keep
          showing up.”
        </blockquote>

        <NavLink
          to="/mindset"
          className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[var(--surface)] transition hover:text-[var(--primary)]"
        >
          Explore Mindset
          <ArrowRight size={16} />
        </NavLink>
      </section>
    </div>
  );
}

type StatCardProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  suffix: string;
};

function StatCard({
  icon,
  label,
  value,
  suffix,
}: StatCardProps) {
  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">
        {icon}
      </div>

      <p className="mt-6 text-sm text-[var(--text-muted)]">
        {label}
      </p>

      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-3xl font-black text-[var(--text)]">
          {value}
        </span>

        <span className="text-sm text-[var(--text-muted)]">
          {suffix}
        </span>
      </div>
    </div>
  );
}