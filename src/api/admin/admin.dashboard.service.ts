import axiosInstance from "@/config/axiosInterceptor";
import type { AdminDashboardResponse } from "@/interfaces/admin/admin.dashboard.interface";

export const adminDashboardService = {
  async getDashboard(): Promise<AdminDashboardResponse> {
    const response = await axiosInstance.get("/admin/dashboard");
    return response.data.data;
  },
};
