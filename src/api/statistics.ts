import { apiRequest } from "./client";
import { cachedRequest, invalidateCached, readCached } from "./cache";

export type StatisticsOverview = {
  workouts: number;
  volume: number;
  trainingHours: number;
  streak: number;
};

export type WeeklyActivity = {
  label: string;
  start: string;
  workouts: number;
};

export type ExerciseStatistic = {
  exerciseId: string;
  name: string;
  workouts: number;
  sets: number;
  volume: number;
};

export type StatisticsData = {
  overview: StatisticsOverview;
  weeklyActivity: WeeklyActivity[];
  topExercises: ExerciseStatistic[];
  topVolumeExercises: ExerciseStatistic[];
};

export const statisticsApi = {
  get(): Promise<StatisticsData> {
    return cachedRequest("statistics:get", () => apiRequest<StatisticsData>("/api/statistics"));
  },
  cached(): StatisticsData | undefined {
    return readCached<StatisticsData>("statistics:get");
  },
  clearCache() {
    invalidateCached("statistics:get");
  },
};
