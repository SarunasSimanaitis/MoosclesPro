import {
  ChartColumn,
  Dumbbell,
  History,
  House,
  Search,
  Sparkles,
} from "lucide-react";

export type NavigationItem = {
  label: string;
  path: string;
  icon: typeof House;
};

export const publicNavigation: NavigationItem[] = [
  { label: "Exercises", path: "/exercises", icon: Search },
  { label: "Mindset", path: "/mindset", icon: Sparkles },
];

/** Full list, shown in the desktop sidebar. */
export const authenticatedNavigation: NavigationItem[] = [
  { label: "Home", path: "/dashboard", icon: House },
  { label: "Workouts", path: "/workouts", icon: Dumbbell },
  { label: "Exercises", path: "/exercises", icon: Search },
  { label: "History", path: "/history", icon: History },
  { label: "Statistics", path: "/statistics", icon: ChartColumn },
  { label: "Mindset", path: "/mindset", icon: Sparkles },
];

/** Phone bottom tab bar. The profile tab is added separately as an avatar. */
export const mobileTabNavigation: NavigationItem[] = [
  { label: "Home", path: "/dashboard", icon: House },
  { label: "Workouts", path: "/workouts", icon: Dumbbell },
  { label: "History", path: "/history", icon: History },
  { label: "Statistics", path: "/statistics", icon: ChartColumn },
];

/** Phone top bar shortcuts for the remaining sections. */
export const mobileTopNavigation: NavigationItem[] = [
  { label: "Exercises", path: "/exercises", icon: Search },
  { label: "Mindset", path: "/mindset", icon: Sparkles },
];

/**
 * Detail pages live under a section; keep that section highlighted in the
 * navigation while one of them is open.
 */
export function isSectionActive(itemPath: string, pathname: string) {
  if (pathname === itemPath || pathname.startsWith(`${itemPath}/`)) return true;

  if (itemPath === "/workouts") {
    return pathname.startsWith("/workout/") || pathname.startsWith("/program/") || pathname === "/session";
  }

  return false;
}
