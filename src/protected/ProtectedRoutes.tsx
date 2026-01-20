import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: ("admin" | "user" | "vendor")[];
  loginRedirect?: string;
}

const ProtectedRoute = ({
  children,
  allowedRoles,
  loginRedirect = "/login",
}: ProtectedRouteProps) => {
  const auth = useSelector((state: RootState) => state.auth);

  // Not logged in
  if (!auth.isAuthenticated || !auth.role) {
    return <Navigate to={loginRedirect} replace />;
  }

  // Role not allowed
  if (!allowedRoles.includes(auth.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Allowed
  return <>{children}</>;
};

export default ProtectedRoute;
