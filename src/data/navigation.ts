import {
  House,
  Dumbbell,
  PlayCircle,
  History,
  ChartColumn,
  NotebookTabs,
  Settings,
  Sparkles,
} from "lucide-react";

export const navigation = [
  {
    label: "Dashboard",
    path: "/",
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
  {
    label: "Settings",
    path: "/settings",
    icon: Settings,
  },
];