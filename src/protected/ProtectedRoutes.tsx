import type { RootState } from "@/redux/store"
import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"


//User
export const ClientProtectRoute = ()=>{
 const {isAuthenticated,role} = useSelector((state:RootState)=>state.auth);

 if(!isAuthenticated || role !== "user"){
  return <Navigate to="/user/login" replace/>
 }

 return <Outlet/>
}

//Vendor
export const VendorProtectRoute = ()=>{
    const {isAuthenticated,role} = useSelector((state:RootState)=>state.auth);

    if(!isAuthenticated || role !== "vendor"){
        return <Navigate to="/vendor/login" replace/>
    }
    return <Outlet/>
}

//Admin

export const AdminProtectRoute = ()=>{
    const {isAuthenticated,role} = useSelector((state:RootState)=>state.auth)
        if(!isAuthenticated || role !== "admin"){
            return <Navigate to="/admin/login" replace/>
        }
        return <Outlet/>
    }
