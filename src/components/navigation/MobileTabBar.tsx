import { useLocation, useNavigate } from "react-router-dom";

import { mobileNavigation } from "../../data/navigation";
import { authClient } from "../../lib/auth-client";

export default function MobileTabBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: session } = authClient.useSession();

  const workoutRoute =
    location.pathname.startsWith("/workout/") ||
    location.pathname === "/session";

  if (!session?.user || workoutRoute) return null;

  return (
    <nav
      aria-label="Main navigation"
      className="fixed inset-x-0 bottom-0 z-40 px-3 pb-3 md:hidden"
    >
      <div className="mx-auto grid h-16 max-w-lg grid-cols-4 rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)]/96 p-1 shadow-[var(--shadow-lg)] backdrop-blur-xl">
        {mobileNavigation.map((item) => {
          const Icon = item.icon;
          const active =
            location.pathname === item.path ||
            (item.path === "/history" &&
              location.pathname.startsWith("/history/"));

          return (
            <button
              key={item.path}
              type="button"
              onClick={() => navigate(item.path)}
              className={`flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-[var(--radius-md)] px-2 text-[11px] font-bold transition-colors ${active ? "bg-[var(--primary-soft)] text-[var(--primary)]" : "text-[var(--text-muted)] hover:text-[var(--text)]"}`}
              aria-current={active ? "page" : undefined}
            >
              <Icon size={18} strokeWidth={1.9} />
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
