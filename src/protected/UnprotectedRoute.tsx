// AdminUnprotectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

export const AdminUnprotectRoute = () => {
  const { isAuthenticated, role } = useSelector((state: RootState) => state.auth);

  if (isAuthenticated && role === "admin") return <Navigate to="/admin/dashboard" replace />;

  return <Outlet />;
};


//User:-

export const UserUnProtectRoute = () => {
  const { isAuthenticated, role } = useSelector((state: RootState) => state.auth);

  if (isAuthenticated && role === "user") return <Navigate to="/user/home" replace />;

  return <Outlet />;
};


//Vendor:


export const VendorUnProtectRoute = () => {
  const { isAuthenticated, role } = useSelector((state: RootState) => state.auth);

  if (isAuthenticated && role === "vendor") return <Navigate to="/vendor/dashboard" replace />;

  return <Outlet />;
};

