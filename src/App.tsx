import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import Exercises from "./pages/Exercises";
import ExerciseDetails from "./pages/ExerciseDetails";
import History from "./pages/History";
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public authentication pages */}
        <Route path="/login" element={<Login />} />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* Protected application */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />

            <Route
              path="/workout/:routineId"
              element={<WorkoutSessionPage />}
            />

            <Route
              path="/workouts"
              element={<Workouts />}
            />

            <Route
              path="/workouts/create"
              element={<RoutineBuilder />}
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

            <Route
              path="/settings"
              element={<Settings />}
            />
          </Route>
        </Route>

        {/* Unknown route */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}