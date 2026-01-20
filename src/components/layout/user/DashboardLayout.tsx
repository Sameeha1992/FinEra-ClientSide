import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { DashboardSidebar} from "./DashboardSidebar";
import type {SidebarItem } from "./DashboardSidebar"



interface DashboardLayoutProps {
  children: ReactNode;
  sidebarItems?: SidebarItem[];
}

export function DashboardLayout({ children, sidebarItems }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <DashboardSidebar items={sidebarItems} />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
