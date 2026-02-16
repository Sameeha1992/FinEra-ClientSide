import React from "react";
import { NavLink } from "react-router-dom";
import { 
  Home, Users, FileText, DollarSign, BarChart3, Bell, 
  MessageSquare, ArrowRightLeft, LogOut, UserCheck 
} from 'lucide-react';

export default function  Sidebar() {
  
  return (
    <aside className="w-56 bg-gradient-to-b from-black to-gray-900 text-white h-screen flex flex-col fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold text-teal-400">FinanceAdmin</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
        <SidebarLink to="/vendor/vendor-dashboard" icon={<Home size={20} />} label="Dashboard" />
        <SidebarLink to="/vendor/vendor-profile" icon={<FileText size={20} />} label="Vendor Profile" />
        <SidebarLink to="/vendor/loans" icon={<DollarSign size={20} />} label="Loan" />
        <SidebarLink to="/users" icon={<Users size={20} />} label="Users" />
        <SidebarLink to="/user-verification" icon={<UserCheck size={20} />} label="User Verification" />
        
        <SidebarLink to="/applications" icon={<FileText size={20} />} label="Applications" />
        <SidebarLink to="/loan-info" icon={<BarChart3 size={20} />} label="Loan Info" />
        <SidebarLink to="/notifications" icon={<Bell size={20} />} label="Notifications" />
        <SidebarLink to="/chat-support" icon={<MessageSquare size={20} />} label="Chat Support" />
        <SidebarLink to="/transactions" icon={<ArrowRightLeft size={20} />} label="Transaction & Capital" />
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-700">
        <SidebarLink to="/logout" icon={<LogOut size={20} />} label="Logout" />
      </div>
    </aside>
  );
}

function SidebarLink({ to, icon, label }: { 
  to: string; 
  icon: React.ReactNode; 
  label: string 
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
          isActive
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


