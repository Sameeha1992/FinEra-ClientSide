import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/shared/user/Sidebar";
import TopNav from "@/components/shared/user/TopNav";
import { useNotificationSocket } from "@/hooks/useNotificationSocket";

export default function Dashboard() {
  useNotificationSocket();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navigation */}
        <TopNav onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 mt-20 p-4 md:p-8 overflow-y-auto">
          <Outlet /> {/* Render the active route here */}
        </main>
      </div>
    </div>
  );
}
