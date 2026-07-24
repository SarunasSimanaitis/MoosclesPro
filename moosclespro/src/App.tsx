import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import AppLayout from "./components/layout/AppLayout";

import Dashboard from "./pages/Dashboard";
import Workouts from "./pages/Workouts";
import Session from "./pages/Session";
import History from "./pages/History";
import Statistics from "./pages/Statistics";
import Exercises from "./pages/Exercises";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route
            path="/"
            element={<Dashboard />}
          />

          <Route
            path="/workouts"
            element={<Workouts />}
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
            path="/statistics"
            element={<Statistics />}
          />

          <Route
            path="/exercises"
            element={<Exercises />}
          />

          <Route
            path="/settings"
            element={<Settings />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}