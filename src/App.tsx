import { BrowserRouter, Route, Routes } from "react-router-dom";

import AppLayout from "./components/layout/AppLayout";

import Dashboard from "./pages/Dashboard";
import Exercises from "./pages/Exercises";
import History from "./pages/History";
import Mindset from "./pages/Mindset";
import Session from "./pages/Session";
import Settings from "./pages/Settings";
import Statistics from "./pages/Statistics";
import Workouts from "./pages/Workouts";
import WorkoutSessionPage from "./pages/WorkoutSessionPage";
import ExerciseDetails from "./pages/ExerciseDetails";
import RoutineBuilder from "./pages/RoutineBuilder";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Main application */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />

          <Route
            path="/workout/:routineId"
            element={<WorkoutSessionPage />}
          />

          <Route path="/workouts" element={<Workouts />} />

          <Route
            path="/workouts/create"
            element={<RoutineBuilder />}
          />

          <Route path="/session" element={<Session />} />
          <Route path="/history" element={<History />} />
          <Route path="/statistics" element={<Statistics />} />

          <Route
            path="/exercises"
            element={<Exercises />}
          />

          <Route
            path="/exercises/:exerciseId"
            element={<ExerciseDetails />}
          />

          <Route path="/mindset" element={<Mindset />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}