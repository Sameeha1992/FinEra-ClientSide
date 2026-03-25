import axiosInstance from "@/config/axiosInterceptor";
import { API_ENDPOINTS } from "@/constants/api.endpoints";
import type {ApiResponsnes } from "@/interfaces/shared/auth/auth.interface";
import type { CompleteProfileForm } from "@/interfaces/user/userProfile/profile.complete.interface";
import type { CompleteProfileData } from "@/interfaces/user/userProfile/profile.complete.interface";
export interface userData{
 customerId:string,
 name:string,
 email:string,
 phone:string,
 status: "VERIFIED" |"NOT_VERIFIED";
 isProfileComplete?:boolean,

  dob?: string;
  job?: string;
  income?: string;
  gender?: "male" | "female" | "other";
  adhaarNumber?: string;
  panNumber?: string;
  cibilScore?: string;
  adhaarDoc?: string;
  panDoc?: string;
  cibilDoc?: string;
  profileImage?: string;
}


export const userProfile = {
async getUserProfile():Promise<userData>{
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.USER.GET_USER_PROFILE)
    console.log("Profile api response",response.data)
    return response.data.data
    
  } catch (error) {
    console.error("Failed to fetch user profile")
    throw error
  }
},

async completeUserProfile(formData:CompleteProfileForm):Promise<ApiResponsnes<userData>>{
  try {
    const data = new FormData();

      // Append all text fields dynamically
      (["name", "phone", "dob", "job", "income", "gender", "adhaarNumber", "panNumber", "cibilScore"] as const).forEach(
        key => {
          const value = formData[key];
          if (value) data.append(key, value);
        }
      );

       (["adhaarDoc", "panDoc", "cibilDoc", "profileImage"] as const).forEach(key => {
        const file = formData[key];
        if (file) data.append(key, file);
      });

      const response = await axiosInstance.post<ApiResponsnes<userData>>(API_ENDPOINTS.USER.COMPLETE_USER_PROFILE, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Complete profile response", response.data);
      return response.data;

  } catch (error:any) {
    console.error("Failed to complete user profile", error);
    console.log("this is the issue",error.response?.data)
      throw error;
  }
},


async getCompleteProfile():Promise<CompleteProfileData>{

  try {
    const response = await axiosInstance.get(API_ENDPOINTS.USER.GET_COMPLETE_PROFILE)
    console.log("complete profile api response",response.data);
    return response.data.data
    
  } catch (error) {
    console.error("failed to fetch complete profile",error);
    throw error
  }
},

async updateUserProfile(formData:Partial<CompleteProfileForm>):Promise<ApiResponsnes<userData>>{

  try {
    const data = new FormData();

     (
      ["name","email","phone", "dob", "job", "income", "gender", "adhaarNumber", "panNumber", "cibilScore"] as const
    ).forEach((key) => {
      const value = formData[key];
      if (value !== undefined && value !== null) {
        data.append(key, value as string);
      }
    });

    (
      ["adhaarDoc", "panDoc","profileImage"] as const
    ).forEach((key) => {
      const file = formData[key];
      if (file) {
        data.append(key, file);
      }
    });
    
    const response = await axiosInstance.put<ApiResponsnes<userData>>(API_ENDPOINTS.USER.UPDATE_USER_PROFILE,data,{headers:{"Content-Type":"multipart/form-data"}});

    console.log("Update profile response",response.data)

    return response.data
    
  } catch (error) {
    console.error("Failed to update profile",error);
    throw error
  }
}

}