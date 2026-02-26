import './index.css'
import { Route, Routes } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { VendorProtectRoute } from './protected/ProtectedRoutes'
import { VendorUnProtectRoute } from './protected/UnprotectedRoute.tsx'
import LoanAddForm from './pages/vendor/dashboard/loanProduct/Loan/LoanAddForm.tsx'
import EditVendorProfileForm from './pages/vendor/dashboard/profile/EditVendorProfileForm.tsx'
import LoanDetailPage from './pages/vendor/dashboard/loanProduct/Loan/LoanDetailPage.tsx'

const RegisterPage = lazy(() => import('./pages/vendor/vendorRegister.tsx'))
const OtpVerification = lazy(() => import('./pages/user/auth/OtpVerification.tsx'))
const VendorLoginPage = lazy(() => import('./pages/vendor/vendorLogin.tsx'))
const ForgetVendorPassword = lazy(() => import('./pages/vendor/ForgetVendorPassword.tsx'))
const ForgetVendorOtpVerify = lazy(() => import('./pages/vendor/ForgetOtpVendorVerify.tsx'))
const VendorResetPassword = lazy(() => import('./pages/vendor/VendorResetPassword.tsx'))
const VendorDashboard = lazy(() => import("@/pages/vendor/dashboard/DashboardPage.tsx"))
const VendorProfile = lazy(() => import("./pages/vendor/dashboard/profile/ProfilePage.tsx"))
const VendorProfileFormPage = lazy(() => import("./pages/vendor/dashboard/profile/VendorCompleteProfileForm.tsx"))
const VendorCompleteProfilePage = lazy(() => import("./pages/vendor/dashboard/profile/VendorCompleteProfilePage.tsx"))
const VendorChangePassword = lazy(() => import("./pages/vendor/VendorChnagePassword.tsx"))
const LoanListing = lazy(() => import("./pages/vendor/dashboard/loanProduct/Loan/LoanListing.tsx"))
const AddLoanForm = lazy(() => import('./components/loanProduct/AddLoanForm.tsx'))
const LoanEditForm = lazy(() => import("./pages/vendor/dashboard/loanProduct/Loan/LoanEditForm.tsx"))
function Vendor() {
  return (
    <Suspense fallback={<div className="text-center mt-20">Loading...</div>}>
      <Routes>

        {/* 🔓 UNPROTECTED ROUTES */}
        <Route element={<VendorUnProtectRoute />}>
          <Route path="/vendor-register" element={<RegisterPage />} />
          <Route path="/login" element={<VendorLoginPage />} />
          <Route path="/verify-otp" element={<OtpVerification />} />
          <Route path="/forget-password" element={<ForgetVendorPassword />} />
          <Route path="/verify-forget-otp" element={<ForgetVendorOtpVerify />} />
          <Route path="/reset-password" element={<VendorResetPassword />} />
        </Route>

        {/* 🔐 PROTECTED ROUTES */}
        <Route element={<VendorProtectRoute />}>
          <Route path="/vendor-dashboard" element={<VendorDashboard />} />
          <Route path="/vendor-profile" element={<VendorProfile />} />
          <Route path="/vendor-complete-form" element={<VendorProfileFormPage />} />
          <Route path="/vendor-complete-profile" element={<VendorCompleteProfilePage />} />
          <Route path='/vendor-change-password' element={<VendorChangePassword />} />
          <Route path='/edit-profile' element={<EditVendorProfileForm />} />

          <Route path='/add-loan' element={<LoanAddForm />} />
          <Route path='/loans' element={<LoanListing />} />
          <Route path='/edit-loans/:loanId' element={<LoanEditForm />} />
          <Route path='/loan-detail/:loanId' element={<LoanDetailPage />} />




        </Route>

      </Routes>
    </Suspense>
  )
}

export default Vendor
