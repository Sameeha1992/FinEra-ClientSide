import {GoogleLogin} from "@react-oauth/google";
import { authService } from "@/api/AuthServiceAndProfile";
import React from 'react'
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAuth } from "@/redux/slice/auth.slice";

interface Props{
    role:"user"|"vendor"
}


const GoogleSignupButton:React.FC<Props> =({role}) => {

    const dispatch = useDispatch();
    const navigate = useNavigate()

    const handleSuccess = async(response:any)=>{
        const token = response.credential;

        try {

            const res = role ==="user"? await authService.usergoogleLogin(token):await authService.vendorGoogleLogin(token);

            console.log("Signup successfull:",res.data)

            if(role === "user"){
             dispatch(setAuth(res.data.user));
             navigate("/user/home")
            } else if(role === "vendor") {
                dispatch(setAuth(res.data.vendor));
                navigate("/vendor/vendor-dashboard")
            }
            
        } catch (error:any) {
            console.error("Google signup failed:",error.response?.data || error.message)
        }
    }
  return (
    
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={()=>console.log("Google Sign-Up Failed")}/>
  )
}

export default GoogleSignupButton
