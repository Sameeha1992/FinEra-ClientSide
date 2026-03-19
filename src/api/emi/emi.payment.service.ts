import axiosInstance from "@/config/axiosInterceptor";
import { API_ENDPOINTS } from "@/constants/api.endpoints";

export interface CreateEmiPaymentSessionResponse {
  success: boolean;
  message: string;
  checkoutUrl: string;
}

export const EmiPaymentService = {
  async createPaymentSession(
    emiId: string
  ): Promise<CreateEmiPaymentSessionResponse> {
    const response = await axiosInstance.post(API_ENDPOINTS.USER.CREATE_EMI_PAYMENT_SESSION, { emiId });
    
    return response.data.data;
    
  },
};