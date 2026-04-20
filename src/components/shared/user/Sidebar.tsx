import { useNavigate, useLocation } from "react-router-dom";
import {
  User,
  FileText,
  ArrowRightLeft,
  MessageCircle,
  BellIcon,
  LogOut,
  LayoutDashboard
} from "lucide-react";
import { useDispatch } from "react-redux";
import { authService } from "@/api/AuthServiceAndProfile";
import { clearAuth } from "@/redux/slice/auth.slice";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

interface SidebarItem {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  label: string;
  route?: string;
  action?: () => void;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { role } = useSelector((state: RootState) => state.auth)

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.log("Logout failed", error)
    } finally {
      dispatch(clearAuth())
      if (role === "user") {
        navigate("/user/logout")
      }
    }
  }

  const sidebarItems: SidebarItem[] = [
    { icon: LayoutDashboard, label: "Dashboard", route: "/user/dashboard" },
    { icon: User, label: "User Profile", route: "/user/user-profile" },
    { icon: FileText, label: "Applications", route: "/user/applications" },
    { icon: ArrowRightLeft, label: "Transactions", route: "/user/transactions" },
    { icon: MessageCircle, label: "Chat Support", route: "/user/conversations" },
    { icon: BellIcon, label: "Notifications", route: "/user/notifications" },
    { icon: LogOut, label: "Logout", action: handleLogout },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-[60] lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <div className={`fixed left-0 top-20 bottom-0 w-64 bg-white border-r border-gray-200 z-[70] transition-transform duration-300 transform 
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="p-2 space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.route ? location.pathname.startsWith(item.route) : false;

            return (
              <button
                key={item.label}
                onClick={() => {
                  if (item.action) {
                    item.action();
                  } else if (item.route) {
                    navigate(item.route);
                    onClose(); // Close on mobile after navigation
                  }
                }}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${isActive
                  ? "bg-teal-600 text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
