import { Link, useLocation } from "react-router-dom";
import {
  User,
  CreditCard,
  FileText,
  ArrowLeftRight,
  MessageCircle,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface SidebarItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface DashboardSidebarProps {
  items?: SidebarItem[];
  logo?: React.ReactNode;
  className?: string;
}

const defaultItems: SidebarItem[] = [
  {
    label: "User Profile",
    href: "/dashboard",
    icon: <User className="w-5 h-5" />,
  },
  {
    label: "Loans",
    href: "/dashboard/loans",
    icon: <CreditCard className="w-5 h-5" />,
  },
  {
    label: "Applications",
    href: "/dashboard/applications",
    icon: <FileText className="w-5 h-5" />,
  },
  {
    label: "Transactions",
    href: "/dashboard/transactions",
    icon: <ArrowLeftRight className="w-5 h-5" />,
  },
  {
    label: "Chat Support",
    href: "/dashboard/support",
    icon: <MessageCircle className="w-5 h-5" />,
  },
  {
    label: "Notifications",
    href: "/dashboard/notifications",
    icon: <Bell className="w-5 h-5" />,
  },
];

export function DashboardSidebar({
  items = defaultItems,
  logo,
  className,
}: DashboardSidebarProps) {
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "w-52 min-h-screen bg-sidebar border-r border-sidebar-border flex flex-col",
        className
      )}
    >
      {/* Logo */}
      <div className="p-4 border-b border-sidebar-border">
        {logo || (
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                F
              </span>
            </div>
          </Link>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-2">
        {items.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "group flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all rounded-md mx-2",
              isActive(item.href)
                ? "bg-primary text-white"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
