import {
  ChevronDown,
  LogOut,
  Menu,
  Moon,
  Settings,
  Sun,
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

  const [
    accountOpen,
    setAccountOpen,
  ] = useState(false);

  const navigate = useNavigate();

  const {
    data: session,
    isPending,
  } = authClient.useSession();

  const isLoggedIn =
    Boolean(session?.user);

  const navigation =
    isLoggedIn
      ? authenticatedNavigation
      : publicNavigation;

  async function handleSignOut() {
    try {
      await authClient.signOut();
    } catch (error) {
      console.error(
        "Failed to sign out:",
        error,
      );
    } finally {
      setAccountOpen(false);
      setMobileOpen(false);
      navigate("/");
    }
  }

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  function toggleAccountMenu() {
    setAccountOpen(
      (current) => !current,
    );
  }

  const userName =
    session?.user?.name?.trim() ||
    "Account";

  const userInitial =
    userName
      .charAt(0)
      .toUpperCase() || "A";

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/92 backdrop-blur-xl">
      <div className="mx-auto flex h-[4.5rem] max-w-[1900px] items-center justify-between gap-6 px-5 lg:px-10">
        {/* Brand */}
        <NavLink
          to={
            isLoggedIn
              ? "/dashboard"
              : "/"
          }
          onClick={closeMobileMenu}
          className="
            shrink-0
            text-2xl
            font-black
            tracking-tight
            text-[var(--text)]
            transition-opacity
            hover:opacity-80
          "
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
          className="hidden flex-1 items-center justify-center gap-1 md:flex"
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

        {/* Right actions */}
        <div className="relative flex shrink-0 items-center gap-2">
          {!isPending &&
            (isLoggedIn ? (
              <AccountMenu
                userName={userName}
                userInitial={
                  userInitial
                }
                open={accountOpen}
                onToggle={
                  toggleAccountMenu
                }
                onSettings={() => {
                  setAccountOpen(
                    false,
                  );
                  navigate(
                    "/settings",
                  );
                }}
                onSignOut={
                  handleSignOut
                }
              />
            ) : (
              <PublicActions />
            ))}

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="h-10 w-10 rounded-xl p-0"
            aria-label={
              theme === "light"
                ? "Switch to dark mode"
                : "Switch to light mode"
            }
          >
            {theme === "light" ? (
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
            aria-controls="mobile-navigation"
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
        <div
          id="mobile-navigation"
          className="border-t border-[var(--border)] bg-[var(--background)] md:hidden"
        >
          <nav
            aria-label="Mobile navigation"
            className="mx-auto max-w-[1900px] px-5 py-4"
          >
            <div className="space-y-1">
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
            </div>

            {!isPending &&
              (isLoggedIn ? (
                <div className="mt-4 border-t border-[var(--border)] pt-4">
                  <div className="mb-3 flex items-center gap-3 rounded-[var(--radius-md)] bg-[var(--surface)] p-4">
                    <Avatar
                      initial={
                        userInitial
                      }
                    />

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-[var(--text)]">
                        {userName}
                      </p>

                      <p className="text-xs text-[var(--text-muted)]">
                        Your account
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      closeMobileMenu();
                      navigate(
                        "/settings",
                      );
                    }}
                    className="
                      flex
                      w-full
                      items-center
                      gap-3
                      rounded-[var(--radius-md)]
                      px-4
                      py-3
                      text-sm
                      font-semibold
                      text-[var(--text-muted)]
                      transition-colors
                      hover:bg-[var(--surface)]
                      hover:text-[var(--text)]
                    "
                  >
                    <Settings size={18} />
                    Settings
                  </button>

                  <button
                    type="button"
                    onClick={
                      handleSignOut
                    }
                    className="
                      flex
                      w-full
                      items-center
                      gap-3
                      rounded-[var(--radius-md)]
                      px-4
                      py-3
                      text-sm
                      font-semibold
                      text-[var(--danger)]
                      transition-colors
                      hover:bg-[var(--danger-soft)]
                    "
                  >
                    <LogOut size={18} />
                    Log out
                  </button>
                </div>
              ) : (
                <div className="mt-4 grid gap-2 border-t border-[var(--border)] pt-4">
                  <NavLink
                    to="/login"
                    onClick={
                      closeMobileMenu
                    }
                    className="
                      rounded-[var(--radius-md)]
                      px-4
                      py-3
                      text-sm
                      font-semibold
                      text-[var(--text-muted)]
                      transition-colors
                      hover:bg-[var(--surface)]
                      hover:text-[var(--text)]
                    "
                  >
                    Log in
                  </NavLink>

                  <NavLink
                    to="/register"
                    onClick={
                      closeMobileMenu
                    }
                    className="
                      rounded-[var(--radius-md)]
                      bg-[var(--primary)]
                      px-4
                      py-3
                      text-center
                      text-sm
                      font-semibold
                      text-[var(--primary-foreground)]
                      transition-colors
                      hover:bg-[var(--primary-hover)]
                    "
                  >
                    Create account
                  </NavLink>
                </div>
              ))}
          </nav>
        </div>
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
        group
        relative
        flex
        items-center
        gap-2
        rounded-[var(--radius-md)]
        px-4
        py-2.5
        text-sm
        font-semibold
        transition-colors
        ${
          isActive
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
        flex
        items-center
        gap-3
        rounded-[var(--radius-md)]
        px-4
        py-3
        text-sm
        font-semibold
        transition-colors
        ${
          isActive
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
        className="
          flex
          items-center
          gap-2.5
          rounded-[var(--radius-md)]
          border
          border-[var(--border)]
          bg-[var(--surface)]
          px-2.5
          py-2
          text-left
          transition-[border-color,background-color]
          hover:border-[var(--border-strong)]
          hover:bg-[var(--surface-hover)]
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-[var(--primary)]
        "
      >
        <Avatar initial={userInitial} />

        <span className="hidden max-w-28 truncate text-sm font-semibold text-[var(--text)] lg:block">
          {userName}
        </span>

        <ChevronDown
          size={16}
          className={`
            text-[var(--text-muted)]
            transition-transform
            duration-200
            ${open ? "rotate-180" : ""}
          `}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="
            absolute
            right-0
            top-[calc(100%+0.6rem)]
            z-50
            w-56
            overflow-hidden
            rounded-[var(--radius-lg)]
            border
            border-[var(--border)]
            bg-[var(--surface)]
            p-1.5
            shadow-[var(--shadow-lg)]
          "
        >
          <div className="px-3 py-3">
            <p className="truncate text-sm font-bold text-[var(--text)]">
              {userName}
            </p>

            <p className="mt-0.5 text-xs text-[var(--text-muted)]">
              Account
            </p>
          </div>

          <div className="my-1 border-t border-[var(--border)]" />

          <MenuButton
            icon={
              <Settings size={17} />
            }
            label="Settings"
            onClick={
              onSettings
            }
          />

          <MenuButton
            icon={
              <LogOut size={17} />
            }
            label="Log out"
            onClick={
              onSignOut
            }
            danger
          />
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
  icon: React.ReactNode;
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
        flex
        w-full
        items-center
        gap-3
        rounded-[var(--radius-md)]
        px-3
        py-2.5
        text-sm
        font-semibold
        transition-colors
        ${
          danger
            ? "text-[var(--danger)] hover:bg-[var(--danger-soft)]"
            : "text-[var(--text-muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"
        }
      `}
    >
      {icon}
      {label}
    </button>
  );
}

function PublicActions() {
  return (
    <div className="hidden items-center gap-1 sm:flex">
      <NavLink
        to="/login"
        className="
          rounded-[var(--radius-md)]
          px-4
          py-2.5
          text-sm
          font-semibold
          text-[var(--text-muted)]
          transition-colors
          hover:bg-[var(--surface)]
          hover:text-[var(--text)]
        "
      >
        Log in
      </NavLink>

      <NavLink
        to="/register"
        className="
          rounded-[var(--radius-md)]
          bg-[var(--primary)]
          px-4
          py-2.5
          text-sm
          font-semibold
          text-[var(--primary-foreground)]
          transition-colors
          hover:bg-[var(--primary-hover)]
        "
      >
        Create account
      </NavLink>
    </div>
  );
}

function Avatar({
  initial,
}: {
  initial: string;
}) {
  return (
    <span
      aria-hidden="true"
      className="
        flex
        h-8
        w-8
        shrink-0
        items-center
        justify-center
        rounded-full
        bg-[var(--primary-soft)]
        text-xs
        font-black
        text-[var(--primary)]
      "
    >
      {initial}
    </span>
  );
}