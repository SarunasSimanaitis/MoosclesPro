import {

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
import { LogOut } from "lucide-react";
import { useState, type ReactNode } from "react";

import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { useSignOut } from "../hooks/useSignOut";
import { useTheme } from "../hooks/useTheme";
import { authClient } from "../lib/auth-client";
import { getAppPreferences, saveAppPreferences } from "../lib/preferences";

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { signOut, signingOut, error: signOutError } = useSignOut();
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
    <div className="page-stack space-y-6">
      <header>
        <h1 className="font-bold tracking-tight text-[22px] sm:text-2xl">Settings</h1>
        <p className="mt-1.5 text-sm text-[var(--text-muted)]">
          Make MoosclesPro feel right for the way you train.
        </p>
      </header>

      <div className="grid gap-6">
        <div className="space-y-6">
          <section className="space-y-4">
            <SectionHeading icon={<UserCircle2 size={19} />} eyebrow="Profile" title="Your account" />
            <Card className="p-4 sm:p-5">
              {isPending ? (
                <AccountSkeleton />
              ) : (
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[var(--surface-soft)] text-2xl font-semibold text-[var(--text)]">
                    {firstName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-lg font-semibold">{user?.name ?? firstName}</p>
                    <p className="truncate text-sm text-[var(--text-muted)]">{email}</p>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => void signOut()}
                    loading={signingOut}
                    className="shrink-0"
                  >
                    {!signingOut && <LogOut size={15} aria-hidden="true" />}
                    Sign out
                  </Button>
                </div>
              )}
              {signOutError && (
                <p role="alert" className="mt-3 text-sm text-[var(--danger)]">{signOutError}</p>
              )}
            </Card>
          </section>

          <section className="space-y-4">
            <SectionHeading icon={<Dumbbell size={19} />} eyebrow="Training units" title="Weight display" />
            <Card className="p-4 sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-bold text-lg sm:text-xl">Choose your units</h2>
                  <p className="mt-1 max-w-xl text-sm leading-relaxed text-[var(--text-muted)]">Your workouts stay safely stored in kilograms. This choice converts every entry and progress summary across the app.</p>
                </div>
                <div role="group" aria-label="Weight unit" className="grid grid-cols-2 gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-soft)] p-1">
                  {(["kg", "lb"] as const).map((unit) => (
                    <button
                      key={unit}
                      type="button"
                      aria-pressed={preferences.weightUnit === unit}
                      onClick={() => setPreferences(saveAppPreferences({ weightUnit: unit }))}
                      className={"min-h-11 min-w-20 rounded-full px-5 text-sm font-bold transition-[background-color,color,box-shadow] duration-200 " + (preferences.weightUnit === unit ? "bg-[var(--primary)] text-[var(--primary-foreground)]" : "text-[var(--text-muted)] hover:text-[var(--text)]")}
                    >
                      {unit.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </section>

          <section className="space-y-4">
            <SectionHeading icon={<Palette size={19} />} eyebrow="Appearance" title="Theme" />
            <Card className="p-4 sm:p-5">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="font-bold text-lg sm:text-xl">Light or dark</h2>
                  <p className="mt-1 max-w-xl text-sm leading-relaxed text-[var(--text-muted)]">
                    White for daylight, black for late-night sessions and OLED screens.
                  </p>
                </div>
                <div role="group" aria-label="Theme selection" className="grid w-full grid-cols-2 gap-3 sm:w-fit">
                  <ThemeOption active={theme === "light"} icon={<Sun size={18} />} label="Light" detail="White background" onClick={() => setTheme("light")} />
                  <ThemeOption active={theme === "dark"} icon={<Moon size={18} />} label="Dark" detail="Black background" onClick={() => setTheme("dark")} />
                </div>
              </div>
            </Card>
          </section>

          <section className="space-y-4">
            <SectionHeading icon={<ShieldCheck size={19} />} eyebrow="Security" title="Your privacy" />
            <Card className="p-4 sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-bold text-lg sm:text-xl">Secure account</h2>
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
                  <p className="text-xs font-bold text-[var(--text-muted)]">Workouts per week</p>
                  <p className="mt-1 text-3xl font-bold tracking-tight">{preferences.weeklyGoalTarget}</p>
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
                    className={"min-h-11 rounded-[var(--radius-lg)] border px-3 text-xs font-bold transition-[background-color,border-color,color,transform] duration-200 active:scale-[0.98] " + (preferences.defaultRestSeconds === seconds ? "border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]" : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:border-[var(--border-strong)] hover:text-[var(--text)]")}
                  >
                    {formatDuration(seconds)}
                  </button>
                ))}
              </div>
              <div className="mt-5 divide-y divide-[var(--border)] border-t border-[var(--border)]">
                <ToggleRow
                  label="Sound when rest ends"
                  checked={preferences.restSound}
                  onChange={(restSound) => setPreferences(saveAppPreferences({ restSound }))}
                />
                <ToggleRow
                  label="Vibrate when rest ends"
                  detail="On phones that support it"
                  checked={preferences.restVibration}
                  onChange={(restVibration) => setPreferences(saveAppPreferences({ restVibration }))}
                />
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
    </div>
  );
}

function formatDuration(seconds: number) {
  return seconds < 60 ? seconds + " sec" : Math.round(seconds / 60) + " min";
}

function SectionHeading({ icon, eyebrow, title }: { icon: ReactNode; eyebrow: string; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--surface-soft)] text-[var(--text)] [&_svg]:h-4 [&_svg]:w-4">{icon}</div>
      <div>
        <p className="text-xs font-semibold text-[var(--text-muted)]">{eyebrow}</p>
        <h2 className="mt-0.5 font-bold tracking-tight text-lg sm:text-xl">{title}</h2>
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
      className={"flex min-h-[84px] min-w-32 flex-col items-start justify-center gap-1 rounded-[var(--radius-lg)] border px-4 text-left transition-all " + (active ? "border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--text)]" : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:border-[var(--border-strong)]")}
    >
      <span className="flex items-center gap-2 text-sm font-bold">{icon}{label}</span>
      <span className="text-xs text-[var(--text-muted)]">{detail}</span>
    </button>
  );
}

function ToggleRow({ label, detail, checked, onChange }: { label: string; detail?: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 py-3.5">
      <span>
        <span className="block text-sm font-semibold text-[var(--text)]">{label}</span>
        {detail && <span className="block text-xs text-[var(--text-muted)]">{detail}</span>}
      </span>
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className="relative h-7 w-12 shrink-0 rounded-full bg-[var(--surface-hover)] transition-colors peer-checked:bg-[var(--primary)] peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--focus-ring)] after:absolute after:left-0.5 after:top-0.5 after:h-6 after:w-6 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-5"
      />
    </label>
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
      <div className="h-16 w-16 animate-pulse rounded-[var(--radius-lg)] bg-[var(--surface-soft)]" />
      <div className="space-y-2">
        <div className="h-5 w-32 animate-pulse rounded bg-[var(--surface-soft)]" />
        <div className="h-4 w-48 animate-pulse rounded bg-[var(--surface-soft)]" />
      </div>
    </div>
  );
}
