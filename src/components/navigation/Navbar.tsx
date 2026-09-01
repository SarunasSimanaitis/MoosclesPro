import {
  LogOut,
  Menu,
  Moon,
  Sun,
  UserCircle2,
  X,
} from "lucide-react";
import { useState } from "react";
import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  authenticatedNavigation,
  publicNavigation,
  type NavigationItem,
} from "../../data/navigation";

import { useTheme } from "../../hooks/useTheme";
import { authClient } from "../../lib/auth-client";

import Button from "../ui/Button";

export default function Navbar() {
  const {
    theme,
    toggleTheme,
  } = useTheme();

  const [
    mobileOpen,
    setMobileOpen,
  ] = useState(false);

  const navigate =
    useNavigate();

  const {
    data: session,
    isPending,
  } =
    authClient.useSession();

  const isLoggedIn =
    Boolean(session?.user);

  const navigation =
    isLoggedIn
      ? authenticatedNavigation
      : publicNavigation;

  async function handleSignOut() {
    try {
      await authClient.signOut();
    } finally {
      setMobileOpen(false);
      navigate("/");
    }
  }

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-[1900px] items-center justify-between px-5 lg:px-10">
        {/* Brand */}

        <NavLink
          to={
            isLoggedIn
              ? "/dashboard"
              : "/"
          }
          onClick={closeMobileMenu}
          className="shrink-0 text-2xl font-black tracking-tight text-[var(--text)] transition-opacity hover:opacity-80"
          aria-label="MoosclesPro home"
        >
          Mooscles
          <span className="text-[var(--primary)]">
            Pro
          </span>
        </NavLink>

        {/* Desktop navigation */}

        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-1 md:flex"
        >
          {navigation.map(
            (link) => (
              <DesktopNavItem
                key={link.path}
                link={link}
              />
            ),
          )}
        </nav>

        {/* Actions */}

        <div className="flex items-center gap-2">
          {!isPending && (
            <>
              {isLoggedIn ? (
                <AuthenticatedActions
                  userName={
                    session?.user?.name ?? ""
                  }
                  onSignOut={handleSignOut}
                />
              ) : (
                <PublicActions />
              )}
            </>
          )}

          {/* Theme */}

          <Button
            variant="ghost"
            size="sm"
            onClick={
              toggleTheme
            }
            className="h-10 w-10 rounded-xl p-0"
            aria-label={
              theme === "light"
                ? "Switch to dark mode"
                : "Switch to light mode"
            }
          >
            {theme ===
              "light" ? (
              <Moon
                size={18}
                strokeWidth={1.8}
              />
            ) : (
              <Sun
                size={18}
                strokeWidth={1.8}
              />
            )}
          </Button>

          {/* Mobile menu */}

          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              setMobileOpen(
                (open) => !open,
              )
            }
            className="h-10 w-10 rounded-xl p-0 md:hidden"
            aria-label={
              mobileOpen
                ? "Close navigation"
                : "Open navigation"
            }
            aria-expanded={
              mobileOpen
            }
          >
            {mobileOpen ? (
              <X size={19} />
            ) : (
              <Menu size={19} />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile navigation */}

      {mobileOpen && (
        <nav
          aria-label="Mobile navigation"
          className="border-t border-[var(--border)] bg-[var(--background)] px-5 py-4 md:hidden"
        >
          <div className="mx-auto max-w-[1900px] space-y-1">
            {navigation.map(
              (link) => (
                <MobileNavItem
                  key={link.path}
                  link={link}
                  onClick={
                    closeMobileMenu
                  }
                />
              ),
            )}

            {!isPending &&
              (isLoggedIn ? (
                <button
                  type="button"
                  onClick={
                    handleSignOut
                  }
                  className="mt-2 flex w-full items-center gap-3 rounded-xl border-t border-[var(--border)] px-4 py-4 pt-5 text-sm font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
                >
                  <LogOut size={18} />
                  Log out
                </button>
              ) : (
                <div className="mt-3 grid gap-2 border-t border-[var(--border)] pt-3">
                  <NavLink
                    to="/login"
                    onClick={
                      closeMobileMenu
                    }
                    className="rounded-xl px-4 py-3 text-sm font-semibold text-[var(--text-muted)] transition hover:bg-[var(--surface)] hover:text-[var(--text)]"
                  >
                    Log in
                  </NavLink>

                  <NavLink
                    to="/register"
                    onClick={
                      closeMobileMenu
                    }
                    className="rounded-xl bg-[var(--primary)] px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-[var(--primary-hover)]"
                  >
                    Create account
                  </NavLink>
                </div>
              ))}
          </div>
        </nav>
      )}
    </header>
  );
}

function DesktopNavItem({
  link,
}: {
  link: NavigationItem;
}) {
  const Icon = link.icon;

  return (
    <NavLink
      to={link.path}
      className={({ isActive }) =>
        `
        flex items-center gap-2
        rounded-xl
        px-4 py-2.5
        text-sm font-medium
        transition-all duration-200
        ${isActive
          ? "bg-[var(--primary-soft)] text-[var(--primary)]"
          : "text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--text)]"
        }
      `
      }
    >
      <Icon
        size={17}
        strokeWidth={1.8}
      />

      <span>
        {link.label}
      </span>
    </NavLink>
  );
}

function MobileNavItem({
  link,
  onClick,
}: {
  link: NavigationItem;
  onClick: () => void;
}) {
  const Icon = link.icon;

  return (
    <NavLink
      to={link.path}
      onClick={onClick}
      className={({ isActive }) =>
        `
        flex items-center gap-3
        rounded-xl
        px-4 py-3
        text-sm font-medium
        transition-colors
        ${isActive
          ? "bg-[var(--primary-soft)] text-[var(--primary)]"
          : "text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--text)]"
        }
      `
      }
    >
      <Icon
        size={18}
        strokeWidth={1.8}
      />

      {link.label}
    </NavLink>
  );
}

function AuthenticatedActions({
  userName,
  onSignOut,
}: {
  userName: string;
  onSignOut: () => void;
}) {
  return (
    <>
      <div className="hidden items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 sm:flex">
        <UserCircle2
          size={18}
          className="text-[var(--primary)]"
        />

        <span className="max-w-32 truncate text-sm font-semibold text-[var(--text)]">
          {userName}
        </span>
      </div>

      <Button
        variant="secondary"
        size="sm"
        onClick={onSignOut}
        className="hidden sm:inline-flex"
      >
        <LogOut size={16} />
        <span>Log out</span>
      </Button>
    </>
  );
}

function PublicActions() {
  return (
    <>
      <NavLink
        to="/login"
        className="hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-[var(--text-muted)] transition hover:bg-[var(--surface)] hover:text-[var(--text)] sm:inline-flex"
      >
        Log in
      </NavLink>

      <NavLink
        to="/register"
        className="hidden rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--primary-hover)] sm:inline-flex"
      >
        Create account
      </NavLink>
    </>
  );
}