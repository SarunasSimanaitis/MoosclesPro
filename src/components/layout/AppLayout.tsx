import { Outlet } from "react-router-dom";

import Navbar from "../navigation/Navbar";

export default function AppLayout() {
  return (
    <div className="app-shell min-h-screen text-[var(--text)]">
      <Navbar />

      <main className="app-content min-w-0 px-4 py-6 sm:px-7 sm:py-9 lg:px-10 lg:py-10 2xl:px-14">
        <div className="mx-auto w-full max-w-[1720px]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
