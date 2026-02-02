import axiosInstance from "@/config/axiosInterceptor";

export interface userData{
 customerId:string,
 name:string,
 email:string,
 phone:string,
 status: "VERIFIED" |"NOT_VERIFIED";
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
}
}