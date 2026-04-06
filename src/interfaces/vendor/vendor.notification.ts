export type VendorNotificationType =
  | "NEW_LOAN_APPLICATION"
  | "USER_EMI_OVERDUE"
  | "USER_EMI_HIGH_RISK";

export interface VendorNotificationDto {
  notificationId: string;
  vendorId: string;
  userId?: string;
  applicationId?: string;
  loanId?: string;
  emiId?: string;
  title: string;
  message: string;
  type: VendorNotificationType;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VendorNotificationListResponseDto {
  notifications: VendorNotificationDto[];
  total: number;
}

export interface VendorUnreadCountResponseDto {
  unreadCount: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}