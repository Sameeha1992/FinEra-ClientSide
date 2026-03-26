// components/TopNav.tsx
import type { FC } from "react";
import { Bell } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const navLinks = [
  { label: "Home", path: "/user/home" },
  { label: "Loans", path: "/user/loans" },
  { label: "About Us", path: "/user/about" },
  { label: "Contact Us", path: "/user/contact" },
];

import { useQuery } from "@tanstack/react-query";
import { NotificationService } from "@/api/notifications/notitfcation.service";

const TopNav: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch unread count for the badge
  const { data: unreadData } = useQuery({
    queryKey: ["unreadCount"],
    queryFn: () => NotificationService.getUnreadCount(),
    staleTime: 30_000,
  });

  const unreadCount: number =
    typeof unreadData === "number" ? unreadData : unreadData?.unreadCount ?? 0;

  return (
    <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="flex items-center justify-between px-8 py-4">
        {/* Logo — click to go home */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/user/home")}
        >
          <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">F</span>
          </div>
          <span className="text-xl font-bold text-teal-600">FinEra</span>
        </div>

        {/* Center Navigation */}
        <nav className="flex gap-8">
          {navLinks.map((link) => {
            const isActive = location.pathname.startsWith(link.path);
            return (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`text-sm font-medium transition-colors pb-0.5 ${
                  isActive
                    ? "text-teal-600 border-b-2 border-teal-600"
                    : "text-gray-600 hover:text-teal-600"
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          <div
            className="relative cursor-pointer"
            onClick={() => navigate("/user/notifications")}
          >
            <Bell className="w-6 h-6 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-sm">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNav;
