import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { authService } from "@/api/AuthServiceAndProfile";
import { handleApiError } from "@/utils/apiError";
import React from 'react';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAuth } from "@/redux/slice/auth.slice";
import { setAccessToken } from "@/redux/slice/tokenSlice";
import toast from "react-hot-toast";

interface Props {
    role: "user" | "vendor"
}


const GoogleSignupButton: React.FC<Props> = ({ role }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate()

    const handleSuccess = async (response: CredentialResponse) => {
        const token = response.credential;

        if (!token) {
            console.error("Google Sign-in: No credential received");
            toast.error("Google login failed: No credential received");
            return;
        }

        try {
            const res = role === "user" 
                ? await authService.usergoogleLogin(token) 
                : await authService.vendorGoogleLogin(token);

            if (res.data.success) {
                // Synchronization: Store the access token in Redux
                dispatch(setAccessToken(res.data.accessToken));

                if (role === "user") {
                    const userData = res.data.user;
                    dispatch(setAuth({
                        ...userData,
                        isAuthenticated: true
                    }));
                    navigate("/user/home");
                    toast.success("Welcome! Login successful");
                } else if (role === "vendor") {
                    const vendorData = res.data.vendor;
                    dispatch(setAuth({
                        ...vendorData,
                        isAuthenticated: true
                    }));
                    navigate("/vendor/vendor-dashboard");
                    toast.success("Vendor login successful");
                }
            } else {
                toast.error(res.data.message || "Google signup failed");
            }

        } catch (error: unknown) {
            const message = handleApiError(error, "Google authentication failed");
            console.error("Google signup error:", message);
            toast.error(message);
        }
    }
    return (
        <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => {
                console.error("Google Sign-In Failed");
                toast.error("Google Sign-In Failed");
            }}
        />
    )
}

export default GoogleSignupButton

