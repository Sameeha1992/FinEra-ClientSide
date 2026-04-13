import { authService } from "@/api/AuthServiceAndProfile";
import { clearAuth } from "@/redux/slice/auth.slice";
import type { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";

interface SidebarItem {
  label: string;
  path: string;
}

const sidebarItems: SidebarItem[] = [
  { label: "Dashboard", path: "/admin/dashboard" },
  { label: "Vendor Management", path: "/admin/vendor" },
  { label: "User Management", path: "/admin/user" },
  { label: "Vendor Verification", path: "/admin/vendor-verification" },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { role } = useSelector((state: RootState) => state.auth);

  const handleLogout = async () => {
    try {
      await authService.adminLogout();
    } catch (error) {
      console.log("Logout failed", error);
    } finally {
      dispatch(clearAuth());
      if (role === "admin") {
        navigate("/admin/login");
      }
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-[60] lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-56 bg-gray-900 text-white z-[70] transition-transform duration-300 transform 
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="p-4 border-b border-gray-800 lg:block hidden">
          <h1 className="text-lg font-semibold text-teal-400">FinEra Admin</h1>
        </div>

        <nav className="mt-4">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `block px-4 py-2 transition ${isActive
                  ? "bg-teal-500 text-white"
                  : "text-gray-300 hover:bg-gray-800"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}

          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-800 mt-8"
          >
            Logout
          </button>
        </nav>
      </aside>
    </>
  );
};

export default AdminSidebar;
