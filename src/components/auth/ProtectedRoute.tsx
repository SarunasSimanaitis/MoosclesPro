import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import { authClient } from "../../lib/auth-client";

export default function ProtectedRoute() {
  const location =
    useLocation();

  const {
    data: session,
    isPending,
  } = authClient.useSession();

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <div
          role="status"
          aria-live="polite"
          className="text-sm font-medium text-[var(--text-muted)]"
        >
          Loading...
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: `${location.pathname}${location.search}${location.hash}`,
        }}
      />
    );
  }

  return <Outlet />;
}