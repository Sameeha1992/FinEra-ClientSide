import axiosInstance from "@/config/axiosInterceptor";
import type { LoanListingResponse } from "@/interfaces/user/loans/user.loan.listing";

export const loanService = {
  async getLoans(
    loanType: string,
    userSalary?: number,
    page: number = 1,
    limit: number = 10,
    search?: string,
  ): Promise<LoanListingResponse> {
    try {
      const params: any = {
        loanType,
        page,
        limit,
      };

      if (userSalary !== undefined) {
        params.userSalary = userSalary;
      }

      if (search) {
        params.search = search;
      }

      const response = await axiosInstance.get("user/loans", {
        params,
      });

      console.log("Loan listing response:", response.data);

      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch loans", error);
      throw error;
    }
  },
};
