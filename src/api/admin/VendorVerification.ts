import axiosInstance from "@/config/axiosInterceptor";
import { API_ENDPOINTS } from "@/constants/api.endpoints";
import type {
  UpdateVendorStatusPayload,
  VendorDetailData,
  VendorStatus,
  VendorVerificationResponse,
} from "@/interfaces/admin/VendorVerification";
import axios from "axios";

export const vendorVerificationList = {
  async getVendorList(
    page: number = 1,
    limit: number = 10,
  ): Promise<VendorVerificationResponse> {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.ADMIN.VENDORS, {
        params: { page, limit },
      });
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data || error.message;
      }

      throw error;
    }
  },

  async getVendorDetails(vendorId: string): Promise<VendorDetailData> {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.ADMIN.VENDOR_DETAILS(vendorId));
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data || error.message;
      }
      throw error;
    }
  },

  async updateVendorStatus(vendorId:string,status:VendorStatus,rejectionReason?:string):Promise<UpdateVendorStatusPayload>{
    const response = await axiosInstance.patch(API_ENDPOINTS.ADMIN.UPDATE_VENDOR_STATUS(vendorId),{status,rejectionReason});

    return response.data
  }
};
