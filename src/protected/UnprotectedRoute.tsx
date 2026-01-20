import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

type Role = "admin" | "user" | "vendor";

interface UnprotectedRouteProps {
  children: ReactNode;
  restrictedRole: Role; // 👈 important
}

const UnprotectedRoute = ({ children, restrictedRole }: UnprotectedRouteProps) => {
  const auth = useSelector((state: RootState) => state.auth);

  // 🔓 Not logged in → allow access
  if (!auth.isAuthenticated || !auth.role) {
    return <>{children}</>;
  }

  // 🔓 Logged in BUT different role → allow access
  if (auth.role !== restrictedRole) {
    return <>{children}</>;
  }

  // 🔁 Logged in AND same role → redirect
  const redirectMap: Record<Role, string> = {
    admin: "/admin/dashboard",
    user: "/user/profile",
    vendor: "/vendor/dashboard",
  };

  return <Navigate to={redirectMap[auth.role]} replace />;
};

export default UnprotectedRoute;
