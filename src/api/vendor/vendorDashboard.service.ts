import axiosInstance from "@/config/axiosInterceptor";
import type { VendorDashboardData, VendorDashboardResponse } from "@/interfaces/vendor/vendor.dashboard.interface";

export const vendorDashboardService = {
  getDashboardData: async (): Promise<VendorDashboardData> => {
    const response = await axiosInstance.get<VendorDashboardResponse>("/vendor/dashboard");
    return response.data.data;
  },
};
