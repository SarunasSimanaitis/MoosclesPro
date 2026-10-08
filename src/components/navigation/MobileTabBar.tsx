import { BarChart3, Dumbbell, History, House } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const items = [
  { label: "Home", path: "/dashboard", icon: House },
  { label: "Workouts", path: "/workouts", icon: Dumbbell },
  { label: "History", path: "/history", icon: History },
  { label: "Stats", path: "/statistics", icon: BarChart3 },
];

export default function MobileTabBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isWorkoutRoute =
    location.pathname.startsWith("/workout/") ||
    location.pathname === "/session";

  if (isWorkoutRoute) {
    return null;
  }

  return (
    <nav
      aria-label="Main navigation"
      className="fixed inset-x-3 bottom-3 z-40 md:hidden"
    >
      <div className="grid h-[4.35rem] grid-cols-4 rounded-[1.35rem] border border-[var(--border)] bg-[var(--surface)] p-1.5 shadow-[var(--shadow-lg)]">
        {items.map((item) => {
          const Icon = item.icon;
          const active =
            location.pathname === item.path ||
            (item.path === "/history" &&
              location.pathname.startsWith("/history/")) ||
            (item.path === "/workouts" &&
              location.pathname.startsWith("/program/"));

          return (
            <button
              key={item.path}
              type="button"
              onClick={() => navigate(item.path)}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-11 flex-col items-center justify-center gap-1 rounded-[1rem] px-2 text-[11px] font-bold transition-colors ${
                active
                  ? "bg-[var(--primary-soft)] text-[var(--primary)]"
                  : "text-[var(--text-muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.2 : 1.9} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}