import type { ReactNode } from "react";
import AdminSidebar from "../admin/shared/AdminSidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="min-h-screen flex">
      <AdminSidebar />
      <main className="flex-1 bg-gray-100 p-8">{children}</main>
    </div>
  );
};

export default AdminLayout;
