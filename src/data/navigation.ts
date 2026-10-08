import {
  ChartColumn,
  Dumbbell,
  History,
  House,
  NotebookTabs,
  Sparkles,
} from "lucide-react";

export type NavigationItem = {
  label: string;
  path: string;
  icon: typeof House;
};

export const publicNavigation: NavigationItem[] = [
  { label: "Exercises", path: "/exercises", icon: NotebookTabs },
  { label: "Mindset", path: "/mindset", icon: Sparkles },
];

export const authenticatedNavigation: NavigationItem[] = [
  { label: "Home", path: "/dashboard", icon: House },
  { label: "Workouts", path: "/workouts", icon: Dumbbell },
  { label: "History", path: "/history", icon: History },
  { label: "Statistics", path: "/statistics", icon: ChartColumn },
];

export const mobileNavigation = authenticatedNavigation.map((item) => ({
  ...item,
  label: item.label === "Statistics" ? "Stats" : item.label,
}));
