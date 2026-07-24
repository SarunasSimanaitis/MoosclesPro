import { Outlet } from "react-router-dom";
import Sidebar from "../navigation/Sidebar";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-zinc-950">

      <div className="mx-auto flex max-w-[1900px]">

        <Sidebar />

        <main className="flex-1 px-10 py-8">

          <Outlet />

        </main>

      </div>

    </div>
  );
}