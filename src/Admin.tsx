import React from 'react'
import { Route,Routes } from 'react-router-dom'
import AdminLoginPage from './pages/admin/LoginPage'

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
