import React, { lazy } from 'react'
import { Route,Routes } from 'react-router-dom'


const AdminLoginPage = lazy(()=>import('./pages/admin/LoginPage'))
const VendorManagement = lazy(()=>import('./pages/admin/VendorMgtList'))
const UserManagement = lazy(()=>import('./pages/admin/UserMgtList'))
const Admin = () => {
  return (
    <div>
      
      <>
      <Routes>
        <Route path='/login' element={<AdminLoginPage/>}/>
        <Route path='/vendor' element={<VendorManagement/>}></Route>
        <Route path="/user" element={<UserManagement/>}></Route>
      </Routes>
      
      </>
    </div>
  )
}

export default Admin
