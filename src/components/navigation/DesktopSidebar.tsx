import { Settings } from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import { authenticatedNavigation, publicNavigation } from "../../data/navigation";
import { authClient } from "../../lib/auth-client";

export default function DesktopSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: session } = authClient.useSession();

  if (!session?.user) return null;

  return (
    <aside className="fixed inset-y-[4.25rem] left-0 z-40 hidden w-[15rem] border-r border-[var(--border)] bg-[var(--surface)] xl:block">
      <div className="flex h-full flex-col px-3 py-5">
        <div className="px-3">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-subtle)]">
            Your space
          </p>
          <p className="mt-1 text-sm leading-relaxed text-[var(--text-muted)]">
            Everything you need to train.
          </p>
        </div>

        <nav className="mt-6 space-y-1" aria-label="Main navigation">
          {authenticatedNavigation.map((item) => (
            <SidebarLink key={item.path} item={item} />
          ))}
        </nav>

        <div className="mt-6 border-t border-[var(--border)] pt-5">
          <p className="px-3 text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-subtle)]">
            Explore
          </p>
          <div className="mt-2 space-y-1">
            {publicNavigation.map((item) => (
              <SidebarLink key={item.path} item={item} />
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate("/settings")}
          className={`mt-auto flex min-h-11 items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-sm font-semibold ${location.pathname === "/settings" ? "bg-[var(--primary-soft)] text-[var(--primary)]" : "text-[var(--text-muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"}`}
        >
          <Settings size={18} />
          Settings
        </button>
      </div>
    </aside>
  );
}

function SidebarLink({
  item,
}: {
  item: (typeof authenticatedNavigation)[number];
}) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `flex min-h-11 items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-sm font-semibold transition-colors ${isActive ? "bg-[var(--primary-soft)] text-[var(--primary)]" : "text-[var(--text-muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"}`
      }
    >
      <Icon size={18} strokeWidth={1.9} />
      <span>{item.label}</span>
    </NavLink>
  );
}
