import { LogOut, Moon, Sun } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  authenticatedNavigation,
  isSectionActive,
  mobileTabNavigation,
  mobileTopNavigation,
  publicNavigation,
  type NavigationItem,
} from "../../data/navigation";
import { useSignOut } from "../../hooks/useSignOut";
import { useTheme } from "../../hooks/useTheme";
import { preloadRoute } from "../../lib/routePreload";
import BrandLogo from "../ui/BrandLogo";

type AccountProps = {
  name: string;
};

function initialFor(name: string) {
  return name.trim().charAt(0).toUpperCase() || "A";
}

function Avatar({ name, active = false, size = 24 }: AccountProps & { active?: boolean; size?: number }) {
  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size }}
      className={[
        "flex shrink-0 items-center justify-center rounded-full bg-[var(--surface-soft)] text-[11px] font-semibold text-[var(--text)]",
        active ? "ring-2 ring-[var(--text)] ring-offset-1 ring-offset-[var(--background)]" : "",
      ].join(" ")}
    >
      {initialFor(name)}
    </span>
  );
}

function ThemeToggleButton({ withLabel = false }: { withLabel?: boolean }) {
  const { theme, toggleTheme } = useTheme();
  const label = theme === "light" ? "Switch to dark mode" : "Switch to light mode";
  const Icon = theme === "light" ? Moon : Sun;

  if (withLabel) {
    return (
      <button type="button" onClick={toggleTheme} aria-label={label} title={label} className={sidebarItemClass(false)}>
        <Icon size={24} strokeWidth={1.75} aria-hidden="true" className="shrink-0" />
        <span className="hidden xl:inline">{theme === "light" ? "Dark mode" : "Light mode"}</span>
      </button>
    );
  }

  return (
    <button type="button" onClick={toggleTheme} aria-label={label} title={label} className="theme-toggle">
      <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
    </button>
  );
}

function sidebarItemClass(active: boolean) {
  return [
    "group flex h-12 w-full items-center gap-4 rounded-[var(--radius-md)] px-3 text-[15px] transition-colors hover:bg-[var(--surface-soft)] justify-center xl:justify-start",
    active ? "font-bold text-[var(--text)]" : "font-normal text-[var(--text)]",
  ].join(" ");
}

function SidebarLink({ item }: { item: NavigationItem }) {
  const { pathname } = useLocation();
  const active = isSectionActive(item.path, pathname);
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      onPointerEnter={() => preloadRoute(item.path)}
      onFocus={() => preloadRoute(item.path)}
      aria-current={active ? "page" : undefined}
      title={item.label}
      className={sidebarItemClass(active)}
    >
      <Icon size={24} strokeWidth={active ? 2.5 : 1.75} aria-hidden="true" className="shrink-0 transition-transform group-hover:scale-105" />
      <span className="hidden xl:inline">{item.label}</span>
    </NavLink>
  );
}

/** Desktop and tablet: a fixed left sidebar, icon-only until there's room for labels. */
function Sidebar({ name }: AccountProps) {
  const { pathname } = useLocation();
  const { signOut, signingOut, error } = useSignOut();
  const settingsActive = pathname === "/settings";

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[72px] flex-col border-r border-[var(--border)] bg-[var(--background)] px-3 pb-5 pt-6 md:flex xl:w-[244px]">
      <NavLink to="/dashboard" aria-label="MoosclesPro home" className="mb-6 flex h-12 items-center justify-center px-1 xl:justify-start xl:px-3">
        <span className="xl:hidden"><BrandLogo compact /></span>
        <span className="hidden xl:block"><BrandLogo /></span>
      </NavLink>

      <nav aria-label="Primary navigation" className="flex flex-1 flex-col gap-1">
        {authenticatedNavigation.map((item) => (
          <SidebarLink key={item.path} item={item} />
        ))}
      </nav>

      <div className="flex flex-col gap-1">
        {error && (
          <p role="alert" className="hidden px-3 pb-2 text-xs text-[var(--danger)] xl:block">
            {error}
          </p>
        )}
        <ThemeToggleButton withLabel />
        <NavLink
          to="/settings"
          title="Profile and settings"
          aria-current={settingsActive ? "page" : undefined}
          className={sidebarItemClass(settingsActive)}
        >
          <Avatar name={name} active={settingsActive} />
          <span className="hidden xl:inline">Profile</span>
        </NavLink>
        <button
          type="button"
          onClick={() => void signOut()}
          disabled={signingOut}
          title="Sign out"
          aria-label="Sign out"
          className={`${sidebarItemClass(false)} disabled:opacity-50`}
        >
          <LogOut size={24} strokeWidth={1.75} aria-hidden="true" className="shrink-0" />
          <span className="hidden xl:inline">{signingOut ? "Signing out…" : "Sign out"}</span>
        </button>
      </div>
    </aside>
  );
}

