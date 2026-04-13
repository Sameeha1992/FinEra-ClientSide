import { useState, type ReactNode } from "react";
import AdminSidebar from "../admin/shared/AdminSidebar";
import { Menu } from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Mobile Header Bar */}
      <div className="lg:hidden bg-gray-900 text-white p-4 flex items-center justify-between sticky top-0 z-50">
        <h1 className="text-lg font-semibold text-teal-400">FinEra Admin</h1>
        <button 
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="p-1 hover:bg-gray-800 rounded transition-colors"
        >
          <Menu size={24} />
        </button>
      </div>

      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="flex-1 bg-gray-100 p-4 md:p-8 overflow-x-hidden min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
