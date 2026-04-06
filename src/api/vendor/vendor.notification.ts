import axiosInstance from "@/config/axiosInterceptor";
import type {
  ApiResponse,
  VendorNotificationListResponseDto,
  VendorUnreadCountResponseDto,
} from "@/interfaces/vendor/vendor.notification";

export const vendorNotificationService = {
  async getNotifications(
    page = 1,
    limit = 10,
  ): Promise<VendorNotificationListResponseDto> {
    const response = await axiosInstance.get<
      ApiResponse<VendorNotificationListResponseDto>
    >(`/vendor/notifications?page=${page}&limit=${limit}`);
    return response.data.data;
  },

  async getUnreadCount(): Promise<VendorUnreadCountResponseDto> {
    const response = await axiosInstance.get<
      ApiResponse<VendorUnreadCountResponseDto>
    >("/vendor/notifications/unread-count");
    return response.data.data;
  },

  async markAsRead(notificationId: string): Promise<void> {
    await axiosInstance.patch(`/vendor/notifications/${notificationId}/read`);
  },

  async markAllAsRead(): Promise<void> {
    await axiosInstance.patch("/vendor/notifications/mark-all-read");
  },
};
