import { vendorNotificationService } from "@/api/vendor/vendor.notification";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useVendorNotifications = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["vendor-notifications", page, limit],
    queryFn: () => vendorNotificationService.getNotifications(page, limit),
  });
};

export const useVendorUnreadCount = () => {
  return useQuery({
    queryKey: ["vendor-notification-unread-count"],
    queryFn: () => vendorNotificationService.getUnreadCount(),
    refetchInterval: 30000,
  });
};

export const useMarkVendorNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) =>
      vendorNotificationService.markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-notifications"] });
      queryClient.invalidateQueries({
        queryKey: ["vendor-notification-unread-count"],
      });
    },
  });
};

export const useMarkAllVendorNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => vendorNotificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-notifications"] });
      queryClient.invalidateQueries({
        queryKey: ["vendor-notification-unread-count"],
      });
    },
  });
};