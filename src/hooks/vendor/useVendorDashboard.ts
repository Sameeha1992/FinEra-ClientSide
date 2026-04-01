import { useQuery } from "@tanstack/react-query";
import { vendorDashboardService } from "@/api/vendor/vendorDashboard.service";
import type { VendorDashboardData } from "@/interfaces/vendor/vendor.dashboard.interface";

export const useVendorDashboard = () => {
  return useQuery<VendorDashboardData>({
    queryKey: ["vendorDashboard"],
    queryFn: vendorDashboardService.getDashboardData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
