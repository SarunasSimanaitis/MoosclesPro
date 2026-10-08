import { Menu, Moon, Settings, Sun, X } from "lucide-react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { authenticatedNavigation, publicNavigation } from "../../data/navigation";
import { useTheme } from "../../hooks/useTheme";
import { authClient } from "../../lib/auth-client";
import Button from "../ui/Button";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { data: session, isPending } = authClient.useSession();
  const loggedIn = Boolean(session?.user);

  async function handleSignOut() {
    try {
      await authClient.signOut();
    } finally {
      setMenuOpen(false);
      navigate("/");
    }
  }

  const name = session?.user?.name?.trim() || "Account";
  const initial = name.charAt(0).toUpperCase() || "A";
  const ExerciseIcon = publicNavigation[0].icon;

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur-xl">
      <div className="mx-auto flex min-h-16 max-w-6xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <NavLink
          to={loggedIn ? "/dashboard" : "/"}
          onClick={() => setMenuOpen(false)}
          className="shrink-0 text-xl font-black tracking-tight sm:text-2xl"
          aria-label="MoosclesPro home"
        >
          Mooscles<span className="text-[var(--primary)]">Pro</span>
        </NavLink>

        <nav className="ml-4 hidden min-w-0 flex-1 items-center gap-1 md:flex" aria-label="Primary navigation">
          {(loggedIn ? authenticatedNavigation : publicNavigation).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                [
                  "inline-flex min-h-10 items-center gap-2 rounded-[var(--radius-md)] px-3 text-sm font-semibold transition-colors",
                  isActive
                    ? "bg-[var(--primary-soft)] text-[var(--primary)]"
                    : "text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--text)]",
                ].join(" ")
              }
            >
              <item.icon size={16} strokeWidth={2} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          {!isPending && loggedIn && (
            <button
              type="button"
              onClick={() => navigate("/settings")}
              className="hidden h-10 items-center gap-2 rounded-[var(--radius-md)] px-3 text-sm font-semibold text-[var(--text-muted)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--text)] sm:flex"
              aria-label="Open settings"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--primary-soft)] text-xs font-black text-[var(--primary)]">
                {initial}
              </span>
              <span className="hidden lg:inline">{name}</span>
              <Settings size={16} className="hidden lg:block" />
            </button>
          )}

          {!isPending && !loggedIn && (
            <div className="hidden items-center gap-1 sm:flex">
              <NavLink
                to="/login"
                className="inline-flex min-h-10 items-center rounded-[var(--radius-md)] px-3 text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text)]"
              >
                Log in
              </NavLink>
              <NavLink
                to="/register"
                className="inline-flex min-h-10 items-center rounded-[var(--radius-md)] bg-[var(--primary)] px-4 text-sm font-semibold text-[var(--primary-foreground)] transition-colors hover:bg-[var(--primary-hover)]"
              >
                Create account
              </NavLink>
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="h-10 w-10 p-0"
            aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </Button>

          {loggedIn && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setMenuOpen((value) => !value)}
              className="h-10 w-10 p-0 md:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </Button>
          )}
        </div>
      </div>

      {menuOpen && loggedIn && (
        <div id="mobile-navigation" className="border-t border-[var(--border)] bg-[var(--surface)] md:hidden">
          <nav className="mx-auto max-w-6xl px-4 py-3 sm:px-6" aria-label="Mobile navigation">
            <div className="grid gap-1 sm:grid-cols-2">
              {authenticatedNavigation.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    [
                      "flex min-h-12 items-center gap-3 rounded-[var(--radius-md)] px-4 text-sm font-semibold",
                      isActive
                        ? "bg-[var(--primary-soft)] text-[var(--primary)]"
                        : "text-[var(--text-muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)]",
                    ].join(" ")
                  }
                >
                  <item.icon size={18} />
                  {item.label}
                </NavLink>
              ))}

              <NavLink
                to="/exercises"
                onClick={() => setMenuOpen(false)}
                className="flex min-h-12 items-center gap-3 rounded-[var(--radius-md)] px-4 text-sm font-semibold text-[var(--text-muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"
              >
                <ExerciseIcon size={18} />
                Exercise library
              </NavLink>

              <NavLink
                to="/settings"
                onClick={() => setMenuOpen(false)}
                className="flex min-h-12 items-center gap-3 rounded-[var(--radius-md)] px-4 text-sm font-semibold text-[var(--text-muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"
              >
                <Settings size={18} />
                Settings
              </NavLink>

              <button
                type="button"
                onClick={() => void handleSignOut()}
                className="flex min-h-12 items-center gap-3 rounded-[var(--radius-md)] px-4 text-sm font-semibold text-[var(--danger)] hover:bg-[var(--danger-soft)]"
              >
                Sign out
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
