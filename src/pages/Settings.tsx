import {
  Check,
  Dumbbell,
  Moon,
  Palette,
  ShieldCheck,
  Sun,
  Timer,
  UserCircle2,
  Minus,
  Plus,
  Target,
} from "lucide-react";
import { useState, type ReactNode } from "react";

import Card from "../components/ui/Card";
import { useTheme } from "../hooks/useTheme";
import { authClient } from "../lib/auth-client";
import { getAppPreferences, saveAppPreferences } from "../lib/preferences";

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { data: session, isPending } = authClient.useSession();
  const [preferences, setPreferences] = useState(getAppPreferences);
  const user = session?.user;
  const firstName = user?.name?.trim().split(/\s+/)[0] ?? "User";
  const email = user?.email ?? "No email available";

  function updateWeeklyGoal(delta: number) {
    setPreferences(saveAppPreferences({
      weeklyGoalTarget: preferences.weeklyGoalTarget + delta,
    }));
  }


  return (
    <main className="page-stack mx-auto max-w-7xl 2xl:max-w-[1500px] space-y-8 sm:space-y-10">
      <header className="max-w-4xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--primary)] sm:text-sm">Your space</p>
        <h1 className="mt-2 text-4xl font-black tracking-[-0.05em] sm:text-5xl lg:text-6xl">Settings</h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--text-muted)] sm:text-lg">
          Make MoosclesPro feel right for the way you train.
        </p>
      </header>

      <div className="grid gap-7 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)] xl:gap-9">
        <div className="space-y-8">
          <section className="space-y-4">
            <SectionHeading icon={<UserCircle2 size={19} />} eyebrow="Profile" title="Your account" />
            <Card className="p-5 sm:p-7 lg:p-8">
              {isPending ? (
                <AccountSkeleton />
              ) : (
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.4rem] bg-[var(--primary-soft)] text-xl font-black text-[var(--primary)]">
                    {firstName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xl font-black">{user?.name ?? firstName}</p>
                    <p className="mt-1 break-all text-sm text-[var(--text-muted)]">{email}</p>
                  </div>
                  <div className="inline-flex items-center gap-2 self-start rounded-full bg-[var(--success-soft)] px-3.5 py-2 text-xs font-bold text-[var(--success)] sm:self-center">
                    <Check size={14} aria-hidden="true" />
                    Account active
                  </div>
                </div>
              )}
            </Card>
          </section>

          <section className="space-y-4">
            <SectionHeading icon={<Dumbbell size={19} />} eyebrow="Training units" title="Weight display" />
            <Card className="p-5 sm:p-7 lg:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold">Choose your units</h2>
                  <p className="mt-1 max-w-xl text-sm leading-relaxed text-[var(--text-muted)]">Your workouts stay safely stored in kilograms. This choice converts every entry and progress summary across the app.</p>
                </div>
                <div role="group" aria-label="Weight unit" className="grid grid-cols-2 gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-soft)] p-1">
                  {(["kg", "lb"] as const).map((unit) => (
                    <button
                      key={unit}
                      type="button"
                      aria-pressed={preferences.weightUnit === unit}
                      onClick={() => setPreferences(saveAppPreferences({ weightUnit: unit }))}
                      className={"min-h-11 min-w-20 rounded-full px-5 text-sm font-black transition-[background-color,color,box-shadow] duration-200 " + (preferences.weightUnit === unit ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm" : "text-[var(--text-muted)] hover:text-[var(--text)]")}
                    >
                      {unit.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </section>

          <section className="space-y-4">
            <SectionHeading icon={<Palette size={19} />} eyebrow="Appearance" title="Set the mood" />
            <Card className="p-5 sm:p-7 lg:p-8">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-lg font-bold">Choose your finish</h2>
                  <p className="mt-1 max-w-xl text-sm leading-relaxed text-[var(--text-muted)]">
                    Warm marble for daylight, deep obsidian for a quieter session.
                  </p>
                </div>
                <div role="group" aria-label="Theme selection" className="grid w-full grid-cols-2 gap-3 sm:w-fit">
                  <ThemeOption active={theme === "light"} icon={<Sun size={18} />} label="Marble" detail="Warm light" onClick={() => theme !== "light" && toggleTheme()} />
                  <ThemeOption active={theme === "dark"} icon={<Moon size={18} />} label="Obsidian" detail="Deep dark" onClick={() => theme !== "dark" && toggleTheme()} />
                </div>
              </div>
            </Card>
          </section>

          <section className="space-y-4">
            <SectionHeading icon={<ShieldCheck size={19} />} eyebrow="Security" title="Your privacy" />
            <Card className="p-5 sm:p-7 lg:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold">Secure account</h2>
                  <p className="mt-1 max-w-xl text-sm leading-relaxed text-[var(--text-muted)]">
                    Your workouts and account are protected by your signed-in session.
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 self-start rounded-full bg-[var(--surface-soft)] px-3.5 py-2 text-xs font-bold text-[var(--text-muted)]">
                  <ShieldCheck size={15} aria-hidden="true" />
                  Session protected
                </div>
              </div>
            </Card>
          </section>
        </div>

        <aside className="space-y-7">
          <section className="space-y-4">
            <SectionHeading icon={<Target size={19} />} eyebrow="Consistency" title="Weekly target" />
            <Card className="p-5 sm:p-7">
              <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                Set a realistic number of sessions to aim for each week. Your dashboard progress updates to match.
              </p>
              <div className="mt-6 flex items-center justify-between gap-3 rounded-[var(--radius-lg)] bg-[var(--surface-soft)] p-4 sm:p-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.13em] text-[var(--text-muted)]">Workouts per week</p>
                  <p className="mt-1 text-3xl font-black tracking-tight">{preferences.weeklyGoalTarget}</p>
                </div>
                <div className="flex gap-2">
                  <StepButton label="Reduce weekly goal" disabled={preferences.weeklyGoalTarget <= 1} onClick={() => updateWeeklyGoal(-1)}><Minus size={17} /></StepButton>
                  <StepButton label="Increase weekly goal" disabled={preferences.weeklyGoalTarget >= 7} onClick={() => updateWeeklyGoal(1)}><Plus size={17} /></StepButton>
                </div>
              </div>
              <p className="mt-3 text-xs text-[var(--text-muted)]">A steady 2–4 sessions is a great place to begin.</p>
            </Card>
          </section>

          <section className="space-y-4">
            <SectionHeading icon={<Timer size={19} />} eyebrow="Workout flow" title="Rest timer" />
            <Card className="p-5 sm:p-7">
              <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                New exercises in routines will start with this rest period. You can still adjust each exercise.
              </p>
              <p className="mt-5 text-sm font-bold">Default rest between sets</p>
              <div role="group" aria-label="Default rest between sets" className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
                {[30, 45, 60, 75, 90, 120, 150, 180, 240].map((seconds) => (
                  <button
                    type="button"
                    key={seconds}
                    aria-pressed={preferences.defaultRestSeconds === seconds}
                    onClick={() => setPreferences(saveAppPreferences({ defaultRestSeconds: seconds }))}
                    className={"min-h-11 rounded-2xl border px-3 text-xs font-bold transition-[background-color,border-color,color,transform] duration-200 active:scale-[0.98] " + (preferences.defaultRestSeconds === seconds ? "border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)] shadow-sm" : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:border-[var(--border-strong)] hover:text-[var(--text)]")}
                  >
                    {formatDuration(seconds)}
                  </button>
                ))}
              </div>
            </Card>
          </section>

          <div className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--primary-soft)] p-5 sm:p-6">
            <p className="text-sm font-bold text-[var(--primary)]">Built for the long run</p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
              Small, repeatable sessions add up. Keep your plan simple and let the log show your progress.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}

function formatDuration(seconds: number) {
  return seconds < 60 ? seconds + " sec" : Math.round(seconds / 60) + " min";
}

function SectionHeading({ icon, eyebrow, title }: { icon: ReactNode; eyebrow: string; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]">{icon}</div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--primary)] sm:text-xs">{eyebrow}</p>
        <h2 className="mt-0.5 text-xl font-black tracking-tight sm:text-2xl">{title}</h2>
      </div>
    </div>
  );
}

function ThemeOption({ active, icon, label, detail, onClick }: { active: boolean; icon: React.ReactNode; label: string; detail: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={"flex min-h-[84px] min-w-32 flex-col items-start justify-center gap-1 rounded-[var(--radius-lg)] border px-4 text-left transition-all " + (active ? "border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--text)] shadow-sm" : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:border-[var(--border-strong)]")}
    >
      <span className="flex items-center gap-2 text-sm font-bold">{icon}{label}</span>
      <span className="text-xs text-[var(--text-muted)]">{detail}</span>
    </button>
  );
}

function StepButton({ children, label, disabled, onClick }: { children: ReactNode; label: string; disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)] disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function AccountSkeleton() {
  return (
    <div className="flex items-center gap-5" role="status" aria-label="Loading account">
      <div className="h-16 w-16 animate-pulse rounded-2xl bg-[var(--surface-soft)]" />
      <div className="space-y-2">
        <div className="h-5 w-32 animate-pulse rounded bg-[var(--surface-soft)]" />
        <div className="h-4 w-48 animate-pulse rounded bg-[var(--surface-soft)]" />
      </div>
    </div>
  );
}
