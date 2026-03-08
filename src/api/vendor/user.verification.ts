import axiosInstance from "@/config/axiosInterceptor";
import type { VendorApplicationDetailsData, VendorApplicationListResponse } from "@/interfaces/vendor/user.verification.interface";

export const userVerification = {
    async getUserList(page: number = 1, limit: number = 10, search: string = ""): Promise<VendorApplicationListResponse> {
        const response = await axiosInstance.get("/vendor/applications", {
            params: { page, limit, search }
        })
        return response.data;
    },

    async getAApplicationDetail(applicationId: string): Promise<VendorApplicationDetailsData> {

        const response = await axiosInstance.get(`vendor/applications/${applicationId}`);
        console.log("user verification data", response.data)
        return response.data.data;

    }
}