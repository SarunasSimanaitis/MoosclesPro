import { lazy, Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

import { authClient } from "../../lib/auth-client";
import Navbar from "../navigation/Navbar";
import PageLoader from "../ui/PageLoader";
import { useActiveWorkoutStore } from "../../stores/activeWorkoutStore";

/* Loaded only while a workout is running, so the exercise library stays out of the first download. */
const ActiveWorkoutBar = lazy(() => import("../workout/ActiveWorkoutBar"));

/**
 * One shell for every page that has navigation. Public and signed-in pages
 * share it, so moving between them never remounts the navigation.
 */
export default function AppLayout() {
  const location = useLocation();
  const { data: session, isPending } = authClient.useSession();
  const loggedIn = Boolean(session?.user);
  const name = session?.user?.name?.trim() || "Account";
  const hasActiveWorkout = useActiveWorkoutStore((state) => state.activeWorkout !== null);

  /*
   * Fixed elements (rest timer, dialogs) are portalled to <body>, so the
   * bottom tab bar offset is exposed on <html> where they can all read it.
   */
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("has-bottom-nav", loggedIn);
    return () => root.classList.remove("has-bottom-nav");
  }, [loggedIn]);

  return (
    <div className="app-shell text-[var(--text)]">
      {!isPending && <Navbar loggedIn={loggedIn} name={name} />}

      <main className={loggedIn ? "app-content min-w-0 md:ml-[72px] xl:ml-[244px]" : "app-content min-w-0"}>
        <div className={loggedIn ? "mx-auto w-full max-w-[var(--content-width)]" : "mx-auto w-full max-w-[1100px]"}>
          <div key={location.pathname} className="page-transition">
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </div>
        </div>
      </main>

      {loggedIn && hasActiveWorkout && (
        <Suspense fallback={null}>
          <ActiveWorkoutBar />
        </Suspense>
      )}
    </div>
  );
}
