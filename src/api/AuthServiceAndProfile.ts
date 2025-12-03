import ResetPassword from "@/components/shared/ResetPassword";
import adminAxiosInstance from "@/config/adminAxiosInterceptor";
import userAxiosInstance from "@/config/userAxiosInterceptor";
import vendorAxiosInstance from "@/config/vendorAxiosInterceptors";
import type {
  ApiResponse,
  OtpPayload,
} from "@/interfaces/shared/auth/auth.interface";
import type { IVendorRegister } from "@/interfaces/vendor/vendor.regsiter.interface";

interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  
}

export const authService = {
  generateOtp: async (email: string): Promise<ApiResponse> => {
    try {
      const response = await userAxiosInstance.post("/generate-otp", { email });
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || "Failed to generate OTP";
    }
  },

  register: async (formData: RegisterPayload): Promise<ApiResponse> => {
    try {
      const response = await userAxiosInstance.post("/register", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || "Failed to register user";
    }
  },

  verifyOtp: async (data:OtpPayload): Promise<ApiResponse> => {
        
    try {

      console.log("Sending to /verify-otp:", data); // ADD THIS
      const response = await userAxiosInstance.post("/verify-otp", data);
      console.log("verifies otp:",response.data)
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || "Failed to verify OTP";
    }
  },

  login:async(credentials:{email:string,password:string})=>{
    console.log("/login route")
       return await userAxiosInstance.post("/login",credentials)
  },

   forgetPassword:async(email:string)=>{
    return await userAxiosInstance.post("/forget-password",{email})
  },

  
  verifyForgetPassword:async(email:string,otp:string)=>{
    return await userAxiosInstance.post("/verify-forget-otp",{email,otp})
  },

  resetPassword:async(email:string,password:string)=>{
    return await userAxiosInstance.post("/reset-password",{email,password})
  },

  
  usergoogleLogin:async(idToken:string)=>{
    return await userAxiosInstance.post("/auth/google",{idToken})
  },

  adminLogin:async(credential:{email:string,password:string})=>{
    console.log("/login of admin");
    return await adminAxiosInstance.post('/login',credential)
  },


  generateVendorOtp: async(email:string):Promise<ApiResponse>=>{
    
    try {
      const response = await vendorAxiosInstance.post("/generate-otp",{email});
      return response.data;
    } catch (error:any) {
      throw error.response?.data?.message || 'Failed to generate vendor OTP'
    }
  },

  vendorRegister: async(formData:IVendorRegister):Promise<ApiResponse>=>{

    try {

      const response = await vendorAxiosInstance.post("/vendor-register",{
        name:formData.name,
        email:formData.email,
        registerNumber:formData.registerNumber,
        password:formData.password
      });
      console.log("responses for user verification",response.data)
      return response.data
      
    } catch (error:any) {
      throw error.response?.data?.message || "Failed to regsiter the vendor"
    }
  },

  verifyVendorOtp:async(data: OtpPayload):Promise<ApiResponse>=>{

    try {
      const response = await vendorAxiosInstance.post("/verify-otp",data);
      console.log("verifies vendor OTP",response.data);
      return response.data
    } catch (error:any) {
      throw error.response ?.data?.message || "Failed to verify vendor OTP"
    }
  },

  vendorLogin:async(credentials:{email:string,password:string})=>{
    return await vendorAxiosInstance.post("/login",credentials)
  },

  vendorGoogleLogin:async(idToken:string)=>{
    return await vendorAxiosInstance.post("/auth/google",{idToken})
  },


  forgetPasswordVendor:async(email:string)=>{
    return await vendorAxiosInstance.post("/forget-password",{email})
  },

  verifyVendorForgetOtp:async(email:string,otp:string)=>{
  return await vendorAxiosInstance.post("/verify-forget-otp",{email,otp})
  },
  

  
  resetVendorPassword:async(email:string,password:string)=>{
    return await vendorAxiosInstance.post("/reset-password",{email,password})
  },


};
