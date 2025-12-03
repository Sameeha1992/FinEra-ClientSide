import React, { lazy } from 'react'
import { Route,Routes } from 'react-router-dom'


const AdminLoginPage = lazy(()=>import('./pages/admin/LoginPage'))
const Admin = () => {
  return (
    <div>
      
      <>
      <Routes>
        <Route path='/login' element={<AdminLoginPage/>}/>
      </Routes>
      
      </>
    </div>
  )
}

export default Admin
