import { Menu, Moon, Settings, Sun, X } from "lucide-react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  authenticatedNavigation,
  publicNavigation,
} from "../../data/navigation";
import { useTheme } from "../../hooks/useTheme";
import { authClient } from "../../lib/auth-client";
import Button from "../ui/Button";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { data: session, isPending } = authClient.useSession();
  const loggedIn = Boolean(session?.user);
  const navigation = loggedIn ? authenticatedNavigation : publicNavigation;

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

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/90 shadow-sm backdrop-blur-2xl">
      <div className="mx-auto flex min-h-[68px] max-w-[1720px] items-center gap-2 px-4 sm:px-7 lg:min-h-[76px] lg:px-10 2xl:px-14">
        <NavLink
          to={loggedIn ? "/dashboard" : "/"}
          onClick={closeMenu}
          className="shrink-0 text-xl font-black tracking-[-0.05em] sm:text-2xl"
          aria-label="MoosclesPro home"
        >
          Mooscles<span className="text-[var(--primary)]">Pro</span>
        </NavLink>

        <nav className="ml-4 hidden min-w-0 flex-1 items-center gap-1 lg:flex" aria-label="Primary navigation">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  [
                    "inline-flex min-h-11 items-center gap-2 rounded-full px-3.5 text-sm font-semibold transition-colors xl:px-4",
                    isActive
                      ? "bg-[var(--primary-soft)] text-[var(--primary)]"
                      : "text-[var(--text-muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)]",
                  ].join(" ")
                }
              >
                <Icon size={16} strokeWidth={2} aria-hidden="true" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          {!isPending && loggedIn && (
            <button
              type="button"
              onClick={() => navigate("/settings")}
              className="hidden min-h-11 items-center gap-2 rounded-full px-2.5 text-sm font-semibold text-[var(--text)] transition-colors hover:bg-[var(--surface-soft)] sm:flex"
              aria-label="Open settings"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--surface-soft)] text-xs font-black text-[var(--primary)]">
                {initial}
              </span>
              <span className="hidden xl:inline">{name}</span>
              <Settings size={16} className="text-[var(--text-muted)]" aria-hidden="true" />
            </button>
          )}

          {!isPending && !loggedIn && (
            <div className="hidden items-center gap-2 lg:flex">
              <NavLink to="/login" className="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold text-[var(--text-muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)]">
                Log in
              </NavLink>
              <NavLink to="/register"><Button size="sm">Create account</Button></NavLink>
            </div>
          )}

          <button
            type="button"
            className="theme-toggle px-0 sm:px-3"
            onClick={toggleTheme}
            aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
            title={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
          >
            {theme === "light" ? <Moon size={19} strokeWidth={2.3} aria-hidden="true" /> : <Sun size={19} strokeWidth={2.3} aria-hidden="true" />}
            <span className="hidden text-xs font-bold sm:inline">{theme === "light" ? "Dark" : "Light"}</span>
          </button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setMenuOpen((value) => !value)}
            className="h-11 w-11 rounded-full p-0 lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </Button>
        </div>
      </div>

      {menuOpen && (
        <div id="mobile-navigation" className="border-t border-[var(--border)] bg-[var(--surface)] shadow-lg backdrop-blur-2xl lg:hidden">
          <nav className="mx-auto grid max-w-[1720px] gap-1 px-4 py-3 sm:px-7 lg:px-10" aria-label="Mobile navigation">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    [
                      "flex min-h-12 items-center gap-3 rounded-2xl px-4 text-sm font-semibold",
                      isActive
                        ? "bg-[var(--primary-soft)] text-[var(--primary)]"
                        : "text-[var(--text-muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)]",
                    ].join(" ")
                  }
                >
                  <Icon size={18} aria-hidden="true" />
                  {item.label}
                </NavLink>
              );
            })}

            {loggedIn ? (
              <>
                <NavLink to="/settings" onClick={closeMenu} className="flex min-h-12 items-center gap-3 rounded-2xl px-4 text-sm font-semibold text-[var(--text-muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)]">
                  <Settings size={18} aria-hidden="true" />
                  Settings
                </NavLink>
                <button type="button" onClick={() => void handleSignOut()} className="flex min-h-12 items-center rounded-2xl px-4 text-left text-sm font-semibold text-[var(--danger)] hover:bg-[var(--danger-soft)]">
                  Sign out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 border-t border-[var(--border)] pt-3">
                <NavLink to="/login" onClick={closeMenu}><Button variant="secondary" className="w-full">Log in</Button></NavLink>
                <NavLink to="/register" onClick={closeMenu}><Button className="w-full">Create account</Button></NavLink>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
