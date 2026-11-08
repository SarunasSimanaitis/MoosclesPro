import type { ReactNode } from "react";
import Card from "./Card";

type StatCardProps = {
  icon?: ReactNode;
  label: string;
  value: string;
  suffix?: string;
  tone?: "primary" | "success";
};

export default function StatCard({
  icon,
  label,
  value,
  suffix,
  tone = "primary",
}: StatCardProps) {
  const positive = tone === "success";
  return (
    <Card className="min-w-0 p-3.5 sm:p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="truncate text-[13px] font-medium text-[var(--text-muted)]">{label}</p>
        {icon && (
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full [&_svg]:h-4 [&_svg]:w-4 ${positive ? "bg-[var(--success-soft)] text-[var(--success)]" : "bg-[var(--surface-soft)] text-[var(--text)]"}`}>
            {icon}
          </div>
        )}
      </div>
      <div className="mt-2 flex min-w-0 items-baseline gap-1.5">
        <span className="truncate text-xl font-bold tabular-nums tracking-tight sm:text-2xl">{value}</span>
        {suffix && <span className="truncate text-xs text-[var(--text-muted)]">{suffix}</span>}
      </div>
    </Card>
  );
}
