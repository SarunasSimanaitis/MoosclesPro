import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  Dumbbell,
  Target,
} from "lucide-react";
import { useMemo } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { programs } from "../data/programs";
import { routines } from "../data/routines";

type ProgramHighlightProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

function ProgramHighlight({
  icon,
  label,
  value,
}: ProgramHighlightProps) {
  return (
    <div
      className="
        rounded-[var(--radius-lg)]
        border
        border-[var(--feature-border)]
        bg-[var(--feature-surface)]
        p-4
        backdrop-blur-sm
      "
    >
      <div className="text-[var(--primary)]">
        {icon}
      </div>

      <p className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-[var(--feature-subtle)]">
        {label}
      </p>

      <p className="mt-1 font-bold text-[var(--feature-text)]">
        {value}
      </p>
    </div>
  );
}

export default function ProgramDetails() {
  const navigate = useNavigate();

  const { programId } =
    useParams<{ programId: string }>();

  const program = useMemo(
    () =>
      programs.find(
        (item) => item.id === programId,
      ),
    [programId],
  );

  if (!program) {
    return (
      <main className="space-y-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            navigate("/workouts")
          }
          className="w-fit px-2"
        >
          <ArrowLeft size={17} />
          Back to workouts
        </Button>

        <Card className="p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--danger-soft)] text-[var(--danger)]">
            <Target size={24} />
          </div>

          <h1 className="mt-6 text-3xl font-black tracking-tight text-[var(--text)]">
            Program not found
          </h1>

          <p className="mx-auto mt-3 max-w-md text-[var(--text-muted)]">
            This training program may no longer
            be available.
          </p>

          <Button
            variant="secondary"
            onClick={() =>
              navigate("/workouts")
            }
            className="mt-7"
          >
            Return to workouts
          </Button>
        </Card>
      </main>
    );
  }

  const programDays = program.days.map(
    (day) => ({
      ...day,
      routine: routines.find(
        (routine) =>
          routine.id === day.routineId,
      ),
    }),
  );

  const totalExercises =
    programDays.reduce(
      (total, day) =>
        total +
        (day.routine?.exercises.length ?? 0),
      0,
    );

  function startRoutine(
    routineId: string,
  ) {
    navigate(
      `/workout/${encodeURIComponent(
        routineId,
      )}`,
    );
  }

  return (
    <main className="space-y-10">
      {/* Navigation */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() =>
          navigate("/workouts")
        }
        className="w-fit px-2"
      >
        <ArrowLeft size={17} />
        Back to workouts
      </Button>

      {/* Hero */}
      <section
        className="
          relative
          overflow-hidden
          rounded-[var(--radius-xl)]
          bg-[var(--feature-background)]
          px-6
          py-8
          md:px-10
          md:py-12
        "
      >
        <div
          aria-hidden="true"
          className="
            absolute
            -right-24
            -top-24
            h-72
            w-72
            rounded-full
            bg-[var(--primary)]
            opacity-15
            blur-3xl
          "
        />

        <div
          aria-hidden="true"
          className="
            absolute
            -bottom-28
            -left-16
            h-56
            w-56
            rounded-full
            bg-[var(--primary)]
            opacity-10
            blur-3xl
          "
        />

        <div className="relative max-w-5xl">
          <div className="flex flex-wrap gap-2">
            <Badge variant="primary">
              Free program
            </Badge>

            <span
              className="
                inline-flex
                items-center
                rounded-full
                border
                border-[var(--feature-border)]
                bg-[var(--feature-surface)]
                px-3
                py-1.5
                text-xs
                font-semibold
                text-[var(--feature-muted)]
              "
            >
              {program.difficulty}
            </span>
          </div>

          <h1 className="mt-6 max-w-4xl text-4xl font-black tracking-tight text-[var(--feature-text)] md:text-6xl">
            {program.name}
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--feature-muted)]">
            {program.description}
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <ProgramHighlight
              icon={<CalendarDays size={18} />}
              label="Frequency"
              value={`${program.daysPerWeek} days/week`}
            />

            <ProgramHighlight
              icon={<Clock3 size={18} />}
              label="Session"
              value={`~${program.sessionMinutes} min`}
            />

            <ProgramHighlight
              icon={<Target size={18} />}
              label="Goal"
              value={program.goal}
            />
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card className="p-7 md:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--primary-soft)] text-[var(--primary)]">
              <Dumbbell size={21} />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--primary)]">
                Program overview
              </p>

              <h2 className="mt-1 text-2xl font-black tracking-tight text-[var(--text)]">
                What you'll be doing
              </h2>
            </div>
          </div>

          <p className="mt-6 leading-relaxed text-[var(--text-muted)]">
            This program gives you a structured
            weekly training schedule while keeping
            each individual session focused and
            manageable.
          </p>

          <div className="mt-7 space-y-3">
            {[
              `${program.daysPerWeek} structured training days each week`,
              `${program.sessionMinutes}-minute average sessions`,
              `${totalExercises} total exercise slots across the week`,
              `${program.environment} training`,
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--success-soft)] text-[var(--success)]">
                  <Check
                    size={15}
                    strokeWidth={3}
                  />
                </div>

                <span className="text-sm font-medium text-[var(--text)]">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-7">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--primary)]">
            Built for
          </p>

          <div className="mt-5 divide-y divide-[var(--border)]">
            <div className="pb-4">
              <p className="text-xs text-[var(--text-muted)]">
                Goal
              </p>
              <p className="mt-1 font-bold text-[var(--text)]">
                {program.goal}
              </p>
            </div>

            <div className="py-4">
              <p className="text-xs text-[var(--text-muted)]">
                Experience
              </p>
              <p className="mt-1 font-bold text-[var(--text)]">
                {program.difficulty}
              </p>
            </div>

            <div className="pt-4">
              <p className="text-xs text-[var(--text-muted)]">
                Equipment
              </p>
              <p className="mt-1 font-bold text-[var(--text)]">
                {program.environment}
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* Weekly structure */}
      <section className="space-y-6">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--primary)]">
            Your week
          </p>

          <h2 className="mt-2 text-3xl font-black tracking-tight text-[var(--text)] md:text-4xl">
            Weekly structure
          </h2>

          <p className="mt-2 max-w-2xl text-[var(--text-muted)]">
            Complete the sessions in order and give
            yourself enough recovery between them.
          </p>
        </div>

        <div className="space-y-4">
          {programDays.map(
            ({
              day,
              name,
              routine,
            }) => {
              if (!routine) {
                return (
                  <Card
                    key={day}
                    className="border-[var(--danger)]/30 bg-[var(--danger-soft)] p-6 shadow-none"
                  >
                    <p className="font-bold text-[var(--danger)]">
                      Day {day}: Routine unavailable
                    </p>
                  </Card>
                );
              }

              return (
                <Card
                  key={routine.id}
                  hover
                  className="p-6 md:p-7"
                >
                  <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="flex min-w-0 gap-5">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--primary-soft)] font-black text-[var(--primary)]">
                        {day}
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                          Day {day}
                        </p>

                        <h3 className="mt-1 text-2xl font-black tracking-tight text-[var(--text)]">
                          {name}
                        </h3>

                        <p className="mt-1 text-sm text-[var(--text-muted)]">
                          {routine.exercises.length}{" "}
                          exercises · ~
                          {Math.max(
                            20,
                            routine.exercises.length *
                              10,
                          )}{" "}
                          min
                        </p>
                      </div>
                    </div>

                    <Button
                      onClick={() =>
                        startRoutine(routine.id)
                      }
                      className="shrink-0"
                    >
                      Start workout
                      <ArrowRight size={17} />
                    </Button>
                  </div>

                  <div className="mt-6 grid gap-2 border-t border-[var(--border)] pt-5 sm:grid-cols-2">
                    {routine.exercises.map(
                      (
                        routineExercise,
                        index,
                      ) => (
                        <div
                          key={`${routine.id}-${routineExercise.exercise.id}-${index}`}
                          className="
                            flex
                            items-center
                            justify-between
                            gap-3
                            rounded-[var(--radius-md)]
                            bg-[var(--surface-soft)]
                            px-4
                            py-3
                          "
                        >
                          <span className="truncate text-sm font-medium text-[var(--text)]">
                            {routineExercise.exercise.name}
                          </span>

                          <span className="shrink-0 text-xs font-semibold text-[var(--text-muted)]">
                            {routineExercise.targetSets}{" "}
                            ×{" "}
                            {routineExercise.targetReps}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </Card>
              );
            },
          )}
        </div>
      </section>

      {/* Future personalization */}
      <section className="overflow-hidden rounded-[var(--radius-xl)] bg-[var(--surface-soft)] p-7 md:p-10">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--primary)]">
            One size doesn't fit everyone
          </p>

          <h2 className="mt-4 text-3xl font-black tracking-tight text-[var(--text)] md:text-4xl">
            Want something built around you?
          </h2>

          <p className="mt-4 leading-relaxed text-[var(--text-muted)]">
            Personalized training will eventually
            take your goals, experience, schedule,
            available equipment, and training
            preferences into account.
          </p>

          <Button
            variant="secondary"
            disabled
            className="mt-7"
          >
            Personalize my training
            <span className="text-xs font-medium text-[var(--text-muted)]">
              Coming soon
            </span>
          </Button>
        </div>
      </section>
    </main>
  );
}