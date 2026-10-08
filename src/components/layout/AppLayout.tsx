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

      <main className="min-w-0 px-4 py-5 pb-28 sm:px-6 sm:py-8 xl:pl-[16.5rem]">
        <div className="mx-auto w-full max-w-[76rem]">
          <Outlet />
        </div>
      </main>

      <ActiveWorkoutBar />
      <MobileTabBar />
    </div>
  );
}
