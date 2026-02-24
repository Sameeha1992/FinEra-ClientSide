import axiosInstance from "@/config/axiosInterceptor";
import type { LoanListingResponse } from "@/interfaces/user/loans/user.loan.listing";

export const loanService = {
  async getLoans(
    loanType: string,
    userSalary?: number,
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<LoanListingResponse> {
    try {
      // ✅ Build params safely
      const params: any = {
        loanType,
        page,
        limit,
      };

      // ✅ Only add salary if it exists
      if (userSalary !== undefined) {
        params.userSalary = userSalary;
      }

      // ✅ Only add search if it exists
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