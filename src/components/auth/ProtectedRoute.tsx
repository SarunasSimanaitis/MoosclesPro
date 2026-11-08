import { Navigate, Outlet, useLocation } from "react-router-dom";

import { authClient } from "../../lib/auth-client";
import PageLoader from "../ui/PageLoader";

export default function ProtectedRoute() {
  const location = useLocation();
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <PageLoader />;
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
