import React, { lazy, Suspense } from 'react'
import { Route,Routes } from 'react-router-dom'
import AdminProtectedRoute from './protected/isAdminLogin'
import AdminPublicRoute from './protected/isAdminPublicRoute'


const AdminLoginPage = lazy(()=>import('./pages/admin/LoginPage'))
const VendorManagement = lazy(()=>import('./pages/admin/VendorMgtList'))
const UserManagement = lazy(()=>import('./pages/admin/UserMgtList'))
const AdminDashBoard = lazy(()=>import('./pages/admin/Dashboard'))
const Admin = () => {
  return (
    <div>
      
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Public admin login route */}
          <Route path="/login" element={<AdminPublicRoute>
            <AdminLoginPage />
            </AdminPublicRoute>} />

          {/* Protected admin routes */}

          <Route
          path='/dashboard' element={<AdminProtectedRoute>
                <AdminDashBoard />
              </AdminProtectedRoute>}/>
          <Route
            path="/vendor"
            element={
              <AdminProtectedRoute>
                <VendorManagement />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/user"
            element={
              <AdminProtectedRoute>
                <UserManagement />
              </AdminProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </div>
  )
}

export default Admin
