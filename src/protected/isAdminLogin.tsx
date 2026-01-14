import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

interface Props {
  children: ReactNode;
}

const AdminProtectedRoute = ({ children }: Props) => {
  // Get auth from redux store
  const auth = useSelector((state: RootState) => state.auth);

  // Not logged in
  if (!auth.isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // Not admin
  if (auth.role !== "admin") {
    return <Navigate to="/unauthorized" replace />;
  }

  // Allowed
  return <>{children}</>;
};

export default AdminProtectedRoute;
