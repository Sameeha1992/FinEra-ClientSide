import axiosInstance from "@/config/axiosInterceptor";
import { API_ENDPOINTS } from "@/constants/api.endpoints";
import type { Notification } from "@/components/notifications/NotificationCard";

export const NotificationService = {
  async getNotifications(): Promise<Notification[]> {
    const response = await axiosInstance.get(
      API_ENDPOINTS.USER.GET_NOTITFICATIONS,
    );
    console.log("response for geting notifications:", response.data.data);
    return response.data.data;
  },

  async getUnreadCount() {
    const response = await axiosInstance.get(
      API_ENDPOINTS.USER.GET_UNREAD_COUNT,
    );
    console.log("unread count:", response.data.data);
    return response.data.data;
  },

  async markAsRead(notificationId: string) {
    const resposne = await axiosInstance.patch(
      API_ENDPOINTS.USER.MARK_AS_READ_NOTIFICATION(notificationId),
    );
    console.log("mark as read", resposne.data.data);
    return resposne.data.data;
  },

  async markAllAsRead() {
    const response = await axiosInstance.patch(
      API_ENDPOINTS.USER.MARK_ALL_READ_NOTIFICATION,
    );
    console.log("mark all read noti", response.data.data);
    return response.data.data;
  },
};
