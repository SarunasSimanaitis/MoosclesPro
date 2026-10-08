import { useLocation, useNavigate } from "react-router-dom";

import { mobileNavigation } from "../../data/navigation";
import { authClient } from "../../lib/auth-client";

export default function MobileTabBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const { data: session } = authClient.useSession();

  const isWorkoutRoute =
    location.pathname.startsWith("/workout/") ||
    location.pathname === "/session";

  if (!session?.user || isWorkoutRoute) {
    return null;
  }

  return (
    <nav
      aria-label="Main navigation"
      className="
        fixed
        inset-x-0
        bottom-0
        z-40
        border-t
        border-[var(--border)]
        bg-[var(--background)]/95
        pb-[env(safe-area-inset-bottom)]
        backdrop-blur-xl
        md:hidden
      "
    >
      <div className="mx-auto grid h-16 max-w-lg grid-cols-4 px-2">
        {mobileNavigation.map((link) => {
          const Icon = link.icon;
          const isActive =
            location.pathname === link.path ||
            (link.path === "/workouts" &&
              location.pathname.startsWith("/program/")) ||
            (link.path === "/history" &&
              location.pathname.startsWith("/history/"));

          return (
            <button
              key={link.path}
              type="button"
              onClick={() => navigate(link.path)}
              className={`
                flex
                min-h-11
                flex-col
                items-center
                justify-center
                gap-1
                rounded-xl
                px-2
                text-[11px]
                font-bold
                transition-colors
                ${
                  isActive
                    ? "text-[var(--primary)]"
                    : "text-[var(--text-muted)]"
                }
              `}
              aria-current={isActive ? "page" : undefined}
            >
              <span className={`
                flex h-8 w-12 items-center justify-center rounded-full transition-colors
                ${isActive ? "bg-[var(--primary-soft)]" : ""}
              `}>
                <Icon size={18} strokeWidth={1.9} />
              </span>
              {link.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}