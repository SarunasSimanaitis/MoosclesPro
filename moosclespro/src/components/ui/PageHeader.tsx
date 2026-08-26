import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  action?: ReactNode;
};

export default function PageHeader({
  title,
  subtitle,
  eyebrow,
  action,
}: PageHeaderProps) {
  return (
    <header className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
      <div>
        {eyebrow && (
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--primary)]">
            {eyebrow}
          </p>
        )}

        <h1 className="mt-3 text-4xl font-black tracking-tight text-[var(--text)] md:text-5xl">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-3 max-w-2xl text-lg text-[var(--text-muted)]">
            {subtitle}
          </p>
        )}
      </div>

      {action && (
        <div className="shrink-0">
          {action}
        </div>
      )}
    </header>
  );
}