/** Phones: slim top bar with the logo and two shortcuts. */
function MobileTopBar() {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--background)] pt-[env(safe-area-inset-top)] md:hidden">
      <div className="flex h-[var(--topbar-height)] items-center justify-between px-4">
        <NavLink to="/dashboard" aria-label="MoosclesPro home">
          <BrandLogo compact />
        </NavLink>

        <div className="flex items-center gap-1">
          {mobileTopNavigation.map((item) => {
            const Icon = item.icon;
            const active = isSectionActive(item.path, pathname);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                aria-label={item.label}
                title={item.label}
                aria-current={active ? "page" : undefined}
                onPointerDown={() => preloadRoute(item.path)}
                className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] text-[var(--text)]"
              >
                <Icon size={23} strokeWidth={active ? 2.5 : 1.75} aria-hidden="true" />
              </NavLink>
            );
          })}
          <ThemeToggleButton />
        </div>
      </div>
    </header>
  );
}

/** Phones: fixed bottom tab bar. */
function BottomTabBar({ name }: AccountProps) {
  const { pathname } = useLocation();
  const settingsActive = pathname === "/settings";

  return (
    <nav
      data-bottom-nav
      aria-label="Primary navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--border)] bg-[var(--background)] pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <div className="mx-auto flex h-[var(--bottom-nav-height)] max-w-md items-stretch justify-around">
        {mobileTabNavigation.map((item) => {
          const Icon = item.icon;
          const active = isSectionActive(item.path, pathname);
          return (
            <NavLink
              key={item.path}
              to={item.path}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
              onPointerDown={() => preloadRoute(item.path)}
              className="flex flex-1 items-center justify-center text-[var(--text)]"
            >
              <Icon size={25} strokeWidth={active ? 2.5 : 1.75} aria-hidden="true" />
            </NavLink>
          );
        })}
        <NavLink
          to="/settings"
          aria-label="Profile and settings"
          aria-current={settingsActive ? "page" : undefined}
          className="flex flex-1 items-center justify-center"
        >
          <Avatar name={name} active={settingsActive} size={26} />
        </NavLink>
      </div>
    </nav>
  );
}

/** Signed-out visitors: one simple top bar on every screen size. */
function PublicHeader() {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--background)] pt-[env(safe-area-inset-top)]">
      <div className="mx-auto flex h-[3.75rem] max-w-[1100px] items-center gap-2 px-4 sm:px-6">
        <NavLink to="/" aria-label="MoosclesPro home" className="mr-auto">
          <span className="sm:hidden"><BrandLogo compact /></span>
          <span className="hidden sm:block"><BrandLogo /></span>
        </NavLink>

        <nav aria-label="Primary navigation" className="flex items-center gap-1">
          {publicNavigation.map((item) => {
            const Icon = item.icon;
            const active = isSectionActive(item.path, pathname);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                aria-label={item.label}
                title={item.label}
                aria-current={active ? "page" : undefined}
                className={[
                  "flex h-10 items-center gap-2 rounded-[var(--radius-md)] px-2.5 text-sm hover:bg-[var(--surface-soft)]",
                  active ? "font-semibold text-[var(--text)]" : "text-[var(--text)]",
                ].join(" ")}
              >
                <Icon size={20} strokeWidth={active ? 2.5 : 1.75} aria-hidden="true" />
                <span className="hidden sm:inline">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <ThemeToggleButton />

        <NavLink
          to="/login"
          className="hidden h-9 items-center rounded-[var(--radius-md)] px-3 text-sm font-semibold text-[var(--text)] hover:bg-[var(--surface-soft)] sm:inline-flex"
        >
          Log in
        </NavLink>
        <NavLink
          to="/register"
          className="inline-flex h-9 shrink-0 items-center whitespace-nowrap rounded-[var(--radius-md)] bg-[var(--primary)] px-4 text-sm font-semibold text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)]"
        >
          Sign up
        </NavLink>
      </div>
    </header>
  );
}

type NavbarProps = {
  loggedIn: boolean;
  name: string;
  showBottomNav: boolean;
};

export default function Navbar({ loggedIn, name, showBottomNav }: NavbarProps) {
  if (!loggedIn) {
    return <PublicHeader />;
  }

  return (
    <>
      <Sidebar name={name} />
      <MobileTopBar />
      {showBottomNav && <BottomTabBar name={name} />}
    </>
  );
}

