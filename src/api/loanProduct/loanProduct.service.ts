import axiosInstance from "@/config/axiosInterceptor";
import { API_ENDPOINTS } from "@/constants/api.endpoints";
import type { LoanDetailForUserDto } from "@/interfaces/addLoan/loan.detail.dto";
import type {
  ILoanProductDto,
  LoanListing,
} from "@/interfaces/addLoan/loanProduct.dto";
import axios from "axios";

export const loanProduct = {
  async addLoan(data: ILoanProductDto): Promise<ILoanProductDto> {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.VENDOR.ADD_LOAN, data);
      console.log(response.data, "loan product data coming");
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || "Something went wrong";
        throw new Error(message);
      }

      throw new Error("Something went wrong");
    }
  },

  async getVendorLoans(
    search: string = "",
    page: number = 1,
    limit: number = 2,
  ): Promise<LoanListing> {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.VENDOR.GET_VENDOR_LOANS, {
        params: { page, limit, search },
      });

      console.log("loan list cheyyuva", response.data.data);

      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || "Something went wrong";
        throw new Error(message);
      }
      throw "Something went wrong";
    }
  },

  async getLoanById(loanId: string): Promise<ILoanProductDto> {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.VENDOR.GET_VENDOR_LOAN(loanId));
      console.log("Single loan data:", response.data.data);
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || "Something went wrong";
        throw new Error(message);
      }
      throw "Something went wrong";
    }
  },

  async updateloans(
    loandId: string,
    data: Partial<ILoanProductDto>,
  ): Promise<ILoanProductDto> {
    try {
      const response = await axiosInstance.put(
        API_ENDPOINTS.VENDOR.UPDATE_VENDOR_LOAN(loandId),
        data,
      );

      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || "Something went wrong";
        throw message;
      }

      throw "Something went wrong";
    }
  },

  async getLoanDetails(loanId: string): Promise<ILoanProductDto> {
    try {
      const response = await axiosInstance.get(`/vendor/loans/${loanId}`);
      console.log("Loan details data", response.data.data);
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || "Something went wrong";
        throw new Error(message);
      }
      throw "Something went wrong";
    }
  },

  async toggleLoanStatus(
    loanId: string,
    status: "ACTIVE" | "INACTIVE",
  ): Promise<void> {
    try {
      await axiosInstance.put(`/vendor/loans/${loanId}`, { status });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || "Something went wrong";
        throw message;
      }
      throw "Something went wrong";
    }
  },

  async getLoanDetailsForUser(loanId: string): Promise<LoanDetailForUserDto> {
    const response = await axiosInstance.get(`/user/loans/${loanId}`);

    return response.data.data;
  },
};
