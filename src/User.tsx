import './index.css'
import {Route, Routes } from 'react-router-dom'
import { lazy, Suspense } from 'react'


const UserLogin = lazy(()=>import('./pages/user/auth/UserLogin.tsx'))
const SignUpPage = lazy(()=>import('./pages/user/auth/Signup.tsx'))
const OtpVerification=lazy(()=>import('./pages/user/auth/OtpVerification.tsx'))
const UserForgetPassword=lazy(()=>import("./pages/user/auth/UserForgetPassword.tsx"))
const ForgetOtpVerify = lazy(()=>import('./pages/user/auth/ForgetOtpVerify.tsx'))
const UserResetPassword = lazy(()=>import("./pages/user/auth/UserResetPassword.tsx"))
const LandingPage = lazy(()=>import("./pages/user/LadingPage.tsx"))
function User() {  

  return (
    <>
    <Suspense fallback={<div className='text-center mt-20'>Loading...</div>}>
    <Routes>
      <Route path="/home" element={<LandingPage/>}/>
      <Route path="/login" element={<UserLogin/>}/>
      <Route path='/signup' element={<SignUpPage/>}/>
      <Route path="/verify-otp" element={<OtpVerification/>}/>
      <Route path="/forget-password" element={<UserForgetPassword/>}/>
      <Route path='/verify-forget-otp' element={<ForgetOtpVerify/>}/>
      <Route path='/reset-password' element={<UserResetPassword/>}/>
     
    </Routes>
    </Suspense>
    </>
  )
}

export default User
