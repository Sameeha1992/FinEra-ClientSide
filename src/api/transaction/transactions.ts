import axiosInstance from "@/config/axiosInterceptor";
import type { PaginatedUserTransactionDto, PaginatedVendorTransactionDto } from "@/interfaces/transaction/transaction.interface";

export const TransactionsService ={
    async getUserTransaction(page:number =1,limit:number=10):Promise<PaginatedUserTransactionDto>{
        const response = await axiosInstance.get("/user/transactions",{params:{page,limit}});

        return response.data.data;
    },

    async getVendorTransaction(page:number =1,limit:number=10):Promise<PaginatedVendorTransactionDto>{
       const response = await axiosInstance.get("/vendor/transactions",{params:{page,limit}});
       return response.data.data;
    },

    async downloadVendorTransactionReport(
    startDate?: string,
    endDate?: string
  ): Promise<Blob> {
    const response = await axiosInstance.get(
      "/vendor/transactions/report",
      {
        params: { startDate, endDate },
        responseType: "blob", // VERY IMPORTANT
      }
    );

    return response.data;
  },
}