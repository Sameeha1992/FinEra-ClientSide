import axiosInstance from "@/config/axiosInterceptor";
import type { VendorDashboardData, VendorDashboardResponse } from "@/interfaces/vendor/vendor.dashboard.interface";

export const vendorDashboardService = {
  getDashboardData: async (): Promise<VendorDashboardData> => {
    const response = await axiosInstance.get<VendorDashboardResponse>("/vendor/dashboard");
    return response.data.data;
  },

  exportDashboardCSV: async (): Promise<void> => {
    const response = await axiosInstance.get("/vendor/dashboard/export", {
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `vendor_report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
