import axiosInstance from "@/config/axiosInterceptor";
import type { DashboardApiResponse, UserDashboardData } from "@/interfaces/user/dashboard/user.dashboard";

export const UserDashboard ={
   async getUserDashbaord():Promise<UserDashboardData>{
    const response = await axiosInstance.get<DashboardApiResponse>("/user/dashboard");
    console.log("response",response)
    return response.data.data
   }
}