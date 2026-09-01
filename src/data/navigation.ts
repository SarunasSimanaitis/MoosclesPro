import {
  ChartColumn,
  Dumbbell,
  History,
  House,
  NotebookTabs,
  PlayCircle,
  Settings,
  Sparkles,
} from "lucide-react";

export type NavigationItem = {
  label: string;
  path: string;
  icon: typeof House;
};

export const publicNavigation: NavigationItem[] = [
  {
    label: "Exercises",
    path: "/exercises",
    icon: NotebookTabs,
  },
  {
    label: "Mindset",
    path: "/mindset",
    icon: Sparkles,
  },
];

export const authenticatedNavigation: NavigationItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: House,
  },
  {
    label: "Workouts",
    path: "/workouts",
    icon: Dumbbell,
  },
  {
    label: "Session",
    path: "/session",
    icon: PlayCircle,
  },
  {
    label: "History",
    path: "/history",
    icon: History,
  },
  {
    label: "Statistics",
    path: "/statistics",
    icon: ChartColumn,
  },
  ...publicNavigation,
  {
    label: "Settings",
    path: "/settings",
    icon: Settings,
  },
];