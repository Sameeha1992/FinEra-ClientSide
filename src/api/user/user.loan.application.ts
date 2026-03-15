import axiosInstance from "@/config/axiosInterceptor";
import type { IUserApplicationsListResponse, UserApplicationDetail } from "@/interfaces/user/userApplications/user.application.types";

export const UserApplicationservice = {
    async getApplicationList(page: number = 1, limit: number = 10): Promise<IUserApplicationsListResponse> {
        const response = await axiosInstance.get("/user/applications", { params: { page, limit } });
        return response.data.data;
    },

    async getApplicationDetail(applicationId: string): Promise<UserApplicationDetail> {
        const response = await axiosInstance.get(`/user/applications/${applicationId}`);

        console.log(response.data.data,"user application")
        return response.data.data;
    }
}