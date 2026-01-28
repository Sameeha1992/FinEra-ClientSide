import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { AdminProtectRoute } from "./protected/ProtectedRoutes";
import { AdminUnprotectRoute } from "./protected/UnprotectedRoute";

const AdminLoginPage = lazy(() => import("./pages/admin/LoginPage"));
const VendorManagement = lazy(() => import("./pages/admin/VendorMgtList"));
const UserManagement = lazy(() => import("./pages/admin/UserMgtList"));
const AdminDashBoard = lazy(() => import("./pages/admin/Dashboard"));

const Admin = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>

        {/* 🔓 UNPROTECTED (Login) */}
        <Route element={<AdminUnprotectRoute />}>
          <Route path="/login" element={<AdminLoginPage />} />
        </Route>

        {/* 🔐 PROTECTED ADMIN ROUTES */}
        <Route element={<AdminProtectRoute />}>
          <Route path="/dashboard" element={<AdminDashBoard />} />
          <Route path="/vendor" element={<VendorManagement />} />
          <Route path="/user" element={<UserManagement />} />
        </Route>

      </Routes>
    </Suspense>
  );
};

export default Admin;
