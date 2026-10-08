import { ChevronDown, LogOut, Menu, Moon, Settings, Sun, X } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { publicNavigation } from "../../data/navigation";
import { useTheme } from "../../hooks/useTheme";
import { authClient } from "../../lib/auth-client";
import Button from "../ui/Button";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const navigate = useNavigate();
  const { data: session, isPending } = authClient.useSession();

  const isLoggedIn = Boolean(session?.user);
  const userName = session?.user?.name?.trim() || "Account";
  const userInitial = userName.charAt(0).toUpperCase() || "A";

  async function handleSignOut() {
    try {
      await authClient.signOut();
    } catch (error) {
      console.error("Failed to sign out:", error);
    } finally {
      setAccountOpen(false);
      setMobileOpen(false);
      navigate("/");
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto flex min-h-[4.25rem] max-w-[1900px] items-center justify-between gap-3 px-4 sm:px-5 lg:px-7">
        <NavLink
          to={isLoggedIn ? "/dashboard" : "/"}
          className="shrink-0 text-xl font-black tracking-tight text-[var(--text)] sm:text-2xl"
          aria-label="MoosclesPro home"
        >
          Mooscles<span className="text-[var(--primary)]">Pro</span>
        </NavLink>

        <div className="flex items-center gap-1.5">
          {!isPending && (
            isLoggedIn ? (
              <AccountMenu
                userName={userName}
                userInitial={userInitial}
                open={accountOpen}
                onToggle={() => setAccountOpen((open) => !open)}
                onSettings={() => {
                  setAccountOpen(false);
                  navigate("/settings");
                }}
                onSignOut={handleSignOut}
              />
            ) : (
              <div className="hidden items-center gap-1 sm:flex">
                <NavLink to="/login" className="rounded-[var(--radius-md)] px-4 py-2.5 text-sm font-semibold text-[var(--text-muted)] hover:bg-[var(--surface-soft)]">
                  Log in
                </NavLink>
                <NavLink to="/register" className="inline-flex min-h-11 items-center rounded-[var(--radius-md)] bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)]">
                  Create account
                </NavLink>
              </div>
            )
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="h-11 w-11 min-h-11 rounded-xl p-0"
            aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setMobileOpen((open) => !open)}
            className="h-11 w-11 min-h-11 rounded-xl p-0 md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
          >
            {mobileOpen ? <X size={19} /> : <Menu size={19} />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div id="mobile-navigation" className="border-t border-[var(--border)] bg-[var(--surface)] md:hidden">
          <nav aria-label="More navigation" className="px-4 py-4 sm:px-5">
            <p className="px-1 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">
              More
            </p>

            <div className="mt-2 space-y-1">
              {publicNavigation.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `
                      flex min-h-11 items-center gap-3 rounded-[var(--radius-md)] px-4 py-3 text-sm font-semibold
                      ${isActive
                        ? "bg-[var(--primary-soft)] text-[var(--primary)]"
                        : "text-[var(--text-muted)] hover:bg-[var(--surface-soft)]"
                      }
                    `
                  }
                >
                  <link.icon size={18} />
                  {link.label}
                </NavLink>
              ))}

              {isLoggedIn && (
                <>
                  <NavLink
                    to="/settings"
                    onClick={() => setMobileOpen(false)}
                    className="flex min-h-11 items-center gap-3 rounded-[var(--radius-md)] px-4 py-3 text-sm font-semibold text-[var(--text-muted)] hover:bg-[var(--surface-soft)]"
                  >
                    <Settings size={18} />
                    Settings
                  </NavLink>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex min-h-11 w-full items-center gap-3 rounded-[var(--radius-md)] px-4 py-3 text-left text-sm font-semibold text-[var(--danger)] hover:bg-[var(--danger-soft)]"
                  >
                    <LogOut size={18} />
                    Log out
                  </button>
                </>
              )}

              {!isLoggedIn && (
                <div className="mt-3 grid gap-2 border-t border-[var(--border)] pt-3 sm:hidden">
                  <NavLink
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex min-h-11 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border-strong)] px-4 text-sm font-semibold"
                  >
                    Log in
                  </NavLink>
                  <NavLink
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="flex min-h-11 items-center justify-center rounded-[var(--radius-md)] bg-[var(--primary)] px-4 text-sm font-semibold text-[var(--primary-foreground)]"
                  >
                    Create account
                  </NavLink>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function AccountMenu({
  userName,
  userInitial,
  open,
  onToggle,
  onSettings,
  onSignOut,
}: {
  userName: string;
  userInitial: string;
  open: boolean;
  onToggle: () => void;
  onSettings: () => void;
  onSignOut: () => void;
}) {
  return (
    <div className="relative hidden sm:block">
      <button
        type="button"
        onClick={onToggle}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex min-h-11 items-center gap-2.5 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-soft)] px-2.5 py-2 text-left hover:border-[var(--border-strong)]"
      >
        <Avatar initial={userInitial} />
        <span className="hidden max-w-32 truncate text-sm font-semibold text-[var(--text)] lg:block">
          {userName}
        </span>
        <ChevronDown size={16} className={`text-[var(--text-muted)] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+0.6rem)] z-50 w-56 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-1.5 shadow-[var(--shadow-lg)]"
        >
          <div className="px-3 py-3">
            <p className="truncate text-sm font-bold text-[var(--text)]">{userName}</p>
            <p className="mt-0.5 text-xs text-[var(--text-muted)]">Account</p>
          </div>
          <div className="my-1 border-t border-[var(--border)]" />
          <MenuButton icon={<Settings size={17} />} label="Settings" onClick={onSettings} />
          <MenuButton icon={<LogOut size={17} />} label="Log out" onClick={onSignOut} danger />
        </div>
      )}
    </div>
  );
}

function MenuButton({
  icon,
  label,
  onClick,
  danger = false,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={`
        flex min-h-11 w-full items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-sm font-semibold
        ${danger ? "text-[var(--danger)] hover:bg-[var(--danger-soft)]" : "text-[var(--text-muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"}
      `}
    >
      {icon}
      {label}
    </button>
  );
}

function Avatar({ initial }: { initial: string }) {
  return (
    <span
      aria-hidden="true"
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--primary-soft)] text-xs font-black text-[var(--primary)]"
    >
      {initial}
    </span>
  );
}