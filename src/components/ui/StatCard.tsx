import type { ReactNode } from "react";

import Card from "./Card";

type StatCardProps = {
  icon?: ReactNode;
  label: string;
  value: string;
  suffix?: string;
};

function getTone(label: string) {
  if (label.toLowerCase().includes("streak")) return { bg: "var(--primary-soft)", text: "var(--primary)" };
  if (label.toLowerCase().includes("workout")) return { bg: "var(--accent-soft)", text: "var(--accent)" };
  if (label.toLowerCase().includes("volume")) return { bg: "var(--violet-soft)", text: "var(--violet)" };
  return { bg: "var(--rose-soft)", text: "var(--rose)" };
}

export default function StatCard({ icon, label, value, suffix }: StatCardProps) {
  const tone = getTone(label);

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-[var(--text-muted)]">{label}</p>
        {icon && (
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)]"
            style={{ backgroundColor: tone.bg, color: tone.text }}
          >
            {icon}
          </div>
        )}
      </div>

      <div className="mt-5 flex items-baseline gap-2">
        <span className="text-3xl font-black tracking-tight text-[var(--text)]">{value}</span>
        {suffix && <span className="text-sm font-medium text-[var(--text-muted)]">{suffix}</span>}
      </div>
    </Card>
  );
}