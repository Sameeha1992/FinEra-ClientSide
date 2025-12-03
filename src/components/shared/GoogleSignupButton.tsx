import {GoogleLogin} from "@react-oauth/google";
import { authService } from "@/api/AuthServiceAndProfile";
import React from 'react'

interface Props{
    role:"user"|"vendor"
}


const GoogleSignupButton:React.FC<Props> =({role}) => {

    const handleSuccess = async(response:any)=>{
        const idToken = response.credential;

        try {

            const res = role ==="user"? await authService.usergoogleLogin(idToken):await authService.vendorGoogleLogin(idToken);

            console.log("Signup successfull:",res.data)
            
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
