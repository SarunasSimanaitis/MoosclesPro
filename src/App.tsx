import {
  lazy,
  Suspense,
  type ReactNode,
} from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ScrollToTop from "./components/layout/ScrollToTop";
import { authClient } from "./lib/auth-client";

/*
 * Route-level code splitting.
 *
 * Each page is downloaded only when its route is
 * actually rendered.
 */
const Dashboard = lazy(
  () => import("./pages/Dashboard"),
);

const ExerciseDetails = lazy(
  () =>
    import(
      "./pages/ExerciseDetails"
    ),
);

const Exercises = lazy(
  () => import("./pages/Exercises"),
);

const History = lazy(
  () => import("./pages/History"),
);

const LandingPage = lazy(
  () =>
    import("./pages/LandingPage"),
);

const Login = lazy(
  () => import("./pages/Login"),
);

const Mindset = lazy(
  () => import("./pages/Mindset"),
);

const Register = lazy(
  () => import("./pages/Register"),
);

const RoutineBuilder = lazy(
  () =>
    import("./pages/RoutineBuilder"),
);

const Session = lazy(
  () => import("./pages/Session"),
);

const Settings = lazy(
  () => import("./pages/Settings"),
);

const Statistics = lazy(
  () => import("./pages/Statistics"),
);

const WorkoutDetails = lazy(
  () =>
    import("./pages/WorkoutDetails"),
);

const WorkoutSessionPage = lazy(
  () =>
    import(
      "./pages/WorkoutSessionPage"
    ),
);

const Workouts = lazy(
  () => import("./pages/Workouts"),
);

const ProgramDetails = lazy(
  () =>
    import("./pages/ProgramDetails"),
);

function LoadingScreen() {
  return (
    <div
      className="
        flex
        min-h-[60vh]
        items-center
        justify-center
        bg-[var(--background)]
        px-5
      "
    >
      <div className="flex flex-col items-center gap-4">
        <div
          aria-hidden="true"
          className="
            h-8
            w-8
            animate-spin
            rounded-full
            border-2
            border-[var(--border-strong)]
            border-t-[var(--primary)]
          "
        />

        <p
          role="status"
          aria-live="polite"
          className="text-sm font-medium text-[var(--text-muted)]"
        >
          Loading…
        </p>
      </div>
    </div>
  );
}

function LazyPage({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Suspense fallback={<LoadingScreen />}>
      {children}
    </Suspense>
  );
}

function HomeRoute() {
  const {
    data: session,
    isPending,
  } = authClient.useSession();

  if (isPending) {
    return <LoadingScreen />;
  }

  if (session?.user) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return (
    <LazyPage>
      <LandingPage />
    </LazyPage>
  );
}

function GuestRoute({
  children,
}: {
  children: ReactNode;
}) {
  const {
    data: session,
    isPending,
  } = authClient.useSession();

  if (isPending) {
    return <LoadingScreen />;
  }

  if (session?.user) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
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
              <LazyPage>
                <Login />
              </LazyPage>
            </GuestRoute>
          }
        />

        <Route
          path="/register"
          element={
            <GuestRoute>
              <LazyPage>
                <Register />
              </LazyPage>
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
            element={
              <LazyPage>
                <Exercises />
              </LazyPage>
            }
          />

          <Route
            path="/exercises/:exerciseId"
            element={
              <LazyPage>
                <ExerciseDetails />
              </LazyPage>
            }
          />

          <Route
            path="/mindset"
            element={
              <LazyPage>
                <Mindset />
              </LazyPage>
            }
          />
        </Route>

        {/* Authenticated application */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route
              path="/dashboard"
              element={
                <LazyPage>
                  <Dashboard />
                </LazyPage>
              }
            />

            <Route
              path="/workouts"
              element={
                <LazyPage>
                  <Workouts />
                </LazyPage>
              }
            />

            <Route
              path="/program/:programId"
              element={
                <LazyPage>
                  <ProgramDetails />
                </LazyPage>
              }
            />

            <Route
              path="/workouts/create"
              element={
                <LazyPage>
                  <RoutineBuilder />
                </LazyPage>
              }
            />

            <Route
              path="/workout/:routineId"
              element={
                <LazyPage>
                  <WorkoutSessionPage />
                </LazyPage>
              }
            />

            <Route
              path="/session"
              element={
                <LazyPage>
                  <Session />
                </LazyPage>
              }
            />

            <Route
              path="/history"
              element={
                <LazyPage>
                  <History />
                </LazyPage>
              }
            />

            <Route
              path="/history/:sessionId"
              element={
                <LazyPage>
                  <WorkoutDetails />
                </LazyPage>
              }
            />

            <Route
              path="/statistics"
              element={
                <LazyPage>
                  <Statistics />
                </LazyPage>
              }
            />

            <Route
              path="/settings"
              element={
                <LazyPage>
                  <Settings />
                </LazyPage>
              }
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