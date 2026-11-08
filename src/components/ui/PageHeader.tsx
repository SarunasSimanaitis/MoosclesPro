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
    <header className={"mb-5 flex flex-col gap-4 sm:mb-7 sm:flex-row sm:items-end sm:justify-between " + className}>
      <div className="min-w-0">
        {eyebrow && (
          <p className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-muted)] [&_svg]:h-3.5 [&_svg]:w-3.5">
            {icon}
            {eyebrow}
          </p>
        )}

        <h1 className="mt-1 font-bold leading-tight tracking-tight text-[var(--text)] text-[22px] sm:text-2xl">
          {title}
        </h1>

        {description && (
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-[var(--text-muted)]">
            {description}
          </p>
        )}
      </div>

      {action && <div className="w-full shrink-0 sm:w-auto">{action}</div>}
    </header>
  );
}
