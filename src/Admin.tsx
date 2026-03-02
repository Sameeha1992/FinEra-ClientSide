import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { AdminProtectRoute } from "./protected/ProtectedRoutes";
import { AdminUnprotectRoute } from "./protected/UnprotectedRoute";
import VendorDetailsVerification from "./pages/admin/VendorDetailsVerification";

const AdminLoginPage = lazy(() => import("./pages/admin/LoginPage"));
const VendorManagement = lazy(() => import("./pages/admin/VendorMgtList"));
const UserManagement = lazy(() => import("./pages/admin/UserMgtList"));
const AdminDashBoard = lazy(() => import("./pages/admin/Dashboard"));
const VendorVerificationList = lazy(() => import("./pages/admin/VendorVerificationList"));

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
          <Route path="/vendor-verification" element={<VendorVerificationList />} />
          <Route path="/vendor-verification/:vendorId" element={<VendorDetailsVerification />} />

        </Route>

      </Routes>
    </Suspense>
  );
};

export default Admin;
