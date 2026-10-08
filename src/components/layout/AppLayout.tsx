import { Outlet } from "react-router-dom";

import Navbar from "../navigation/Navbar";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)]">
      <Navbar />

      <main className="min-w-0 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
