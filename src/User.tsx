import UserLogin from './pages/user/auth/UserLogin.tsx'
import './index.css'
import {Route, Routes } from 'react-router-dom'
import SignUpPage from './pages/user/auth/Signup.tsx'
import OtpVerification from './pages/user/auth/otpVerification.tsx'


function User() {  

  return (
    <>
    <Routes>
      <Route path="/login" element={<UserLogin/>}/>
      <Route path='/signup' element={<SignUpPage/>}/>
      <Route path="/verify-otp" element={<OtpVerification/>}/>
    </Routes>
    </>
  )
}

export default User
