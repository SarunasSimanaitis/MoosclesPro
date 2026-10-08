import {
  Menu,
  Moon,
  Settings,
  Sun,
  X,
} from "lucide-react";
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

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/94 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[4.25rem] max-w-[120rem] items-center justify-between gap-4 px-4 sm:px-6 xl:px-8">
        <NavLink
          to={loggedIn ? "/dashboard" : "/"}
          onClick={() => setMenuOpen(false)}
          className="shrink-0 text-xl font-black tracking-tight sm:text-2xl"
          aria-label="MoosclesPro home"
        >
          Mooscles<span className="text-[var(--primary)]">Pro</span>
        </NavLink>

        {!loggedIn && (
          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
            {publicNavigation.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-md)] px-3 text-sm font-semibold ${isActive ? "bg-[var(--primary-soft)] text-[var(--primary)]" : "text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--text)]"}`
                }
              >
                <item.icon size={17} />
                {item.label}
              </NavLink>
            ))}
          </nav>
        )}

        {loggedIn && (
          <nav className="hidden items-center gap-1 md:flex xl:hidden" aria-label="Primary navigation">
            {authenticatedNavigation.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-md)] px-3 text-sm font-semibold ${isActive ? "bg-[var(--primary-soft)] text-[var(--primary)]" : "text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--text)]"}`
                }
              >
                <item.icon size={17} />
                {item.label}
              </NavLink>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-1.5">
          {!isPending && loggedIn && (
            <div className="hidden items-center gap-2 pr-1 sm:flex">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primary-soft)] text-xs font-black text-[var(--primary)]">
                {initial}
              </span>
              <span className="hidden max-w-28 truncate text-sm font-semibold lg:block">{name}</span>
              <button
                type="button"
                onClick={() => navigate("/settings")}
                className="hidden min-h-11 items-center gap-2 rounded-[var(--radius-md)] px-3 text-sm font-semibold text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--text)] xl:hidden lg:flex"
              >
                <Settings size={16} />
                Settings
              </button>
            </div>
          )}

          {!isPending && !loggedIn && (
            <div className="hidden items-center gap-1 sm:flex">
              <NavLink
                to="/login"
                className="inline-flex min-h-11 items-center rounded-[var(--radius-md)] px-4 text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text)]"
              >
                Log in
              </NavLink>
              <NavLink
                to="/register"
                className="inline-flex min-h-11 items-center rounded-[var(--radius-md)] bg-[var(--primary)] px-4 text-sm font-semibold text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)]"
              >
                Create account
              </NavLink>
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="h-11 w-11 p-0"
            aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </Button>

          {loggedIn && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setMenuOpen((value) => !value)}
              className="h-11 w-11 p-0 md:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-more-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? <X size={19} /> : <Menu size={19} />}
            </Button>
          )}
        </div>
      </div>

      {menuOpen && loggedIn && (
        <div id="mobile-more-menu" className="border-t border-[var(--border)] bg-[var(--surface)] md:hidden">
          <nav className="mx-auto max-w-lg px-4 py-4 sm:px-6" aria-label="More navigation">
            <div className="space-y-1">
              {publicNavigation.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex min-h-11 items-center gap-3 rounded-[var(--radius-md)] px-4 py-3 text-sm font-semibold ${isActive ? "bg-[var(--primary-soft)] text-[var(--primary)]" : "text-[var(--text-muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"}`
                  }
                >
                  <item.icon size={18} />
                  {item.label}
                </NavLink>
              ))}

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/settings");
                }}
                className="flex min-h-11 w-full items-center gap-3 rounded-[var(--radius-md)] px-4 py-3 text-sm font-semibold text-[var(--text-muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"
              >
                <Settings size={18} />
                Settings
              </button>

              <button
                type="button"
                onClick={() => void handleSignOut()}
                className="flex min-h-11 w-full items-center rounded-[var(--radius-md)] px-4 py-3 text-sm font-semibold text-[var(--danger)] hover:bg-[var(--danger-soft)]"
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
