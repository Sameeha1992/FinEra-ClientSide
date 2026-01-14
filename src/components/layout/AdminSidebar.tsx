import { NavLink } from "react-router-dom";

interface SidebarItem {
  label: string;
  path: string;
}

const sidebarItems: SidebarItem[] = [
  { label: "Dashboard", path: "/admin/dashboard" },
  { label: "Vendor Management", path: "/admin/vendor" },
  { label: "User Management", path: "/admin/user" },
  { label: "Vendor Verification", path: "/admin/vendor-verification" },
  { label: "Notifications", path: "/admin/notifications" },
];

const AdminSidebar = () => {
  return (
    <aside className="w-56 bg-gray-900 text-white min-h-screen">
      <div className="p-4">
        <h1 className="text-lg font-semibold text-teal-400">FinEra Admin</h1>
      </div>

      <nav className="mt-4">
        {sidebarItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block px-4 py-2 transition ${
                isActive
                  ? "bg-teal-500 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}

        <button className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-800 mt-8">
          Logout
        </button>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
