import { apiRequest } from "./client";

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
    return apiRequest<DashboardData>(
      "/api/dashboard",
    );
  },
};