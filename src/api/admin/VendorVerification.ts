import axiosInstance from "@/config/axiosInterceptor";
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
      const response = await axiosInstance.get("/admin/vendors", {
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
      const response = await axiosInstance.get(`/admin/vendors/${vendorId}`);
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data || error.message;
      }
      throw error;
    }
  },

  async updateVendorStatus(vendorId:string,status:VendorStatus,rejectionReason?:string):Promise<UpdateVendorStatusPayload>{
    const response = await axiosInstance.patch(`/admin/vendors/${vendorId}/status`,{status,rejectionReason});

    return response.data
  }
};
