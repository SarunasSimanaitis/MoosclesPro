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
    <Card className="p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-[var(--text-muted)]">{label}</p>
        {icon && (
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${positive ? "bg-[var(--success-soft)] text-[var(--success)]" : "bg-[var(--primary-soft)] text-[var(--primary)]"}`}>
            {icon}
          </div>
        )}
      </div>
      <div className="mt-5 flex items-baseline gap-2">
        <span className="text-3xl font-black tracking-tight">{value}</span>
        {suffix && <span className="text-sm font-semibold text-[var(--text-muted)]">{suffix}</span>}
      </div>
    </Card>
  );
}
