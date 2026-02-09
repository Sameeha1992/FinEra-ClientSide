import axiosInstance from "@/config/axiosInterceptor";
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
    const response = await axiosInstance.get("/user/user-profile")
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
      (["fullName", "phone", "dob", "job", "income", "gender", "adhaarNumber", "panNumber", "cibilScore"] as const).forEach(
        key => {
          const value = formData[key];
          if (value) data.append(key, value);
        }
      );

       (["adhaarDoc", "panDoc", "cibilDoc", "profileImage"] as const).forEach(key => {
        const file = formData[key];
        if (file) data.append(key, file);
      });

      const response = await axiosInstance.post<ApiResponsnes<userData>>("/user/user-complete-profile", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Complete profile response", response.data);
      return response.data;

  } catch (error) {
    console.error("Failed to complete user profile", error);
      throw error;
  }
},


async getCompleteProfile():Promise<CompleteProfileData>{

  try {
    const response = await axiosInstance.get("/user/complete-profile")
    console.log("complete profile api response",response.data);
    return response.data.data
    
  } catch (error) {
    console.error("failed to fetch complete profile",error);
    throw error
  }
}

}