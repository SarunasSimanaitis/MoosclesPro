import { Menu, Moon, Sun, X } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

import { navigation } from "../../data/navigation";
import { useTheme } from "../../hooks/useTheme";
import Button from "../ui/Button";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-[1900px] items-center justify-between px-5 lg:px-10">
        {/* Logo */}
        <NavLink
          to="/"
          onClick={() => setMobileOpen(false)}
          className="shrink-0 text-2xl font-black tracking-tight text-[var(--text)] transition-opacity hover:opacity-80"
        >
          Mooscles
          <span className="text-[var(--primary)]">Pro</span>
        </NavLink>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navigation.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `
                  flex items-center gap-2
                  rounded-xl
                  px-4 py-2.5
                  text-sm font-medium
                  transition-all duration-200
                  ${
                    isActive
                      ? "bg-[var(--primary-soft)] text-[var(--primary)]"
                      : "text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--text)]"
                  }
                `
                }
              >
                <Icon size={17} strokeWidth={1.8} />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
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
              <Moon size={18} strokeWidth={1.8} />
            ) : (
              <Sun size={18} strokeWidth={1.8} />
            )}
          </Button>

          {/* Mobile menu */}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setMobileOpen((open) => !open)}
            className="h-10 w-10 rounded-xl p-0 md:hidden"
            aria-label={
              mobileOpen
                ? "Close navigation"
                : "Open navigation"
            }
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X size={19} />
            ) : (
              <Menu size={19} />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <nav className="border-t border-[var(--border)] bg-[var(--background)] px-5 py-4 md:hidden">
          <div className="mx-auto max-w-[1900px] space-y-1">
            {navigation.map((link) => {
              const Icon = link.icon;

              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `
                    flex items-center gap-3
                    rounded-xl
                    px-4 py-3
                    text-sm font-medium
                    transition-colors
                    ${
                      isActive
                        ? "bg-[var(--primary-soft)] text-[var(--primary)]"
                        : "text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--text)]"
                    }
                  `
                  }
                >
                  <Icon size={18} strokeWidth={1.8} />
                  {link.label}
                </NavLink>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}