import React, { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Bell, CheckCheck, InboxIcon } from "lucide-react";
import { NotificationService } from "@/api/notifications/notitfcation.service";
import NotificationCard, { type Notification } from "./NotificationCard";
import toast from "react-hot-toast";

type FilterTab = "all" | "unread" | "read";

interface NotificationsProps {
  notifications: Notification[];
  isLoading: boolean;
}

const TABS: { key: FilterTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "read", label: "Read" },
];

const Notifications: React.FC<NotificationsProps> = ({
  notifications,
  isLoading,
}) => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [markingId, setMarkingId] = useState<string | null>(null);

  // Guard: always work with an array
  const safeNotifications = Array.isArray(notifications) ? notifications : [];

  // ── Mark single as read ──────────────────────────────────────────────────
  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => NotificationService.markAsRead(id),
    onMutate: (id) => setMarkingId(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unreadCount"] });
      toast.success("Notification marked as read");
    },
    onError: () => toast.error("Failed to mark notification as read"),
    onSettled: () => setMarkingId(null),
  });

  // ── Mark all as read ─────────────────────────────────────────────────────
  const markAllAsReadMutation = useMutation({
    mutationFn: () => NotificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unreadCount"] });
      toast.success("All notifications marked as read");
    },
    onError: () => toast.error("Failed to mark all notifications as read"),
  });

  // ── Filter ───────────────────────────────────────────────────────────────
  const filtered =
    activeTab === "all"
      ? safeNotifications
      : activeTab === "unread"
        ? safeNotifications.filter((n) => !n.isRead)
        : safeNotifications.filter((n) => n.isRead);

  const unreadCount = safeNotifications.filter((n) => !n.isRead).length;
  const hasUnread = unreadCount > 0;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 p-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative flex items-center gap-1.5 rounded-md px-4 py-1.5 text-sm font-medium transition-all duration-150 ${
                activeTab === tab.key
                  ? "bg-white text-teal-700 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
              {tab.key === "unread" && unreadCount > 0 && (
                <span className="ml-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-teal-600 px-1 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Mark all read button */}
        {hasUnread && (
          <button
            onClick={() => markAllAsReadMutation.mutate()}
            disabled={markAllAsReadMutation.isPending}
            className="inline-flex items-center gap-2 rounded-lg border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-medium text-teal-700 transition-colors hover:bg-teal-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CheckCheck className="w-4 h-4" />
            {markAllAsReadMutation.isPending ? "Marking…" : "Mark all as read"}
          </button>
        )}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="flex items-start gap-4 rounded-xl border border-gray-100 bg-white p-4 animate-pulse"
            >
              <div className="h-10 w-10 rounded-full bg-gray-200 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-1/3 rounded bg-gray-200" />
                <div className="h-3 w-2/3 rounded bg-gray-200" />
                <div className="h-3 w-1/4 rounded bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
            {activeTab === "unread" ? (
              <Bell className="h-6 w-6 text-gray-400" />
            ) : (
              <InboxIcon className="h-6 w-6 text-gray-400" />
            )}
          </div>
          <p className="text-sm font-semibold text-gray-700">
            {activeTab === "unread"
              ? "You're all caught up!"
              : activeTab === "read"
                ? "No read notifications"
                : "No notifications yet"}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            {activeTab === "unread"
              ? "No unread notifications at the moment."
              : "Notifications will appear here."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((notification) => {
            const resolvedId =
              notification.id ??
              notification._id ??
              notification.notificationId ??
              "";
            return (
              <NotificationCard
                key={resolvedId}
                notification={notification}
                onMarkAsRead={(id) => markAsReadMutation.mutate(id)}
                isMarkingRead={markingId === resolvedId}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Notifications;
