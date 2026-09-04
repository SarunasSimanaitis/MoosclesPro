import {
  Check,
  Moon,
  Palette,
  ShieldCheck,
  Sun,
  UserCircle2,
} from "lucide-react";

import Card from "../components/ui/Card";
import { useTheme } from "../hooks/useTheme";
import { authClient } from "../lib/auth-client";

export default function Settings() {
  const {
    theme,
    toggleTheme,
  } = useTheme();

  const {
    data: session,
    isPending,
  } = authClient.useSession();

  const user =
    session?.user;

  const firstName =
    user?.name
      ?.trim()
      .split(/\s+/)[0] ??
    "User";

  const email =
    user?.email ??
    "No email available";

  return (
    <main className="mx-auto max-w-5xl space-y-10">
      {/* Header */}
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--primary)]">
          Preferences
        </p>

        <h1 className="mt-3 text-4xl font-black tracking-tight text-[var(--text)] md:text-5xl">
          Settings
        </h1>

        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-[var(--text-muted)]">
          Manage your account and tailor
          MoosclesPro to your preferences.
        </p>
      </section>

      {/* Account */}
      <section className="space-y-4">
        <SectionHeading
          icon={
            <UserCircle2 size={19} />
          }
          eyebrow="Account"
          title="Your account"
        />

        <Card className="p-6 md:p-8">
          {isPending ? (
            <AccountSkeleton />
          ) : (
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[var(--primary-soft)] text-xl font-black text-[var(--primary)]">
                {firstName
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xl font-black text-[var(--text)]">
                  {firstName}
                </p>

                <p className="mt-1 break-all text-sm text-[var(--text-muted)]">
                  {email}
                </p>
              </div>

              <div className="inline-flex items-center gap-2 self-start rounded-full bg-[var(--success-soft)] px-3 py-1.5 text-xs font-bold text-[var(--success)] sm:self-center">
                <Check size={14} />
                Account active
              </div>
            </div>
          )}
        </Card>
      </section>

      {/* Appearance */}
      <section className="space-y-4">
        <SectionHeading
          icon={
            <Palette size={19} />
          }
          eyebrow="Appearance"
          title="Make it feel like yours"
        />

        <Card className="p-6 md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-bold text-[var(--text)]">
                Theme
              </h2>

              <p className="mt-1 max-w-xl text-sm leading-relaxed text-[var(--text-muted)]">
                Choose how MoosclesPro should
                look on this device.
              </p>
            </div>

            <div
              role="group"
              aria-label="Theme selection"
              className="
                grid
                grid-cols-2
                gap-2
                rounded-[var(--radius-lg)]
                border
                border-[var(--border)]
                bg-[var(--surface-soft)]
                p-1.5
                sm:w-fit
              "
            >
              <ThemeOption
                active={
                  theme === "light"
                }
                icon={
                  <Sun size={17} />
                }
                label="Light"
                onClick={() => {
                  if (
                    theme !==
                    "light"
                  ) {
                    toggleTheme();
                  }
                }}
              />

              <ThemeOption
                active={
                  theme === "dark"
                }
                icon={
                  <Moon size={17} />
                }
                label="Dark"
                onClick={() => {
                  if (
                    theme !==
                    "dark"
                  ) {
                    toggleTheme();
                  }
                }}
              />
            </div>
          </div>
        </Card>
      </section>

      {/* Security */}
      <section className="space-y-4">
        <SectionHeading
          icon={
            <ShieldCheck size={19} />
          }
          eyebrow="Security"
          title="Account security"
        />

        <Card className="p-6 md:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-[var(--text)]">
                Authentication
              </h2>

              <p className="mt-1 max-w-xl text-sm leading-relaxed text-[var(--text-muted)]">
                Your account is protected by
                secure session-based
                authentication.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-[var(--surface-soft)] px-3 py-1.5 text-xs font-bold text-[var(--text-muted)]">
              <ShieldCheck
                size={14}
              />
              Secure session
            </div>
          </div>
        </Card>
      </section>

      {/* Application */}
      <section className="space-y-4">
        <SectionHeading
          icon={
            <Palette size={19} />
          }
          eyebrow="Application"
          title="About MoosclesPro"
        />

        <Card className="p-6 md:p-8">
          <div className="grid gap-6 sm:grid-cols-2">
            <InfoItem
              label="Version"
              value="0.1.0"
            />

            <InfoItem
              label="Experience"
              value="Personal fitness tracking"
            />

            <InfoItem
              label="Theme"
              value={
                theme === "dark"
                  ? "Dark mode"
                  : "Light mode"
              }
            />

            <InfoItem
              label="Platform"
              value="MoosclesPro Web"
            />
          </div>
        </Card>
      </section>
    </main>
  );
}

function SectionHeading({
  icon,
  eyebrow,
  title,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--primary-soft)] text-[var(--primary)]">
        {icon}
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--primary)]">
          {eyebrow}
        </p>

        <h2 className="mt-1 text-2xl font-black tracking-tight text-[var(--text)]">
          {title}
        </h2>
      </div>
    </div>
  );
}

function ThemeOption({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`
        inline-flex
        min-h-10
        items-center
        justify-center
        gap-2
        rounded-[var(--radius-md)]
        px-4
        text-sm
        font-semibold
        transition-[background-color,color,box-shadow]
        duration-200
        ${
          active
            ? `
              bg-[var(--surface)]
              text-[var(--text)]
              shadow-[var(--shadow-sm)]
            `
            : `
              text-[var(--text-muted)]
              hover:text-[var(--text)]
            `
        }
      `}
    >
      {icon}
      {label}
    </button>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[var(--radius-md)] bg-[var(--surface-soft)] p-4">
      <p className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]">
        {label}
      </p>

      <p className="mt-2 font-semibold text-[var(--text)]">
        {value}
      </p>
    </div>
  );
}

function AccountSkeleton() {
  return (
    <div className="flex items-center gap-5">
      <div className="h-16 w-16 animate-pulse rounded-full bg-[var(--surface-soft)]" />

      <div className="space-y-2">
        <div className="h-5 w-32 animate-pulse rounded bg-[var(--surface-soft)]" />
        <div className="h-4 w-48 animate-pulse rounded bg-[var(--surface-soft)]" />
      </div>
    </div>
  );
}