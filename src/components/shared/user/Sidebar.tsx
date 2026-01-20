import { useNavigate, useLocation } from "react-router-dom";

interface SidebarItem {
  icon: any;
  label: string;
  route: string; // use route instead of id
}

interface SidebarProps {
  items: SidebarItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ items }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="fixed left-0 top-20 bottom-0 w-64 bg-white border-r border-gray-200">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.route;
        return (
          <button
            key={item.route}
            onClick={() => navigate(item.route)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition ${
              isActive ? "bg-teal-600 text-white" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
