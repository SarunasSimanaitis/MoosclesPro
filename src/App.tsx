import { lazy, Suspense, type ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./components/auth/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";
import PageLoader from "./components/ui/PageLoader";
import ScrollToTop from "./components/layout/ScrollToTop";
import { authClient } from "./lib/auth-client";

/*
 * Route-level code splitting: each page is downloaded only when its route
 * is rendered (or when its navigation link is hovered, see routePreload).
 */
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ExerciseDetails = lazy(() => import("./pages/ExerciseDetails"));
const Exercises = lazy(() => import("./pages/Exercises"));
const History = lazy(() => import("./pages/History"));
const LandingPage = lazy(() => import("./pages/LandingPage"));
const Login = lazy(() => import("./pages/Login"));
const Mindset = lazy(() => import("./pages/Mindset"));
const ProgramDetails = lazy(() => import("./pages/ProgramDetails"));
const Register = lazy(() => import("./pages/Register"));
const RoutineBuilder = lazy(() => import("./pages/RoutineBuilder"));
const Session = lazy(() => import("./pages/Session"));
const Settings = lazy(() => import("./pages/Settings"));
const Statistics = lazy(() => import("./pages/Statistics"));
const WorkoutDetails = lazy(() => import("./pages/WorkoutDetails"));
const WorkoutSessionPage = lazy(() => import("./pages/WorkoutSessionPage"));
const Workouts = lazy(() => import("./pages/Workouts"));

/** Signed-in visitors skip the landing page and go straight to their dashboard. */
function HomeRoute() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) return <PageLoader />;
  if (session?.user) return <Navigate to="/dashboard" replace />;

  return <LandingPage />;
}

/** Login and register are only for signed-out visitors. */
function GuestRoute({ children }: { children: ReactNode }) {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) return <PageLoader />;
  if (session?.user) return <Navigate to="/dashboard" replace />;

  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        {/* Authentication (full-screen, no navigation) */}
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

        <Route element={<AppLayout />}>
          {/* Public pages */}
          <Route path="/" element={<HomeRoute />} />
          <Route path="/exercises" element={<Exercises />} />
          <Route path="/exercises/:exerciseId" element={<ExerciseDetails />} />
          <Route path="/mindset" element={<Mindset />} />

          {/* Signed-in pages */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route path="/workouts/create" element={<RoutineBuilder />} />
            <Route path="/program/:programId" element={<ProgramDetails />} />
            <Route path="/workout/:routineId" element={<WorkoutSessionPage />} />
            <Route path="/session" element={<Session />} />
            <Route path="/history" element={<History />} />
            <Route path="/history/:sessionId" element={<WorkoutDetails />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
