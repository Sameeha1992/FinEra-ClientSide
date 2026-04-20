import React, { useState } from "react";
import Sidebar from "@/components/vendor/dashboard/shared/Sidebar";
import {
  Bell,
  CheckCheck,
  Clock,
  AlertCircle,
  Inbox,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import {
  useVendorNotifications,
  useMarkVendorNotificationAsRead,
  useMarkAllVendorNotificationsAsRead,
} from "@/hooks/vendor/vendor.notification";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import toast from "react-hot-toast";

dayjs.extend(relativeTime);

const NotificationVendor: React.FC = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError, refetch } = useVendorNotifications(
    page,
    limit,
  );
  const markAsReadMutation = useMarkVendorNotificationAsRead();
  const markAllAsReadMutation = useMarkAllVendorNotificationsAsRead();

  const handleMarkAsRead = async (id: string, isRead: boolean) => {
    if (isRead) return;
    try {
      await markAsReadMutation.mutateAsync(id);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to mark notification as read";
      toast.error(message);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsReadMutation.mutateAsync();
      toast.success("All notifications marked as read");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to mark all as read";
      toast.error(message);
    }
  };

  const notifications = data?.notifications || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Sidebar />

      <main className="flex-1 ml-56 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                <Bell className="text-teal-500" />
                Notifications
              </h1>
              <p className="text-slate-500 mt-1">
                Stay updated with your latest activities
              </p>
            </div>

            {notifications.length > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                disabled={markAllAsReadMutation.isPending}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-teal-600 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors disabled:opacity-50"
              >
                {markAllAsReadMutation.isPending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <CheckCheck size={16} />
                )}
                Mark all as read
              </button>
            )}
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {isLoading ? (
              <div className="p-12 flex flex-col items-center justify-center text-slate-400">
                <Loader2
                  size={40}
                  className="animate-spin mb-4 text-teal-500"
                />
                <p>Loading notifications...</p>
              </div>
            ) : isError ? (
              <div className="p-12 flex flex-col items-center justify-center text-center">
                <AlertCircle size={40} className="text-red-500 mb-4" />
                <h3 className="text-lg font-semibold text-slate-800">
                  Oops! Something went wrong
                </h3>
                <p className="text-slate-500 mb-6">
                  We couldn't fetch your notifications.
                </p>
                <button
                  onClick={() => refetch()}
                  className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-16 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                  <Inbox size={40} className="text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">
                  No notifications yet
                </h3>
                <p className="text-slate-500 max-w-xs mx-auto mt-2">
                  When you receive updates about loans, payments, or messages,
                  they'll appear here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.notificationId}
                    onClick={() =>
                      handleMarkAsRead(
                        notification.notificationId,
                        notification.isRead,
                      )
                    }
                    className={`p-5 flex gap-4 cursor-pointer transition-all hover:bg-slate-50 ${
                      !notification.isRead
                        ? "bg-teal-50/30 border-l-4 border-teal-500"
                        : "border-l-4 border-transparent"
                    }`}
                  >
                    <div
                      className={`mt-1 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        !notification.isRead
                          ? "bg-teal-100 text-teal-600"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <Bell size={18} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-4 mb-1">
                        <h4
                          className={`text-sm font-semibold truncate ${
                            !notification.isRead
                              ? "text-slate-900"
                              : "text-slate-600"
                          }`}
                        >
                          {notification.title}
                        </h4>
                        <span className="flex items-center gap-1.5 text-xs text-slate-400 whitespace-nowrap">
                          <Clock size={12} />
                          {dayjs(notification.createdAt).fromNow()}
                        </span>
                      </div>
                      <p
                        className={`text-sm leading-relaxed ${
                          !notification.isRead
                            ? "text-slate-700 font-medium"
                            : "text-slate-500"
                        }`}
                      >
                        {notification.message}
                      </p>
                    </div>

                    {!notification.isRead && (
                      <div className="mt-1">
                        <div className="w-2.5 h-2.5 bg-teal-500 rounded-full shadow-sm shadow-teal-500/50" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between px-2">
              <p className="text-sm text-slate-500">
                Showing{" "}
                <span className="font-medium text-slate-700">
                  {(page - 1) * limit + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium text-slate-700">
                  {Math.min(page * limit, total)}
                </span>{" "}
                of <span className="font-medium text-slate-700">{total}</span>
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-white hover:text-teal-500 disabled:opacity-50 disabled:hover:bg-transparent transition-all shadow-sm bg-white/50"
                >
                  <ChevronLeft size={20} />
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setPage(i + 1)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                      page === i + 1
                        ? "bg-teal-500 text-white shadow-md shadow-teal-500/20"
                        : "text-slate-600 hover:bg-white border border-transparent hover:border-slate-200"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-white hover:text-teal-500 disabled:opacity-50 disabled:hover:bg-transparent transition-all shadow-sm bg-white/50"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default NotificationVendor;
