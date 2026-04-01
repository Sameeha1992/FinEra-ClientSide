import { useQuery } from "@tanstack/react-query";
import { adminDashboardService } from "@/api/admin/admin.dashboard.service";

export const useAdminDashboard=()=>{
    return useQuery({
        queryKey:["admin-dashboard"],
        queryFn:adminDashboardService.getDashboard
    })
}