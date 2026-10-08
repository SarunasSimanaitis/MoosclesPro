import { ChevronRight, Settings } from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import { authenticatedNavigation, publicNavigation } from "../../data/navigation";
import { authClient } from "../../lib/auth-client";
import Button from "../ui/Button";

export default function DesktopSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: session } = authClient.useSession();

  if (!session?.user) {
    return null;
  }

  const mainItems = authenticatedNavigation.filter(
    (item) => !publicNavigation.some((publicItem) => publicItem.path === item.path),
  );

  return (
    <aside className="fixed inset-y-[4.25rem] left-0 z-30 hidden w-[15rem] border-r border-[var(--border)] bg-[var(--surface)] xl:block">
      <div className="flex h-full flex-col px-3 py-5">
        <div className="px-3">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--text-subtle)]">
            MoosclesPro
          </p>
          <p className="mt-1 text-sm font-medium text-[var(--text-muted)]">
            Your training, kept simple.
          </p>
        </div>

        <nav aria-label="Main navigation" className="mt-5 space-y-1">
          {mainItems.map((item) => (
            <SidebarItem key={item.path} item={item} />
          ))}
        </nav>

        <div className="mt-5 border-t border-[var(--border)] pt-4">
          <p className="px-3 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--text-subtle)]">
            Explore
          </p>

          <div className="mt-2 space-y-1">
            {publicNavigation.map((item) => (
              <SidebarItem key={item.path} item={item} />
            ))}
          </div>
        </div>

        <div className="mt-auto space-y-2">
          <button
            type="button"
            onClick={() => navigate("/settings")}
            className={`flex min-h-11 w-full items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-sm font-semibold transition-colors ${
              location.pathname === "/settings"
                ? "bg-[var(--violet-soft)] text-[var(--violet)]"
                : "text-[var(--text-muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"
            }`}
          >
            <Settings size={18} />
            Settings
          </button>

          <div className="rounded-[var(--radius-lg)] border border-[var(--accent)]/20 bg-[var(--accent-soft)] p-4">
            <p className="text-sm font-black text-[var(--text)]">
              Ready to train?
            </p>
            <p className="mt-1 text-xs leading-relaxed text-[var(--text-muted)]">
              Choose a routine and get started.
            </p>
            <Button
              size="sm"
              className="mt-3 w-full"
              onClick={() => navigate("/workouts")}
            >
              Start workout
              <ChevronRight size={15} />
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}

function SidebarItem({
  item,
}: {
  item: (typeof authenticatedNavigation)[number];
}) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `flex min-h-11 items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-sm font-semibold transition-colors ${
          isActive
            ? "bg-[var(--primary-soft)] text-[var(--primary)]"
            : "text-[var(--text-muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"
        }`
      }
    >
      <Icon size={18} strokeWidth={1.9} />
      <span>{item.label}</span>
    </NavLink>
  );
}