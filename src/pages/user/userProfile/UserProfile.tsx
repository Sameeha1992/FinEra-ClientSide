// pages/Dashboard.tsx
import { Outlet } from "react-router-dom";
import {Sidebar} from "@/components/shared/user/Sidebar";
import TopNav from "@/components/shared/user/TopNav";
import { useNotificationSocket } from "@/hooks/useNotificationSocket";

export default function Dashboard() {
  useNotificationSocket();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Top Navigation */}
      <TopNav />

      {/* Sidebar */}
      <Sidebar/>
        
        
      {/* Main Content */}
      <div className="flex-1 ml-64 mt-20 p-8">
        <Outlet /> {/* Render the active route here */}
        
      </div>
    </div>
  );
}
