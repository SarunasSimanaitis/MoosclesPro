import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
};

export default function PageHeader({
  eyebrow,
  title,
  description,
  icon,
  action,
  className = "",
}: PageHeaderProps) {
  return (
    <header className={`mb-6 flex flex-col gap-4 sm:mb-8 lg:flex-row lg:items-end lg:justify-between ${className}`}>
      <div className="min-w-0">
        {eyebrow && (
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[var(--primary)]">
            {icon}
            {eyebrow}
          </p>
        )}

        <h1 className="mt-2 text-3xl font-black tracking-tight text-[var(--text)] sm:text-4xl lg:text-5xl">
          {title}
        </h1>

        {description && (
          <p className="mt-2 max-w-2xl text-base leading-relaxed text-[var(--text-muted)] sm:text-lg">
            {description}
          </p>
        )}
      </div>

      {action && (
        <div className="w-full shrink-0 sm:w-auto">
          {action}
        </div>
      )}
    </header>
  );
}