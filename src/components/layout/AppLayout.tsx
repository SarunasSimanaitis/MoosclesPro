import { Outlet } from "react-router-dom";

import Navbar from "../navigation/Navbar";
import ActiveWorkoutBar from "../workout/ActiveWorkoutBar";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)]">
      <Navbar />

      <main className="mx-auto max-w-[1900px] px-5 py-8 lg:px-10 lg:py-10">
        <Outlet />
      </main>

      <ActiveWorkoutBar />
    </div>
  );
}