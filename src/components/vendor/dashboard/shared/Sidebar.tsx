import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Users,
  FileText,
  DollarSign,
  BarChart3,
  Bell,
  MessageSquare,
  ArrowRightLeft,
  LogOut,
  UserCheck,
} from "lucide-react";
import { authService } from "@/api/AuthServiceAndProfile";
import { useDispatch } from "react-redux";
import { clearAuth } from "@/redux/slice/auth.slice";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { role } = useSelector((state: RootState) => state.auth);

  const handleLogout = async () => {
    try {
      await authService.vendorLogout();
    } catch (error) {
      console.log("Logout failed", error);
    } finally {
      dispatch(clearAuth());
      if (role === "vendor") {
        navigate("/vendor/login");
      }
    }
  };

  return (
    <aside className="w-56 bg-gradient-to-b from-black to-gray-900 text-white h-screen flex flex-col fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold text-teal-400">FinanceAdmin</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
        <SidebarLink
          to="/vendor/vendor-dashboard"
          icon={<Home size={20} />}
          label="Dashboard"
        />
        <SidebarLink
          to="/vendor/vendor-profile"
          icon={<FileText size={20} />}
          label="Vendor Profile"
        />
        <SidebarLink
          to="/vendor/loans"
          icon={<DollarSign size={20} />}
          label="Loan"
        />
        <SidebarLink to="/vendor/user-loans" icon={<Users size={20} />} label="Users Applications" />


        {/* <SidebarLink
          to="/applications"
          icon={<FileText size={20} />}
          label="Applications"
        /> */}

        <SidebarLink
          to="/notifications"
          icon={<Bell size={20} />}
          label="Notifications"
        />

        <SidebarLink
          to="/transactions"
          icon={<ArrowRightLeft size={20} />}
          label="Transactions"
        />
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left text-slate-300 hover:bg-slate-700 transition-all"
        >
          <LogOut size={20} />
          <span className="text-sm font-medium">Logout</span>
        </button>{" "}
      </div>
    </aside>
  );
}

function SidebarLink({
  to,
  icon,
  label,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
          ? "bg-teal-500 text-white"
          : "text-slate-300 hover:bg-slate-700"
        }`
      }
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </NavLink>
  );
}
