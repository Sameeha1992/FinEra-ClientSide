import './index.css'
import {Route, Routes } from 'react-router-dom'

import RegisterPage from './pages/vendor/vendorRegister.tsx'
import OtpVerification from './pages/user/auth/otpVerification.tsx'
import VendorLoginPage from './pages/vendor/vendorLogin.tsx'


function Vendor() {  

  return (
    <>
    <Routes>
      <Route  path='/vendor-register' element={<RegisterPage/>}/>
      <Route path="/verify-otp" element={<OtpVerification/>}/>
      <Route path="/vendor-login" element={<VendorLoginPage/>}/>
      
    </Routes>
    </>
  )
}

export default Vendor
