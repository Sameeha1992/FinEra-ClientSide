import './index.css'
import {Route, Routes } from 'react-router-dom'
import { lazy } from 'react'

const RegisterPage = lazy(()=>import('./pages/vendor/vendorRegister.tsx'))
const OtpVerification = lazy(()=>import('./pages/user/auth/OtpVerification.tsx'))
const VendorLoginPage = lazy(()=>import('./pages/vendor/vendorLogin.tsx'))
const VendorHome = lazy(()=>import('./pages/vendor/vendor.home.tsx'))
const ForgetVendorPassword = lazy(()=>import("./pages/vendor/ForgetVendorPassword.tsx"))
const ForgetVendorOtpVerify = lazy(()=>import("./pages/vendor/ForgetOtpVendorVerify.tsx"))
const VendorResetPassword = lazy(()=>import("./pages/vendor/VendorResetPassword.tsx"))
function Vendor() {  

  return (
    <>
    <Routes>
      <Route  path='/vendor-register' element={<RegisterPage/>}/>
      <Route path="/verify-otp" element={<OtpVerification/>}/>
      <Route path="/login" element={<VendorLoginPage/>}/>
      <Route path="/dashboard" element={<VendorHome/>}/>
      <Route path='/forget-password' element={<ForgetVendorPassword/>}/>
      <Route path="/verify-forget-otp" element={<ForgetVendorOtpVerify/>}/>
      <Route path="/reset-password" element={<VendorResetPassword/>}/>

    </Routes>
    </>
  )
}

export default Vendor
