import { useQuery } from "@tanstack/react-query";
import { Bell, RefreshCw } from "lucide-react";
import { NotificationService } from "@/api/notifications/notitfcation.service";
import Notifications from "@/components/notifications/Notifications";
import type { Notification } from "@/components/notifications/NotificationCard";

const UserNotifications = () => {
  // ── Fetch all notifications ──────────────────────────────────────────────
  const {
    data: rawData,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => NotificationService.getNotifications(),
    staleTime: 30_000,
  });

  // Safely extract array regardless of API response shape
  const notifications: Notification[] = Array.isArray(rawData) ? rawData : [];

  // ── Fetch unread count (shown in page header badge) ──────────────────────
  const { data: unreadData } = useQuery({
    queryKey: ["unreadCount"],
    queryFn: () => NotificationService.getUnreadCount(),
    staleTime: 30_000,
  });

  const unreadCount: number =
    typeof unreadData === "number"
      ? unreadData
      : (unreadData?.count ?? 0);

  return (
    <div className="space-y-6">
      {/* ── Page Header ────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Icon with unread badge */}
          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-600">
              <Bell className="h-5 w-5 text-white" />
            </div>
            {unreadCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </div>

          <div>
            <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
            <p className="text-sm text-gray-500">
              {unreadCount > 0
                ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
                : "You're all caught up"}
            </p>
          </div>
        </div>

        {/* Refresh button */}
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          title="Refresh notifications"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {/* ── Error state ─────────────────────────────────────────────────────── */}
      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
          Failed to load notifications. Please{" "}
          <button
            onClick={() => refetch()}
            className="font-semibold underline underline-offset-2 hover:text-red-700"
          >
            try again
          </button>
          .
        </div>
      )}

      {/* ── Card container ──────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <Notifications notifications={notifications} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default UserNotifications;
