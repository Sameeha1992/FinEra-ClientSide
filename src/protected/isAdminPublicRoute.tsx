import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

interface Props {
  children: ReactNode;
}

const AdminPublicRoute = ({ children }: Props) => {
  // Get auth from redux store
  const auth = useSelector((state: RootState) => state.auth);

  // If already logged in as admin, redirect to dashboard
  if (auth.isAuthenticated && auth.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Otherwise, allow access
  return <>{children}</>;
};

export default AdminPublicRoute;
