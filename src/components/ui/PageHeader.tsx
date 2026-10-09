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
    <header className={"mb-7 flex flex-col gap-5 sm:mb-9 lg:flex-row lg:items-end lg:justify-between 2xl:mb-11 " + className}>
      <div className="min-w-0">
        {eyebrow && (
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--primary)] sm:text-sm">
            {icon}
            {eyebrow}
          </p>
        )}

        <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-[var(--text)] sm:text-4xl lg:text-5xl 2xl:text-6xl">
          {title}
        </h1>

        {description && (
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--text-muted)] sm:text-base sm:leading-7 lg:text-lg">
            {description}
          </p>
        )}
      </div>

      {action && <div className="w-full shrink-0 lg:w-auto">{action}</div>}
    </header>
  );
}
