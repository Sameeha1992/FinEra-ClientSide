import axiosInstance from "@/config/axiosInterceptor";
import { API_ENDPOINTS } from "@/constants/api.endpoints";
import type { LoanListingResponse } from "@/interfaces/user/loans/user.loan.listing";

interface LoanSearchParams {
  loanType: string;
  page: number;
  limit: number;
  userSalary?: number;
  search?: string;
}

export const loanService = {
  async getLoans(
    loanType: string,
    userSalary?: number,
    page: number = 1,
    limit: number = 10,
    search?: string,
  ): Promise<LoanListingResponse> {
    try {
      const params: LoanSearchParams = {
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

      const response = await axiosInstance.get(API_ENDPOINTS.USER.GET_LOANS, {
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
