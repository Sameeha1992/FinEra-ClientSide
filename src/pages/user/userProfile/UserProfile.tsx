// pages/Dashboard.tsx
import { User, FileText, ArrowRightLeft, MessageCircle, BellIcon } from "lucide-react";
import { Outlet } from "react-router-dom";
import {Sidebar} from "@/components/shared/user/Sidebar";
import TopNav from "@/components/shared/user/TopNav";
import ProfilePage from "./ProfilePage";

export default function Dashboard() {
  const sidebarItems = [
    { icon: User, label: "User Profile", route: "/profile" },
    { icon: FileText, label: "Loans", route: "/loans" },
    { icon: FileText, label: "Applications", route: "/applications" },
    { icon: ArrowRightLeft, label: "Transactions", route: "/transactions" },
    { icon: MessageCircle, label: "Chat Support", route: "/chat" },
    { icon: BellIcon, label: "Notifications", route: "/notifications" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Top Navigation */}
      <TopNav />

      {/* Sidebar */}
      <Sidebar items={sidebarItems} />
        
        
      {/* Main Content */}
      <div className="flex-1 ml-64 mt-20 p-8">
        <Outlet /> {/* Render the active route here */}
        <ProfilePage/>
      </div>
    </div>
  );
}
