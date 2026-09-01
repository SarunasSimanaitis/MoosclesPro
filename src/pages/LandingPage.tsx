import {
  ArrowRight,
  BarChart3,
  Check,
  Dumbbell,
  Flame,
  History,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import {
  NavLink,
} from "react-router-dom";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

const features = [
  {
    icon: Dumbbell,
    title: "Build routines",
    description:
      "Create structured workouts around your goals, exercises, sets, reps, and rest periods.",
  },
  {
    icon: TrendingUp,
    title: "Track every set",
    description:
      "Log weight, reps, completion, and training volume while you work out.",
  },
  {
    icon: BarChart3,
    title: "Understand progress",
    description:
      "Turn completed workouts into useful statistics and long-term training trends.",
  },
];

const benefits = [
  "Structured workout routines",
  "Set-by-set workout tracking",
  "Workout history",
  "Progress statistics",
  "Exercise library",
  "Training mindset",
];

export default function LandingPage() {
  return (
    <div className="space-y-28 pb-16">
      {/* Hero */}

      <section className="relative overflow-hidden pt-8 md:pt-14">
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-[var(--primary)]/10 blur-3xl" />

        <div className="relative grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--text-muted)] shadow-sm">
              <Sparkles
                size={15}
                className="text-[var(--primary)]"
              />
              Training made measurable.
            </div>

            <h1 className="mt-7 max-w-4xl text-5xl font-black tracking-tight text-[var(--text)] md:text-6xl lg:text-7xl">
              Train smarter.
              <span className="block text-[var(--primary)]">
                Keep progressing.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--text-muted)] md:text-xl">
              MoosclesPro helps you build workouts,
              track every set, understand your progress,
              and stay consistent without getting in
              the way of your training.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <NavLink to="/register">
                <Button
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Create free account
                  <ArrowRight size={18} />
                </Button>
              </NavLink>

              <NavLink to="/exercises">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Explore exercises
                </Button>
              </NavLink>
            </div>

            <p className="mt-4 text-sm text-[var(--text-muted)]">
              No account needed to explore the
              public parts of MoosclesPro.
            </p>
          </div>

          {/* Product preview */}

          <div className="relative">
            <div className="absolute -inset-6 rounded-[3rem] bg-[var(--primary)]/5 blur-2xl" />

            <Card className="relative overflow-hidden p-5 md:p-6">
              <div className="rounded-[1.5rem] bg-[var(--text)] p-5 text-[var(--surface)] md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
                      Active workout
                    </p>

                    <h2 className="mt-2 text-2xl font-black">
                      Upper Body
                    </h2>
                  </div>

                  <div className="rounded-xl bg-[var(--surface)]/10 px-3 py-2 text-sm font-bold">
                    42:18
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <PreviewSet
                    name="Bench Press"
                    detail="60 kg × 10"
                    complete
                  />

                  <PreviewSet
                    name="Incline Dumbbell Press"
                    detail="24 kg × 10"
                    complete
                  />

                  <PreviewSet
                    name="Cable Row"
                    detail="55 kg × 12"
                    complete
                  />
                </div>

                <div className="mt-6 grid grid-cols-3 gap-2">
                  <PreviewMetric
                    label="Sets"
                    value="9"
                  />

                  <PreviewMetric
                    label="Volume"
                    value="4,280 kg"
                  />

                  <PreviewMetric
                    label="Progress"
                    value="78%"
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Value proposition */}

      <section>
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--primary)]">
            Everything in one place
          </p>

          <h2 className="mt-3 text-4xl font-black tracking-tight text-[var(--text)] md:text-5xl">
            Your training should be easy to follow.
          </h2>

          <p className="mt-4 text-lg leading-relaxed text-[var(--text-muted)]">
            MoosclesPro keeps the important parts of
            training together without turning every
            workout into a spreadsheet.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {features.map(
            ({
              icon: Icon,
              title,
              description,
            }) => (
              <Card
                key={title}
                hover
                className="p-7"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]">
                  <Icon size={23} />
                </div>

                <h3 className="mt-6 text-xl font-black text-[var(--text)]">
                  {title}
                </h3>

                <p className="mt-3 leading-relaxed text-[var(--text-muted)]">
                  {description}
                </p>
              </Card>
            ),
          )}
        </div>
      </section>

      {/* Feature showcase */}

      <section className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--primary)]">
            Built around your training
          </p>

          <h2 className="mt-3 text-4xl font-black tracking-tight text-[var(--text)] md:text-5xl">
            Less friction.
            <span className="block">
              More consistency.
            </span>
          </h2>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-[var(--text-muted)]">
            The goal isn't to make fitness complicated.
            It is to make good training easier to repeat.
          </p>

          <div className="mt-8 space-y-4">
            {benefits.map(
              (benefit) => (
                <div
                  key={benefit}
                  className="flex items-center gap-3"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--primary-soft)] text-[var(--primary)]">
                    <Check size={15} />
                  </div>

                  <span className="font-semibold text-[var(--text)]">
                    {benefit}
                  </span>
                </div>
              ),
            )}
          </div>
        </div>

        <Card className="overflow-hidden p-6 md:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <MiniFeature
              icon={<Flame size={19} />}
              title="Consistency"
              value="Build the habit"
              description="Keep your training visible and repeatable."
            />

            <MiniFeature
              icon={<Target size={19} />}
              title="Goals"
              value="Know your direction"
              description="Use routines and statistics to stay focused."
            />

            <MiniFeature
              icon={<History size={19} />}
              title="History"
              value="Remember the work"
              description="Keep completed sessions available for review."
            />

            <MiniFeature
              icon={<BarChart3 size={19} />}
              title="Progress"
              value="See the trend"
              description="Turn training sessions into useful data."
            />
          </div>
        </Card>
      </section>

      {/* CTA */}

      <section className="overflow-hidden rounded-[2.5rem] bg-[var(--text)] p-8 text-[var(--surface)] md:p-12">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--primary)]">
            Start training
          </p>

          <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
            Your next workout starts here.
          </h2>

          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[var(--surface)]/70">
            Create your account, build a routine, and
            start turning your training into something you
            can actually measure.
          </p>

          <NavLink to="/register">
            <Button
              size="lg"
              className="mt-8"
            >
              Create your account
              <ArrowRight size={18} />
            </Button>
          </NavLink>
        </div>
      </section>
    </div>
  );
}

function PreviewSet({
  name,
  detail,
  complete = false,
}: {
  name: string;
  detail: string;
  complete?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-[var(--surface)]/10 px-4 py-3">
      <div className="min-w-0">
        <p className="truncate font-semibold">
          {name}
        </p>

        <p className="mt-1 text-xs text-[var(--surface)]/60">
          {detail}
        </p>
      </div>

      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
          complete
            ? "bg-[var(--primary)] text-[var(--text)]"
            : "border border-[var(--surface)]/20"
        }`}
      >
        {complete && (
          <Check size={15} />
        )}
      </div>
    </div>
  );
}

function PreviewMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-[var(--surface)]/10 p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--surface)]/50">
        {label}
      </p>

      <p className="mt-1 text-sm font-black">
        {value}
      </p>
    </div>
  );
}

function MiniFeature({
  icon,
  title,
  value,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl bg-[var(--surface-soft)] p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">
        {icon}
      </div>

      <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
        {title}
      </p>

      <h3 className="mt-2 text-lg font-black text-[var(--text)]">
        {value}
      </h3>

      <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
        {description}
      </p>
    </div>
  );
}