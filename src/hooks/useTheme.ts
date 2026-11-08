import { useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "mooscles-theme";

function readStoredTheme(): Theme {
  try {
    const savedTheme = localStorage.getItem(STORAGE_KEY);

    if (savedTheme === "light" || savedTheme === "dark") {
      return savedTheme;
    }
  } catch {
    // Storage can be unavailable (private mode, blocked cookies).
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;

  const themeColor = document.querySelector('meta[name="theme-color"]');
  themeColor?.setAttribute("content", theme === "dark" ? "#000000" : "#ffffff");
}

/*
 * One theme value for the whole app. Every component that calls useTheme()
 * reads and updates the same value, so toggles in different places never
 * disagree.
 */
let currentTheme: Theme = readStoredTheme();
applyTheme(currentTheme);

const listeners = new Set<() => void>();

function setTheme(theme: Theme) {
  if (theme === currentTheme) return;

  currentTheme = theme;
  applyTheme(theme);

  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // The theme still applies for this visit.
  }

  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return currentTheme;
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  function toggleTheme() {
    setTheme(currentTheme === "light" ? "dark" : "light");
  }

  return {
    theme,
    setTheme,
    toggleTheme,
  };
}
