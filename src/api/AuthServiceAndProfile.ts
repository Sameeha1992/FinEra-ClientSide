import axiosInstance from "@/config/axiosInterceptor";
import { AuthRoutes } from "@/constants/auth";
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

  //User Auth:-

  generateOtp: async (email: string): Promise<ApiResponse> => {
    try {
      const response = await axiosInstance.post(AuthRoutes.GENERATE_OTP, { email });
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || "Failed to generate OTP";
    }
  },

  register: async (formData: RegisterPayload): Promise<ApiResponse> => {
    try {
      const response = await axiosInstance.post(AuthRoutes.REGISTER, {
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
      const response = await axiosInstance.post(AuthRoutes.VERIFY_OTP, data);
      console.log("verifies otp:",response.data)
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || "Failed to verify OTP";
    }
  },

  login:async(credentials:{email:string,password:string})=>{
    console.log("/login route")
       return await axiosInstance.post(AuthRoutes.LOGIN,credentials)
  },

   forgetPassword:async(email:string)=>{
    return await axiosInstance.post(AuthRoutes.FORGET_PASSWORD,{email})
  },

  
  verifyForgetPassword:async(email:string,otp:string)=>{
    return await axiosInstance.post(AuthRoutes.VERIFY_FORGET_PASSWORD,{email,otp})
  },

  resetPassword:async(email:string,password:string)=>{
    return await axiosInstance.post(AuthRoutes.RESET_PASSWORD,{email,password})
  },

  
  usergoogleLogin:async(token:string)=>{
    return await axiosInstance.post(AuthRoutes.GOOGLE_AUTH,{token})
  },


  //Admin Auth:-

  adminLogin:async(credential:{email:string,password:string})=>{
    console.log("/login of admin");
    return await axiosInstance.post(AuthRoutes.ADMIN_LOGIN,credential)
  },



  //Vendor Auth:-

  generateVendorOtp: async(email:string):Promise<ApiResponse>=>{
    
    try {
      const response = await axiosInstance.post(AuthRoutes.VENDOR_GENERATE_OTP,{email});
      return response.data;
    } catch (error:any) {
      throw error.response?.data?.message || 'Failed to generate vendor OTP'
    }
  },

  vendorRegister: async(formData:IVendorRegister):Promise<ApiResponse>=>{

    try {

      const response = await axiosInstance.post(AuthRoutes.VENDOR_REGISTER,{
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
      const response = await axiosInstance.post(AuthRoutes.VENDOR_VERIFY_OTP,data);
      console.log("verifies vendor OTP",response.data);
      return response.data
    } catch (error:any) {
      throw error.response ?.data?.message || "Failed to verify vendor OTP"
    }
  },

  vendorLogin:async(credentials:{email:string,password:string})=>{
    return await axiosInstance.post(AuthRoutes.VENDOR_LOGIN,credentials)
  },

  vendorGoogleLogin:async(token:string)=>{
    return await axiosInstance.post(AuthRoutes.VENDOR_GOOGLE_AUTH,{token})
  },


  forgetPasswordVendor:async(email:string)=>{
    return await axiosInstance.post(AuthRoutes.VENDOR_FORGET_PASSWORD,{email})
  },

  verifyVendorForgetOtp:async(email:string,otp:string)=>{
  return await axiosInstance.post(AuthRoutes.VENDOR_VERIFY_FORGET_PASSWORD,{email,otp})
  },
  

  
  resetVendorPassword:async(email:string,password:string)=>{
    return await axiosInstance.post(AuthRoutes.VENDOR_RESET_PASSWORD,{email,password})
  }


};
