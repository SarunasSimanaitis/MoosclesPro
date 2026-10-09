const importers: Record<string, () => Promise<unknown>> = {
  "/dashboard": () => import("../pages/Dashboard"),
  "/workouts": () => import("../pages/Workouts"),
  "/history": () => import("../pages/History"),
  "/statistics": () => import("../pages/Statistics"),
  "/mindset": () => import("../pages/Mindset"),
  "/exercises": () => import("../pages/Exercises"),
  "/settings": () => import("../pages/Settings"),
  "/workouts/create": () => import("../pages/RoutineBuilder"),
};

const apiWarmers: Record<string, () => Promise<unknown>> = {
  "/dashboard": () => import("../api/dashboard").then(({ dashboardApi }) => dashboardApi.get()),
  "/workouts": () => import("../api/routines").then(({ routinesApi }) => routinesApi.list()),
  "/history": () => import("../api/workoutSessions").then(({ workoutSessionsApi }) => workoutSessionsApi.list()),
  "/statistics": () => import("../api/statistics").then(({ statisticsApi }) => statisticsApi.get()),
};

const preloaded = new Set<string>();

export function preloadRoute(path: string) {
  const route = path.startsWith("/history/")
    ? "/history"
    : path.startsWith("/exercises/")
      ? "/exercises"
    : path.startsWith("/workout/")
      ? "/workouts"
      : path.startsWith("/program/")
        ? "/workouts"
      : path.startsWith("/workouts/")
        ? "/workouts/create"
        : path;
  const importer = importers[route];
  if (!importer || preloaded.has(route)) return;

  preloaded.add(route);
  void importer().catch(() => preloaded.delete(route));
  const warmApi = apiWarmers[route];
  if (warmApi) void warmApi().catch(() => undefined);
}
