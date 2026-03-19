import axiosInstance from "@/config/axiosInterceptor";
import { API_ENDPOINTS } from "@/constants/api.endpoints";
import type { AccountQuery } from "@/interfaces/admin/AccouuntQuery";

export const fetchAccounts = async (query: AccountQuery) => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.ADMIN.ACCOUNTS, {
      params: query,
    });
    return response.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

export const updateAccountStatus = async (
  accountId: string,
  accountStatus: "blocked" | "unblocked",
  role: "user" | "vendor",
) => {
  const response = await axiosInstance.patch(
    API_ENDPOINTS.ADMIN.UPDATE_ACCOUNT_STATUS(accountId),
    { accountStatus, role },
  );
  return response.data;
};
