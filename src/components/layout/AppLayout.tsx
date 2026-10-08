import { Outlet } from "react-router-dom";

import Navbar from "../navigation/Navbar";
import MobileTabBar from "../navigation/MobileTabBar";
import ActiveWorkoutBar from "../workout/ActiveWorkoutBar";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)]">
      <Navbar />

      <main className="mx-auto max-w-[1900px] px-4 py-5 pb-24 sm:px-5 sm:py-8 sm:pb-28 md:pb-8 lg:px-10 lg:py-10">
        <Outlet />
      </main>

      <ActiveWorkoutBar />
      <MobileTabBar />
    </div>
  );
}