import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import type { ReactNode } from "react";

import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ScrollToTop from "./components/layout/ScrollToTop";

import { authClient } from "./lib/auth-client";

import Dashboard from "./pages/Dashboard";
import ExerciseDetails from "./pages/ExerciseDetails";
import Exercises from "./pages/Exercises";
import History from "./pages/History";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Mindset from "./pages/Mindset";
import Register from "./pages/Register";
import RoutineBuilder from "./pages/RoutineBuilder";
import Session from "./pages/Session";
import Settings from "./pages/Settings";
import Statistics from "./pages/Statistics";
import WorkoutDetails from "./pages/WorkoutDetails";
import WorkoutSessionPage from "./pages/WorkoutSessionPage";
import Workouts from "./pages/Workouts";
import ProgramDetails from "./pages/ProgramDetails";

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
      <div className="text-sm font-medium text-[var(--text-muted)]">
        Loading...
      </div>
    </div>
  );
}

function HomeRoute() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <LoadingScreen />;
  }

  if (session?.user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <LandingPage />;
}

function GuestRoute({
  children,
}: {
  children: ReactNode;
}) {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <LoadingScreen />;
  }

  if (session?.user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        {/* Public authentication */}

        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />

        <Route
          path="/register"
          element={
            <GuestRoute>
              <Register />
            </GuestRoute>
          }
        />

        {/* Public product pages */}

        <Route element={<AppLayout />}>
          <Route
            path="/"
            element={<HomeRoute />}
          />

          <Route
            path="/exercises"
            element={<Exercises />}
          />

          <Route
            path="/exercises/:exerciseId"
            element={<ExerciseDetails />}
          />

          <Route
            path="/mindset"
            element={<Mindset />}
          />
        </Route>

        {/* Authenticated application */}

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/workouts"
              element={<Workouts />}
            />

            <Route
              path="/program/:programId"
              element={<ProgramDetails />}
            />

            <Route
              path="/workouts/create"
              element={<RoutineBuilder />}
            />

            <Route
              path="/workout/:routineId"
              element={<WorkoutSessionPage />}
            />

            <Route
              path="/session"
              element={<Session />}
            />

            <Route
              path="/history"
              element={<History />}
            />

            <Route
              path="/history/:sessionId"
              element={<WorkoutDetails />}
            />

            <Route
              path="/statistics"
              element={<Statistics />}
            />

            <Route
              path="/settings"
              element={<Settings />}
            />
          </Route>
        </Route>

        {/* Unknown routes */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}