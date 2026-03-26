import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { socket } from "@/config/socket";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { toast } from "react-hot-toast";

export const useNotificationSocket = () => {
  const queryClient = useQueryClient();
  const token = useSelector((state: RootState) => state.token.accessToken);

  useEffect(() => {
    if (!token) return;

    // 1. Connect and Auth
    socket.auth = { token };
    socket.connect();

    // 2. Listen for new notifications
    socket.on("new_notification", (notification) => {
      console.log("Real-time notification received:", notification);

      // Invalidate queries to trigger background refresh
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unreadCount"] });

      // Show a toast message
      toast.success(`${notification.title}: ${notification.message}`, {
        duration: 5000,
        position: "top-right",
      });
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    // 3. Cleanup on unmount
    return () => {
      socket.off("new_notification");
      socket.disconnect();
    };
  }, [token, queryClient]);
};
