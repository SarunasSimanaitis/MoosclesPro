import type { ReactNode } from "react";
import { ArrowUpRight, Dumbbell, Sparkles } from "lucide-react";
import BrandLogo from "../ui/BrandLogo";
import { Link } from "react-router-dom";

export default function AuthFrame({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main className="auth-shell min-h-screen px-4 py-6 text-[var(--text)] sm:px-7 sm:py-8 lg:p-10">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-6xl overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-xl)] sm:min-h-[calc(100vh-4rem)] lg:grid-cols-[1.03fr_0.97fr]">
        <section className="flex flex-col p-6 sm:p-10 lg:p-14">
          <Link to="/" className="inline-flex w-fit items-center rounded-full focus-visible:outline-none">
            <BrandLogo />
          </Link>

          <div className="mx-auto my-auto w-full max-w-md py-12">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-3.5 py-2 text-xs font-bold text-[var(--text-muted)]">
              <Sparkles size={14} className="text-[var(--primary)]" />
              {eyebrow}
            </div>
            <h1 className="font-bold leading-tight tracking-tight text-[22px] sm:text-2xl">
              {title}
            </h1>
            <p className="mt-4 max-w-sm text-base leading-relaxed text-[var(--text-muted)]">
              {description}
            </p>
            <div className="mt-8">{children}</div>
          </div>

          <p className="text-xs font-medium text-[var(--text-subtle)]">
            Thoughtful training. Measurable progress.
          </p>
        </section>

        <aside className="auth-art relative hidden flex-col justify-between overflow-hidden p-10 lg:flex lg:p-12">
          <div className="relative z-10 flex items-center justify-between">
            <span className="rounded-full border border-[var(--border)] bg-[var(--surface)]/75 px-4 py-2 text-xs font-bold text-[var(--text-muted)]">
              Your training, refined
            </span>
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)]/75 text-[var(--primary)]">
              <ArrowUpRight size={20} />
            </span>
          </div>

          <div className="auth-art-card relative z-10 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]/80 p-7 shadow-[var(--shadow-lg)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[var(--text-muted)]">Today’s focus</p>
                <h2 className="mt-2 font-bold tracking-tight text-lg sm:text-xl">Show up. Get stronger.</h2>
              </div>
              <Dumbbell className="text-[var(--primary)]" size={26} />
            </div>
            <div className="mt-7 space-y-3">
              {[
                ["01", "Plan with intention"],
                ["02", "Track every set"],
                ["03", "See how far you’ve come"],
              ].map(([number, label]) => (
                <div key={number} className="flex items-center gap-4 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-soft)]/80 px-4 py-3.5">
                  <span className="font-mono text-xs font-bold text-[var(--primary)]">{number}</span>
                  <span className="text-sm font-semibold">{label}</span>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm leading-relaxed text-[var(--text-muted)]">
              A calm, considered space for building strength and staying consistent.
            </p>
          </div>

          <p className="relative z-10 text-xs font-semibold text-[var(--text-muted)]">
            Built for the long game
          </p>
        </aside>
      </div>
    </main>
  );
}
