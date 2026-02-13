import "./index.css";
import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ClientProtectRoute } from "./protected/ProtectedRoutes";
import { UserUnProtectRoute } from "./protected/UnprotectedRoute";
import ProfilePage from "./pages/user/userProfile/ProfilePage";

const UserLogin = lazy(() => import("./pages/user/auth/UserLogin"));
const SignUpPage = lazy(() => import("./pages/user/auth/Signup"));
const OtpVerification = lazy(() => import("./pages/user/auth/OtpVerification"));
const UserForgetPassword = lazy(() => import("./pages/user/auth/UserForgetPassword"));
const ForgetOtpVerify = lazy(() => import("./pages/user/auth/ForgetOtpVerify"));
const UserResetPassword = lazy(() => import("./pages/user/auth/UserResetPassword"));
const LandingPage = lazy(() => import("./pages/user/LadingPage"));
const UserProfile = lazy(() => import("./pages/user/userProfile/UserProfile"));
const ProfileCompleteionForm = lazy(() => import("./components/user/userDashboard/ProfileCompletionForm"))
const CompleteProfile = lazy(() => import("@/pages/user/userProfile/CompleteProfilePage"))
function User() {
  return (
    <Suspense fallback={<div className="text-center mt-20">Loading...</div>}>
      <Routes>

        {/* 🌍 Public page */}
        <Route path="home" element={<LandingPage />} />

        {/* 🔓 UNPROTECTED USER ROUTES */}
        <Route element={<UserUnProtectRoute />}>
          <Route path="login" element={<UserLogin />} />
          <Route path="signup" element={<SignUpPage />} />
          <Route path="verify-otp" element={<OtpVerification />} />
          <Route path="forget-password" element={<UserForgetPassword />} />
          <Route path="verify-forget-otp" element={<ForgetOtpVerify />} />
          <Route path="reset-password" element={<UserResetPassword />} />
        </Route>

        {/* 🔐 PROTECTED USER ROUTES */}
        <Route element={<ClientProtectRoute />}>
          <Route element={<UserProfile />}>
            <Route path="user-profile" element={<ProfilePage />} />
            <Route path="user-complete-form" element={<ProfileCompleteionForm />} />
            <Route path="user-complete-profile" element={<CompleteProfile />} />
          </Route>
        </Route>

      </Routes>
    </Suspense>
  );
}

export default User;
