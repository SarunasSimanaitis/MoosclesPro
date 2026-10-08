import {
  BarChart3,
  ChevronRight,
  Dumbbell,
  History,
  House,
  NotebookTabs,
  Settings,
  Sparkles,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

import { authenticatedNavigation, publicNavigation } from "../../data/navigation";
import { authClient } from "../../lib/auth-client";
import Button from "../ui/Button";

export default function DesktopSidebar() {
  const navigate = useNavigate();
  const { data: session } = authClient.useSession();

  if (!session?.user) {
    return null;
  }

  return (
    <aside className="fixed inset-y-[4.25rem] left-0 z-30 hidden w-64 border-r border-[var(--border)] bg-[var(--surface)] lg:block">
      <div className="flex h-full flex-col px-4 py-5">
        <div className="px-2">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">
            Your training
          </p>
          <p className="mt-1 text-sm font-medium text-[var(--text-muted)]">
            Everything you need, without the clutter.
          </p>
        </div>

        <nav aria-label="Sidebar navigation" className="mt-5 space-y-1">
          {authenticatedNavigation.map((item) => (
            <SidebarItem key={item.path} item={item} />
          ))}
        </nav>

        <div className="mt-6 border-t border-[var(--border)] pt-5">
          <p className="px-2 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">
            Explore
          </p>

          <div className="mt-2 space-y-1">
            {publicNavigation.map((item) => (
              <SidebarItem key={item.path} item={item} />
            ))}
          </div>
        </div>

        <div className="mt-auto">
          <div className="rounded-[var(--radius-lg)] border border-[var(--accent)]/20 bg-[var(--accent-soft)] p-4">
            <p className="text-sm font-black text-[var(--text)]">
              Ready to train?
            </p>
            <p className="mt-1 text-xs leading-relaxed text-[var(--text-muted)]">
              Pick a routine and get straight into your workout.
            </p>
            <Button
              size="sm"
              className="mt-4 w-full"
              onClick={() => navigate("/workouts")}
            >
              View workouts
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
        `
          flex min-h-11 items-center gap-3 rounded-[var(--radius-md)] px-3.5 py-2.5 text-sm font-semibold transition-colors
          ${isActive
            ? "bg-[var(--primary-soft)] text-[var(--primary)]"
            : "text-[var(--text-muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"
          }
        `
      }
    >
      <Icon size={18} strokeWidth={1.9} />
      <span>{item.label}</span>
    </NavLink>
  );
}