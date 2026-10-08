import { Outlet } from "react-router-dom";

import DesktopSidebar from "../navigation/DesktopSidebar";
import Navbar from "../navigation/Navbar";
import MobileTabBar from "../navigation/MobileTabBar";
import ActiveWorkoutBar from "../workout/ActiveWorkoutBar";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)]">
      <Navbar />
      <DesktopSidebar />

      <main className="min-w-0 px-4 py-5 pb-28 sm:px-5 sm:py-8 lg:pl-72 lg:pr-8 lg:py-8">
        <Outlet />
      </main>

      <ActiveWorkoutBar />
      <MobileTabBar />
    </div>
  );
}