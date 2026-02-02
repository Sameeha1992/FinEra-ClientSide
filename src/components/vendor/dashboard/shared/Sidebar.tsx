import React from "react";
import { Link } from "react-router-dom";
import { 
  Home, Users, FileText, DollarSign, BarChart3, Bell, 
  MessageSquare, ArrowRightLeft, LogOut, UserCheck 
} from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="w-56 bg-gradient-to-b from-black to-gray-900 text-white h-screen flex flex-col fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold text-teal-400">FinanceAdmin</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
        <NavLink to="/vendor/vendor-dashboard" icon={<Home size={20} />} label="Dashboard" active />
        <NavLink to="/vendor/vendor-profile" icon={<FileText size={20} />} label="Vendor Profile" />
        <NavLink to="/users" icon={<Users size={20} />} label="Users" />
        <NavLink to="/user-verification" icon={<UserCheck size={20} />} label="User Verification" />
        <NavLink to="/loan" icon={<DollarSign size={20} />} label="Loan" />
        <NavLink to="/applications" icon={<FileText size={20} />} label="Applications" />
        <NavLink to="/loan-info" icon={<BarChart3 size={20} />} label="Loan Info" />
        <NavLink to="/notifications" icon={<Bell size={20} />} label="Notifications" />
        <NavLink to="/chat-support" icon={<MessageSquare size={20} />} label="Chat Support" />
        <NavLink to="/transactions" icon={<ArrowRightLeft size={20} />} label="Transaction & Capital" />
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-700">
        <NavLink to="/logout" icon={<LogOut size={20} />} label="Logout" />
      </div>
    </aside>
  );
}

function NavLink({ to, icon, label, active = false }: { to: string; icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
        active ? 'bg-teal-500 text-white' : 'text-slate-300 hover:bg-slate-700'
      }`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}
