import type { ReactNode } from "react";

import Card from "./Card";

type StatCardProps = {
  icon?: ReactNode;
  label: string;
  value: string;
  suffix?: string;
};

export default function StatCard({
  icon,
  label,
  value,
  suffix,
}: StatCardProps) {
  return (
    <Card className="p-6">
      {icon && (
        <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--primary-soft)] text-[var(--primary)]">
          {icon}
        </div>
      )}

      <p
        className={
          icon
            ? "mt-6 text-sm font-medium text-[var(--text-muted)]"
            : "text-sm font-medium text-[var(--text-muted)]"
        }
      >
        {label}
      </p>

      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-3xl font-black tracking-tight text-[var(--text)]">
          {value}
        </span>

        {suffix && (
          <span className="text-sm font-medium text-[var(--text-muted)]">
            {suffix}
          </span>
        )}
      </div>
    </Card>
  );
}