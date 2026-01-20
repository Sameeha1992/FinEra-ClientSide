import React, { lazy, Suspense } from 'react'
import { Route,Routes } from 'react-router-dom'
import ProtectedRoutes from './protected/ProtectedRoutes'
import UnprotectedRoute from './protected/UnprotectedRoute'


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
          <Route path="/login" element={<UnprotectedRoute restrictedRole='admin'>
            <AdminLoginPage />
            </UnprotectedRoute>} />

          {/* Protected admin routes */}

          <Route
          path='/dashboard' element={<ProtectedRoutes allowedRoles={["admin"]}loginRedirect='/admin/login'>
                <AdminDashBoard />
              </ProtectedRoutes>}/>
          <Route
            path="/vendor"
            element={
              <ProtectedRoutes allowedRoles={["admin"]} loginRedirect='/admin/login'>
                <VendorManagement />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/user"
            element={
              <ProtectedRoutes allowedRoles={["admin"]} loginRedirect='/admin/login'>
                <UserManagement />
              </ProtectedRoutes>
            }
          />
        </Routes>
      </Suspense>
    </div>
  )
}

export default Admin
