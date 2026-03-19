import React from "react";
import {
  CheckCircle2,
  AlertCircle,
  Info,
  Bell,
  CreditCard,
  FileText,
} from "lucide-react";

export type NotificationType =
  | "LOAN_APPROVED"
  | "LOAN_REJECTED"
  | "LOAN_DISBURSED"
  | "EMI_REMINDER"
  | "EMI_PAID"
  | "GENERAL"
  | string;

export interface Notification {
  id: string;           // primary key from backend
  userId?: string;
  emiId?: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  // legacy optional aliases (kept for safety)
  notificationId?: string;
  _id?: string;
}

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  isMarkingRead?: boolean;
}

// ── Type → icon + color mapping ──────────────────────────────────────────────
const TYPE_CONFIG: Record<
  string,
  { icon: React.ReactNode; pill: string; iconBg: string }
> = {
  LOAN_APPROVED: {
    icon: <CheckCircle2 className="w-5 h-5" />,
    pill: "bg-green-100 text-green-700",
    iconBg: "bg-green-100 text-green-600",
  },
  LOAN_REJECTED: {
    icon: <AlertCircle className="w-5 h-5" />,
    pill: "bg-red-100 text-red-700",
    iconBg: "bg-red-100 text-red-600",
  },
  LOAN_DISBURSED: {
    icon: <CreditCard className="w-5 h-5" />,
    pill: "bg-blue-100 text-blue-700",
    iconBg: "bg-blue-100 text-blue-600",
  },
  EMI_REMINDER: {
    icon: <FileText className="w-5 h-5" />,
    pill: "bg-amber-100 text-amber-700",
    iconBg: "bg-amber-100 text-amber-600",
  },
  EMI_PAID: {
    icon: <CheckCircle2 className="w-5 h-5" />,
    pill: "bg-teal-100 text-teal-700",
    iconBg: "bg-teal-100 text-teal-600",
  },
  GENERAL: {
    icon: <Info className="w-5 h-5" />,
    pill: "bg-gray-100 text-gray-700",
    iconBg: "bg-gray-100 text-gray-500",
  },
};

const getConfig = (type: string) =>
  TYPE_CONFIG[type] ?? {
    icon: <Bell className="w-5 h-5" />,
    pill: "bg-gray-100 text-gray-700",
    iconBg: "bg-gray-100 text-gray-500",
  };

const formatRelativeTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTypLabel = (type: string): string => {
  return type
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onMarkAsRead,
  isMarkingRead = false,
}) => {
  const { icon, pill, iconBg } = getConfig(notification.type);

  // `id` is the primary key from the backend
  const resolvedId =
    notification.id ?? notification._id ?? notification.notificationId ?? "";

  return (
    <div
      className={`group relative flex items-start gap-4 rounded-xl border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
        notification.isRead
          ? "border-gray-100 bg-white"
          : "border-teal-100 bg-teal-50/40 shadow-sm"
      }`}
    >
      {/* Unread dot */}
      {!notification.isRead && (
        <span className="absolute right-4 top-4 h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
      )}

      {/* Icon */}
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${iconBg}`}
      >
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <p
            className={`text-sm font-semibold ${
              notification.isRead ? "text-gray-700" : "text-gray-900"
            }`}
          >
            {notification.title}
          </p>
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${pill}`}
          >
            {formatTypLabel(notification.type)}
          </span>
        </div>

        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
          {notification.message}
        </p>

        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-gray-400">
            {formatRelativeTime(notification.createdAt)}
          </span>

          {!notification.isRead && (
            <button
              onClick={() => onMarkAsRead(resolvedId)}
              disabled={isMarkingRead || !resolvedId}
              className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium text-teal-600 hover:bg-teal-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Mark as read
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
