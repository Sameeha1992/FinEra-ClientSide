import axiosInstance from "@/config/axiosInterceptor";
import type { PaginatedUserTransactionDto, PaginatedVendorTransactionDto, VendorReportFilters } from "@/interfaces/transaction/transaction.interface";

export const TransactionsService ={
    async getUserTransaction(page:number =1,limit:number=10, search: string = ""):Promise<PaginatedUserTransactionDto>{
        const response = await axiosInstance.get("/user/transactions",{params:{page,limit, search}});

        return response.data.data;
    },

    async getVendorTransaction(page:number =1,limit:number=10, search: string = ""):Promise<PaginatedVendorTransactionDto>{
       const response = await axiosInstance.get("/vendor/transactions",{params:{page,limit, search}});
       return response.data.data;
    },

    
  async exportVendorReport(
    filters: VendorReportFilters
  ): Promise<Blob> {
    const response = await axiosInstance.get("/vendor/transactions/report", {
    params: { ...filters, _t: Date.now() },
    withCredentials: true,
    responseType: "blob",
  });

    return response.data;
  },

}