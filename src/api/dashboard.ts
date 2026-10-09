import { apiRequest } from "./client";
import { cachedRequest, invalidateCached, readCached } from "./cache";

export type DashboardStats = {
  streak: number;
  workouts: number;
  volume: number;
  hours: number;
};

export type DashboardTodayWorkout = {
  routineId: string;
  title: string;
  duration: string;
  exercises: number;
};

export type DashboardWeeklyGoal = {
  completed: number;
  target: number;
};

export type DashboardData = {
  stats: DashboardStats;
  weeklyGoal: DashboardWeeklyGoal;
  todayWorkout: DashboardTodayWorkout | null;
};

export const dashboardApi = {
  get(): Promise<DashboardData> {
    return cachedRequest("dashboard:get", () => apiRequest<DashboardData>("/api/dashboard"));
  },
  cached(): DashboardData | undefined {
    return readCached<DashboardData>("dashboard:get");
  },
  clearCache() {
    invalidateCached("dashboard:get");
  },
};
