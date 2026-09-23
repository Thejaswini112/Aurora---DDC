import {
  Navigate,
  useLocation,
} from "react-router-dom";

import { useAuth } from "@/contexts/AuthContext";
import type { ReactNode } from "react";

export function ProtectedRoute({
  children,
}: {
  children: ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{
          from: {
            pathname: location.pathname,
            search: location.search,
            hash: location.hash,
          },
        }}
        replace
      />
    );
  }

  return <>{children}</>;
}

export function PublicRoute({
  children,
}: {
  children: ReactNode;
}) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/overview" replace />;
  }

  return <>{children}</>;
}